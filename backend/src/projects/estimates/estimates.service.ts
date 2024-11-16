import {
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EstimateInterface } from 'src/interfaces/estimate';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { PositionsService } from '../positions/positions.service';
import { ErrorsApp } from 'src/common/errors';
import { MessageApp } from 'src/common/message';
import { EstimateDto } from './estimate.dto';

@Injectable()
export class EstimatesService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly positionsService: PositionsService,
  ) {}

  async createEstimate(
    dto: EstimateDto,
    @Param('projectId') projectId: Types.ObjectId,
  ): Promise<Project> {
    const newEstimateId = !dto.id ? new Types.ObjectId() : dto.id;
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );

    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const estimates = project.estimates;
    if (estimates.length !== 0) {
      const isEmptyEstimate = estimates.some(
        ({ title }) => title === dto.title,
      );
      if (isEmptyEstimate) {
        throw new ConflictException(ErrorsApp.EXIST_ESTIMATE(dto.title));
      }
    }
    return await this.projectModel.findByIdAndUpdate(
      projectId,
      { $push: { estimates: { ...dto, id: newEstimateId } } },
      { new: true },
    );
  }
  async updateEstimated(
    dto: EstimateDto,
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
      if (estimateList[i].id.toString() === estimateId.toString()) {
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
      ({ id }) => id.toString() === estimateId.toString(),
    );
    if (!isEmptyEstimate) {
      throw new NotFoundException(ErrorsApp.NOT_ESTIMATE);
    }
    const newEstimatesList = estimateList.filter(
      ({ id }) => id.toString() !== estimateId.toString(),
    );
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { estimates: newEstimatesList } },
      { new: true },
    );
    await this.positionsService.getTotal(projectId);
    await this.positionsService.getResults(projectId);
    return { message: MessageApp.DELETE_ESTIMATE() };
  }
}
