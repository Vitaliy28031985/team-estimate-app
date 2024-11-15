import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { ProjectPricesService } from '../project-prices/project.prices.service';
import { PricesDto } from 'src/prices/price.dto';
import { ErrorsApp } from 'src/common/errors';
import { LowPositionService } from '../low-estimate/low-position/low.position.service';
import { PriceInterfaceLow } from 'src/interfaces/price.interface';
import { EstimateInterface } from 'src/interfaces/estimate';
import { Helpers } from '../positions/helpers';
import { MessageApp } from 'src/common/message';

@Injectable()
export class LowProjectPriceService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly projectPricesService: ProjectPricesService,
    private readonly lowPositionService: LowPositionService,
  ) {}

  async createPrice(
    dto: PricesDto,
    @Param('projectId') projectId: Types.ObjectId,
  ) {
    const newPriceId = new Types.ObjectId();

    const newDto = {
      id: newPriceId,
      title: dto.title,
      price: dto.price,
      updateAllow: true,
    };

    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const projectPrices = project.lowPrices;
    const isEmptyPrice = projectPrices.some(
      ({ title }) =>
        title.toLocaleLowerCase() === dto.title.toLocaleLowerCase(),
    );

    if (isEmptyPrice) {
      throw new ConflictException(ErrorsApp.EXIST_PRICE(dto.title));
    }
    const newPrice = [...projectPrices, newDto];

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowPrices: newPrice } },
      { new: true },
    );

    const discount = project.lowDiscount;

    const bigDto = {
      id: newPriceId,
      title: dto.title,
      price: dto.price + dto.price * discount,
      updateAllow: true,
    };

    await this.projectPricesService.createPrice(bigDto, projectId);

    return newDto;
  }

  async updatePrice(
    dto: PricesDto,
    @Param('projectId') projectId: Types.ObjectId,
    @Param('priceId') priceId: string,
  ) {
    let currentTitle = '';
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const projectPrices: PriceInterfaceLow[] = project.lowPrices;

    if (projectPrices.length !== 0) {
      for (let i = 0; i < projectPrices.length; i++) {
        if (projectPrices[i].id.toString() === priceId.toString()) {
          const allow = projectPrices[i].updateAllow;
          if (allow === false) {
            throw new ForbiddenException(ErrorsApp.FORBIDDEN_PRICE_UPDATE);
          }
          projectPrices[i].title = dto.title;
          projectPrices[i].price = dto.price;
          currentTitle = projectPrices[i].title;
        }
      }
    }
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowPrices: projectPrices } },
      { new: true },
    );

    const discount = project.lowDiscount;

    const bigDto = {
      title: dto.title,
      price: dto.price + dto.price * discount,
      updateAllow: true,
    };
    await this.projectPricesService.updatePrice(bigDto, projectId, priceId);

    const estimateList: EstimateInterface[] = project.lowEstimates;

    if (estimateList.length !== 0) {
      for (let i = 0; i < estimateList.length; i++) {
        const positionList = estimateList[i].positions;
        for (let i = 0; i < positionList.length; i++) {
          if (positionList[i].title === currentTitle) {
            positionList[i].id = positionList[i].id;
            positionList[i].title = dto.title;
            positionList[i].unit = positionList[i].unit;
            positionList[i].number = positionList[i].number;
            positionList[i].price = dto.price;
            positionList[i].result = Helpers.multiplication(
              positionList[i].number,
              dto.price,
            );
          }
        }
        estimateList[i].total = Helpers.sumData(estimateList[i]);
      }
    }

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowEstimates: estimateList } },
      { new: true },
    );

    await this.lowPositionService.settingService.getTotal(projectId);
    await this.lowPositionService.settingService.getResults(projectId);
    await this.projectPricesService.updatePrice(bigDto, projectId, priceId);
    return { message: MessageApp.UPDATE_PROJECT_PRICE(dto.title) };
  }

  async removePrice(
    @Param('projectId') projectId: Types.ObjectId,
    @Param('priceId') priceId: string,
  ) {
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const projectPrices: PriceInterfaceLow[] = project.lowPrices;

    const allow = projectPrices.filter(
      ({ id }) => id.toString() === priceId.toString(),
    );

    if (allow[0].updateAllow === false) {
      throw new ForbiddenException(ErrorsApp.FORBIDDEN_PRICE_UPDATE);
    }

    const newProjectPriceList = projectPrices.filter(
      ({ id }) => id.toString() !== priceId.toString(),
    );

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowPrices: newProjectPriceList } },
      { new: true },
    );
    await this.projectPricesService.removePrice(projectId, priceId);
    return { message: MessageApp.DELETE_PRICE };
  }
}
