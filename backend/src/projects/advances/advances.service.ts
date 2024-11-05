import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { PositionsService } from '../positions/positions.service';
import { AdvanceDto } from './advance.dto';
import { ErrorsApp } from 'src/common/errors';
import { Helpers } from '../positions/helpers';

@Injectable()
export class AdvancesService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly positionsService: PositionsService,
  ) {}
  async createAdvances(
    dto: AdvanceDto,
    @Param('projectId') projectId: Types.ObjectId,
  ) {
    const newId = uuidv4();

    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    const newAdvance = project.advances;

    newAdvance.push({
      id: newId,
      comment: dto.comment,
      date: dto.date,
      sum: dto.sum,
    });

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { advances: newAdvance } },
      { new: true },
    );

    await this.getTotal(projectId);
    await this.positionsService.getResults(projectId);
    return;
  }

  async updateAdvance(
    dto: AdvanceDto,
    @Param('projectId') projectId: Types.ObjectId,
    @Param('advancesId') advancesId: string,
  ) {
    const newAdvanceList = [];
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const advanceArr = project.advances;

    for (let i = 0; i < advanceArr.length; i++) {
      if (advanceArr[i].id === advancesId) {
        newAdvanceList.push({
          id: advanceArr[i].id,
          ...dto,
        });
      } else {
        newAdvanceList.push({
          id: advanceArr[i].id,
          comment: advanceArr[i].comment,
          date: advanceArr[i].date,
          sum: advanceArr[i].sum,
        });
      }
    }

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { advances: newAdvanceList } },
      { new: true },
    );

    await this.getTotal(projectId);
    await this.positionsService.getResults(projectId);
    return;
  }

  async removeAdvance(
    @Param('projectId') projectId: Types.ObjectId,
    @Param('advancesId') advancesId: string,
  ) {
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const newAdvancesList = project.advances.filter(
      ({ id }) => id !== advancesId,
    );

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { advances: newAdvancesList } },
      { new: true },
    );
    await this.getTotal(projectId);
    await this.positionsService.getResults(projectId);
    return;
  }

  async getTotal(projectId: Types.ObjectId) {
    const advancesArray = await this.projectModel.findById(projectId);
    const sumAdvance = Helpers.sumMaterials(advancesArray.advances);

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { advancesTotal: sumAdvance } },
      { new: true },
    );
    return;
  }
}
