import {
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorsApp } from 'src/common/errors';
import { MessageApp } from 'src/common/message';
import { EstimateInterface } from 'src/interfaces/estimate';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { EstimateDto } from 'src/projects/estimates/estimate.dto';
import { EstimatesService } from 'src/projects/estimates/estimates.service';
import { SettingProjectService } from 'src/projects/setting-project/setting.project.service';

@Injectable()
export class LowEstimateService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly estimatesService: EstimatesService,
    private readonly settingService: SettingProjectService,
  ) {}

  async createLowEstimate(
    dto: EstimateDto,
    @Param('projectId') projectId: Types.ObjectId,
  ): Promise<Project> {
    const newEstimateId = new Types.ObjectId();
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
    const exitEstimate = estimateList.some(
      ({ title }) =>
        title.toLocaleLowerCase() === dto.title.toLocaleLowerCase(),
    );
    if (exitEstimate) {
      throw new ConflictException(ErrorsApp.EXIST_ESTIMATE(dto.title));
    }
    const newLowEstimate = await this.projectModel.findByIdAndUpdate(
      projectId,
      { $push: { lowEstimates: { ...dto, id: newEstimateId } } },
      { new: true },
    );
    await this.estimatesService.createEstimate(
      { ...dto, id: newEstimateId },
      projectId,
    );
    return newLowEstimate;
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
    const estimateLowList: EstimateInterface[] = project.lowEstimates;

    if (project.lowEstimates.length === 0) {
      const isEmptyLowEstimate = estimateLowList.some(
        ({ id }) => id.toString() === estimateId.toString(),
      );
      if (!isEmptyLowEstimate) {
        throw new NotFoundException(ErrorsApp.NOT_LOW_ESTIMATES);
      }

      throw new NotFoundException(ErrorsApp.NOT_LOW_ESTIMATES);
    }
    for (let i = 0; i < estimateLowList.length; i++) {
      if (estimateLowList[i].id.toString() === estimateId.toString()) {
        estimateLowList[i].title = dto.title;
      }
    }
    const newEstimateLowList = await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowEstimates: estimateLowList } },
      { new: true },
    );

    await this.estimatesService.updateEstimated(dto, projectId, estimateId);

    return newEstimateLowList;
  }

  async removeEstimateLow(
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
    const estimateLowList: EstimateInterface[] = project.lowEstimates;
    const isEmptyEstimate = estimateLowList.some(
      ({ id }) => id.toString() === estimateId.toString(),
    );
    if (!isEmptyEstimate) {
      throw new NotFoundException(ErrorsApp.NOT_ESTIMATE);
    }

    const newEstimatesLowList = estimateLowList.filter(
      ({ id }) => id.toString() !== estimateId.toString(),
    );

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowEstimates: newEstimatesLowList } },
      { new: true },
    );

    await this.estimatesService.removeEstimate(projectId, estimateId);

    await this.settingService.getTotal(projectId);
    await this.settingService.getResults(projectId);
    return { message: MessageApp.DELETE_ESTIMATE() };
  }
}
