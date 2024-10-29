import { Injectable, NotFoundException, Param, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { CreateProjectDto } from './projects-dtos/create.project.dto';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { ErrorsApp } from 'src/common/errors';
import { UserGet } from 'src/interfaces/userGet';
import { ProjectResponse } from 'src/interfaces/project.response';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async getAll(
    @Req() req: RequestWithUser,
    page: number = 1,
    limit: number = 1,
  ): Promise<ProjectResponse> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;
    const skipCurrent = (page - 1) * limit;
    const projects = await this.projectModel
      .find({ owner: typedUser._id })
      .skip(skipCurrent)
      .limit(limit)
      .exec();

    const total = await this.projectModel.countDocuments({
      owner: typedUser._id,
    });

    return { projects, total };
  }

  async create(
    projectDto: CreateProjectDto,
    @Req() req: RequestWithUser,
  ): Promise<Project> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;
    const newProject = this.projectModel.create({
      ...projectDto,
      owner: typedUser,
    });
    return newProject;
  }

  async update(
    @Param('projectId') projectId: Types.ObjectId,
    projectDto: CreateProjectDto,
    @Req() req: RequestWithUser,
  ): Promise<Project> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const projectsList = await this.projectModel.find({
      owner: typedUser._id,
    });

    if (projectsList.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    const currentProject = projectsList.some(
      ({ _id }) => _id.toString() === String(projectId),
    );

    if (!currentProject) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    return await this.projectModel.findByIdAndUpdate(
      { owner: typedUser._id, _id: projectId },
      projectDto,
      { new: true, fields: ['-createdAt', '-updatedAt'] },
    );
  }

  async remove(
    @Param('projectId') projectId: Types.ObjectId,
    @Req() req: RequestWithUser,
  ): Promise<Project> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const projectsList = await this.projectModel.find({
      owner: typedUser._id,
    });

    if (projectsList.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    const currentProject = projectsList.some(
      ({ _id }) => _id.toString() === String(projectId),
    );

    if (!currentProject) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    return await this.projectModel.findOneAndDelete({
      owner: typedUser._id,
      _id: projectId,
    });
  }
}
