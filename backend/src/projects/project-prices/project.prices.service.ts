import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorsApp } from 'src/common/errors';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { PricesDto } from 'src/prices/price.dto';
import { PositionsService } from '../positions/positions.service';
import { PriceInterface } from 'src/interfaces/priceInterface';
import { EstimateInterface } from 'src/interfaces/estimate';
import { Helpers } from '../positions/helpers';

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
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const projectPrices = project.prices;
    const newPrice = [...projectPrices, dto];

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
    const projectPrices: PriceInterface[] = project.prices;

    for (let i = 0; i < projectPrices.length; i++) {
      if (projectPrices[i]._id.toString() === priceId.toString()) {
        projectPrices[i].price = dto.price;
        currentTitle = projectPrices[i].title;
      }
    }

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { price: projectPrices } },
      { new: true },
    );

    const estimateList: EstimateInterface[] = project.estimates;
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

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { estimates: estimateList } },
      { new: true },
    );

    await this.positionsService.getTotal(projectId);
    await this.positionsService.getResults(projectId);
    return;
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
    const projectPrices: PriceInterface[] = project.prices;

    const newProjectPriceList = projectPrices.filter(
      ({ _id }) => _id.toString() !== priceId.toString(),
    );

    return await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { prices: newProjectPriceList } },
      { new: true },
    );
  }
}
