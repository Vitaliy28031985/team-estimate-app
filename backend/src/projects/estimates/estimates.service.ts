import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EstimateInterface } from 'src/interfaces/estimate';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { PositionsService } from '../positions/positions.service';
import { ErrorsApp } from 'src/common/errors';

@Injectable()
export class EstimatesService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly positionsService: PositionsService,
  ) {}

  async createEstimate(
    dto: { title: string },
    @Param('projectId') projectId: Types.ObjectId,
  ): Promise<Project> {
    return await this.projectModel.findByIdAndUpdate(
      projectId,
      { $push: { estimates: dto } },
      { new: true },
    );
  }
  async updateEstimated(
    dto: { title: string },
    @Param('projectId') projectId: Types.ObjectId,
    @Param('estimateId') estimateId: Types.ObjectId,
  ): Promise<Project> {
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );

    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    const estimateList: EstimateInterface[] = project.estimates;

    for (let i = 0; i < estimateList.length; i++) {
      if (estimateList[i]._id.toString() === estimateId.toString()) {
        estimateList[i].title = dto.title;
      }
    }
    return await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { estimates: estimateList } },
      { new: true },
    );
  }

  async removeEstimate(
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

    const estimateList: EstimateInterface[] = project.estimates;
    const isEmptyEstimate = estimateList.some(
      ({ _id }) => _id.toString() === estimateId.toString(),
    );
    if (!isEmptyEstimate) {
      throw new NotFoundException(ErrorsApp.NOT_ESTIMATE);
    }
    const newEstimatesList = estimateList.filter(
      ({ _id }) => _id.toString() !== estimateId.toString(),
    );
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { estimates: newEstimatesList } },
      { new: true },
    );
    await this.positionsService.getTotal(projectId);
    await this.positionsService.getResults(projectId);
    return;
  }
}
