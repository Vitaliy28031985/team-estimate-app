import {
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorsApp } from 'src/common/errors';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { PricesDto } from 'src/prices/price.dto';
import { PositionsService } from '../positions/positions.service';
import { EstimateInterface } from 'src/interfaces/estimate';
import { Helpers } from '../positions/helpers';
import { MessageApp } from 'src/common/message';
import { PriceInterfaceLow } from 'src/interfaces/price.interface';

@Injectable()
export class ProjectPricesService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly positionsService: PositionsService,
  ) {}

  async createPrice(
    dto: PricesDto,
    @Param('projectId') projectId: Types.ObjectId,
  ) {
    const newPriceId = !dto.id ? new Types.ObjectId() : dto.id;

    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const projectPrices = project.prices;
    const isEmptyPrice = projectPrices.some(
      ({ title }) =>
        title.toLocaleLowerCase() === dto.title.toLocaleLowerCase(),
    );
    if (isEmptyPrice) {
      throw new ConflictException(ErrorsApp.EXIST_PRICE(dto.title));
    }
    const newDto = {
      id: newPriceId,
      title: dto.title,
      price: dto.price,
    };
    const newPrice = [...projectPrices, newDto];

    return await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { prices: newPrice } },
      { new: true },
    );
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
    const projectPrices: PriceInterfaceLow[] = project.prices;

    if (projectPrices.length !== 0) {
      for (let i = 0; i < projectPrices.length; i++) {
        if (projectPrices[i].id.toString() === priceId.toString()) {
          projectPrices[i].title = dto.title;
          projectPrices[i].price = dto.price;
          currentTitle = projectPrices[i].title;
        }
      }
    }

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { prices: projectPrices } },
      { new: true },
    );

    const estimateList: EstimateInterface[] = project.estimates;
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
      { $set: { estimates: estimateList } },
      { new: true },
    );

    await this.positionsService.getTotal(projectId);
    await this.positionsService.getResults(projectId);
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
    const projectPrices: PriceInterfaceLow[] = project.prices;

    const newProjectPriceList = projectPrices.filter(
      ({ id }) => id.toString() !== priceId.toString(),
    );

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { prices: newProjectPriceList } },
      { new: true },
    );
    return { message: MessageApp.DELETE_PRICE };
  }
}
