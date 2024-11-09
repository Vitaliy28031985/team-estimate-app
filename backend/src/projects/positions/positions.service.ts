import {
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { CreatePositionDto } from './position-dto/position.create.dto';
import { Helpers } from './helpers';
import { EstimateInterface } from 'src/interfaces/estimate';
import { ErrorsApp } from 'src/common/errors';
import { MessageApp } from 'src/common/message';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async createPosition(
    dto: CreatePositionDto,
    @Param('projectId') projectId: Types.ObjectId,
    @Param('estimateId') estimateId: Types.ObjectId,
  ) {
    const newId = !dto.id ? uuidv4() : dto.id;
    let totalPositions = null;
    const positionNew = {
      id: newId,
      title: dto.title,
      unit: dto.unit,
      number: dto.number,
      price: dto.price,
      result: Helpers.multiplication(dto.number, dto.price),
    };

    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );

    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    const estimateList: EstimateInterface[] = project.estimates;

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
      { $set: { estimates: estimateList } },
      { new: true },
    );

    await this.getTotal(projectId);
    await this.getResults(projectId);
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

    const estimateList: EstimateInterface[] = project.estimates;
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
            positionsList[i].title = dto.title;
            positionsList[i].unit = dto.unit;
            positionsList[i].number = dto.number;
            positionsList[i].price = dto.price;
            positionsList[i].result = Helpers.multiplication(
              dto.number,
              dto.price,
            );
          }
        }
        totalPositions = Helpers.sumData(estimateList[i]);
        estimateList[i].total = totalPositions;
      }
    }
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { estimates: estimateList } },
      { new: true },
    );

    await this.getTotal(projectId);
    await this.getResults(projectId);
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

    const estimateList: EstimateInterface[] = project.estimates;

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
      { $set: { estimates: estimateList } },
      { new: true },
    );
    await this.getTotal(projectId);
    await this.getResults(projectId);
    return { message: MessageApp.DELETE_POSITION };
  }

  async getTotal(projectId: Types.ObjectId) {
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );

    const totalEstimates = Helpers.sumEstimate(project);

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { total: totalEstimates } },
      { new: true },
    );
  }

  async getResults(projectId: Types.ObjectId) {
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );

    const NewDiscount = project.total * project.discountPercentage;
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { discount: NewDiscount } },
      { new: true },
    );

    const generalArray = await this.projectModel.findById(projectId);
    const generalResult = Helpers.getGeneral(
      generalArray.total,
      generalArray.materialsTotal,
      generalArray.advancesTotal,
      NewDiscount,
    );

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { general: generalResult } },
      { new: true },
    );
  }
}
