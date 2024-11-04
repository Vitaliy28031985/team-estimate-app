import { Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EstimateInterface } from 'src/interfaces/estimate';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { User } from 'src/mongo/schemas/user/user.schema';

@Injectable()
export class EstimatesService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(User.name) private userModel: Model<User>,
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
}
