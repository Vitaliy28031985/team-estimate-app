import {
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ErrorsApp } from 'src/common/errors';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { EstimatesService } from 'src/projects/estimates/estimates.service';
import { CreatePositionDto } from 'src/projects/positions/position-dto/position.create.dto';
import { PositionsService } from 'src/projects/positions/positions.service';
import { SettingProjectService } from 'src/projects/setting-project/setting.project.service';
import { Helpers } from 'src/projects/positions/helpers';
import { EstimateInterface } from 'src/interfaces/estimate';
import { MessageApp } from 'src/common/message';
import { PriceInterfaceLow } from 'src/interfaces/price.interface';

@Injectable()
export class LowPositionService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly estimatesService: EstimatesService,
    private readonly positionsService: PositionsService,
    public readonly settingService: SettingProjectService,
  ) {}

  async createPosition(
    dto: CreatePositionDto,
    @Param('projectId') projectId: Types.ObjectId,
    @Param('estimateId') estimateId: Types.ObjectId,
  ) {
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );

    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    if (project.lowEstimates.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_LOW_ESTIMATES);
    }

    let allow: boolean = true;
    let allowPriceBig: number = null;

    const prices: PriceInterfaceLow[] = project.prices;

    if (prices.length !== 0) {
      for (let i = 0; i < prices.length; i++) {
        if (
          prices[i].title.toLocaleLowerCase() === dto.title.toLocaleLowerCase()
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          allowPriceBig = prices[i].price;
        }
      }
    }

    const lowPrices: PriceInterfaceLow[] = project.lowPrices;
    if (lowPrices.length !== 0) {
      for (let i = 0; i < lowPrices.length; i++) {
        if (
          lowPrices[i].title.toLocaleLowerCase() ===
          dto.title.toLocaleLowerCase()
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          allow = lowPrices[i].updateAllow;
        }
      }
    }

    const newId = uuidv4();
    let totalPositions = null;
    const positionNew = {
      id: newId,
      title: dto.title,
      unit: dto.unit,
      number: dto.number,
      price: dto.price,
      result: Helpers.multiplication(dto.number, dto.price),
    };

    const stateDiscountConvert: number = project.lowDiscount * dto.price;

    const newPrice = dto.price + stateDiscountConvert;

    const bigPosition = {
      id: newId,
      title: dto.title,
      unit: dto.unit,
      number: dto.number,
      price: allow ? newPrice : allowPriceBig,
    };

    const estimateList: EstimateInterface[] = project.lowEstimates;
    const isEmptyEstimate = estimateList.some(
      ({ id }) => id.toString() === estimateId.toString(),
    );
    if (!isEmptyEstimate) {
      throw new NotFoundException(ErrorsApp.NOT_ESTIMATE);
    }

    for (let i = 0; i < estimateList.length; i++) {
      if (estimateList[i].id.toString() === estimateId.toString()) {
        const positionsList = estimateList[i].positions;
        const existPosition = positionsList.some(
          ({ title }) => title.toLowerCase() === dto.title.toLocaleLowerCase(),
        );
        if (existPosition) {
          throw new ConflictException(ErrorsApp.EXIST_POSITION(dto.title));
        }
        estimateList[i].positions.push(positionNew);
        totalPositions = Helpers.sumData(estimateList[i]);
        estimateList[i].total = totalPositions;
      }
    }
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowEstimates: estimateList } },
      { new: true },
    );

    await this.settingService.getTotal(projectId);
    await this.settingService.getResults(projectId);

    await this.positionsService.createPosition(
      bigPosition,
      projectId,
      estimateId,
    );
    return { message: MessageApp.CREATE_POSITION(dto.title) };
  }

  async updatePosition(
    dto: CreatePositionDto,
    @Param('projectId') projectId: Types.ObjectId,
    @Param('estimateId') estimateId: Types.ObjectId,
    @Param('positionId') positionId: string,
  ) {
    let totalPositions = null;
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );

    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    if (project.lowEstimates.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_LOW_ESTIMATES);
    }
    let allow: boolean = true;
    let allowPrice: number = null;
    let allowTitle: string = '';
    let allowPriceBig: number = null;

    const prices: PriceInterfaceLow[] = project.prices;

    if (prices.length !== 0) {
      for (let i = 0; i < prices.length; i++) {
        if (
          prices[i].title.toLocaleLowerCase() === dto.title.toLocaleLowerCase()
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          allowPriceBig = prices[i].price;
        }
      }
    }

    const lowPrices: PriceInterfaceLow[] = project.lowPrices;
    if (lowPrices.length !== 0) {
      for (let i = 0; i < lowPrices.length; i++) {
        if (
          lowPrices[i].title.toLocaleLowerCase() ===
          dto.title.toLocaleLowerCase()
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          allow = lowPrices[i].updateAllow;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          allowPrice = lowPrices[i].price;
          allowTitle = lowPrices[i].title;
        }
      }
    }

    const stateDiscountConvert: number = project.lowDiscount * dto.price;

    const newPrice = dto.price + stateDiscountConvert;

    const positionNew = {
      title: allow ? dto.title : allowTitle,
      unit: dto.unit,
      number: dto.number,
      price: allow ? dto.price : allowPrice,
      result: Helpers.multiplication(
        dto.number,
        allow ? dto.price : allowPrice,
      ),
    };

    const bigPosition = {
      title: allow ? dto.title : allowTitle,
      unit: dto.unit,
      number: dto.number,
      price: allow ? newPrice : allowPriceBig,
    };
    const estimateList: EstimateInterface[] = project.lowEstimates;

    const isEmptyEstimate = estimateList.some(
      ({ id }) => id.toString() === estimateId.toString(),
    );
    if (!isEmptyEstimate) {
      throw new NotFoundException(ErrorsApp.NOT_ESTIMATE);
    }

    for (let i = 0; i < estimateList.length; i++) {
      if (estimateList[i].id.toString() === estimateId.toString()) {
        const positionsList = estimateList[i].positions;
        const isEmptyPosition = positionsList.some(
          ({ id }) => id === positionId,
        );

        if (!isEmptyPosition) {
          throw new NotFoundException(ErrorsApp.NOT_POSITION);
        }
        for (let i = 0; i < positionsList.length; i++) {
          if (positionsList[i].id === positionId) {
            positionsList[i].title = positionNew.title;
            positionsList[i].unit = positionNew.unit;
            positionsList[i].number = positionNew.number;
            positionsList[i].price = positionNew.price;
            positionsList[i].result = positionNew.result;
          }
        }
        totalPositions = Helpers.sumData(estimateList[i]);
        estimateList[i].total = totalPositions;
      }
    }
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowEstimates: estimateList } },
      { new: true },
    );

    await this.settingService.getTotal(projectId);
    await this.settingService.getResults(projectId);

    await this.positionsService.updatePosition(
      bigPosition,
      projectId,
      estimateId,
      positionId,
    );

    return { message: MessageApp.UPDATE_POSITION(dto.title) };
  }

  async removePosition(
    @Param('projectId') projectId: Types.ObjectId,
    @Param('estimateId') estimateId: Types.ObjectId,
    @Param('positionId') positionId: string,
  ) {
    let totalPositions = null;
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );

    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    if (project.lowEstimates.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_LOW_ESTIMATES);
    }

    const estimateList: EstimateInterface[] = project.lowEstimates;
    const isEmptyEstimate = estimateList.some(
      ({ id }) => id.toString() === estimateId.toString(),
    );
    if (!isEmptyEstimate) {
      throw new NotFoundException(ErrorsApp.NOT_ESTIMATE);
    }
    for (let i = 0; i < estimateList.length; i++) {
      if (estimateList[i].id.toString() === estimateId.toString()) {
        const positionsList = estimateList[i].positions;
        const isEmptyPosition = positionsList.some(
          ({ id }) => id === positionId,
        );

        if (!isEmptyPosition) {
          throw new NotFoundException(ErrorsApp.NOT_POSITION);
        }
        const newPositionsList = estimateList[i].positions.filter(
          ({ id }) => id !== positionId,
        );
        estimateList[i].positions = newPositionsList;
        totalPositions = Helpers.sumData(estimateList[i]);
        estimateList[i].total = totalPositions;
      }
    }
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowEstimates: estimateList } },
      { new: true },
    );

    await this.settingService.getTotal(projectId);
    await this.settingService.getResults(projectId);

    await this.positionsService.removePosition(
      projectId,
      estimateId,
      positionId,
    );

    return { message: MessageApp.DELETE_POSITION };
  }
}
