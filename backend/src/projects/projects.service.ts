import { Injectable, NotFoundException, Param, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { CreateProjectDto } from './projects-dtos/create.project.dto';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { ErrorsApp } from 'src/common/errors';
import { UserGet } from 'src/interfaces/userGet';
import { ProjectResponse } from 'src/interfaces/project.response';
import { LowProjectData } from 'src/interfaces/lowData';

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
    const projectsIdArr = [];
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    for (let i = 0; i < user.projectIds.length; i++) {
      const currentId = user.projectIds[i].id;
      const allowProjects = await this.projectModel.find({ _id: currentId });
      projectsIdArr.push(allowProjects[0]);
    }

    const projectsOwns = await this.projectModel.find({ owner: typedUser._id });

    projectsOwns.map((item) => projectsIdArr.push(item));

    const skipCurrent = (page - 1) * limit;

    const endElement =
      projectsIdArr.length < limit ? projectsIdArr.length : skipCurrent + limit;

    const projects = projectsIdArr.slice(skipCurrent, endElement);

    const total = projects.length;

    return { projects, total };
  }

  async getByIdLow(
    @Param('projectId') projectId: Types.ObjectId,
    // @Req() req: RequestWithUser,
  ): Promise<LowProjectData> {
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const lowData: LowProjectData = {
      _id: project._id,
      title: project.title,
      description: project.description,
      prices: project.prices,
      materialsTotal: project.materialsTotal,
      advancesTotal: project.advancesTotal,
      materials: project.materials,
      advances: project.advances,
    };
    return lowData;
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

    const projectsList = await this.projectModel.find();

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
