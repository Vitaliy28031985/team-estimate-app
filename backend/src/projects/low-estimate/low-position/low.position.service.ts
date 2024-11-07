import { Injectable, NotFoundException, Param } from '@nestjs/common';
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

@Injectable()
export class LowPositionService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly estimatesService: EstimatesService,
    private readonly positionsService: PositionsService,
    private readonly settingService: SettingProjectService,
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
      price: newPrice,
    };

    const estimateList: EstimateInterface[] = project.lowEstimates;
    for (let i = 0; i < estimateList.length; i++) {
      if (estimateList[i].id.toString() === estimateId.toString()) {
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
    return;
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

    const stateDiscountConvert: number = project.lowDiscount * dto.price;

    const newPrice = dto.price + stateDiscountConvert;

    const bigPosition = {
      title: dto.title,
      unit: dto.unit,
      number: dto.number,
      price: newPrice,
    };

    const estimateList: EstimateInterface[] = project.lowEstimates;
    for (let i = 0; i < estimateList.length; i++) {
      if (estimateList[i].id.toString() === estimateId.toString()) {
        const positionsList = estimateList[i].positions;
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

    return;
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
    for (let i = 0; i < estimateList.length; i++) {
      if (estimateList[i].id.toString() === estimateId.toString()) {
        const newPositionsList = estimateList[i].positions.filter(
          ({ id }) => id !== positionId,
        );
        estimateList[i].positions = newPositionsList;
        totalPositions = Helpers.sumData(estimateList[i]);
        estimateList[i].total = totalPositions;
      }
    }
    console.log(estimateList);
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

    return;
  }
}
