import {
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { CreateProjectDto } from './projects-dtos/create.project.dto';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { UserGet } from 'src/interfaces/userGet';
import { Price } from 'src/mongo/schemas/price.schema';
import { ErrorsApp } from 'src/common/errors';
import { AlowUserList } from 'src/interfaces/alow.user.list';
import { User } from 'src/mongo/schemas/user/user.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Price.name) private priceModel: Model<Price>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getAll(
    @Req() req: RequestWithUser,
    page: number = 1,
    limit: number = 1,
  ) {
    const projectsIdArr = [];
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    if (typedUser.role === 'admin') {
      const projects = await this.projectModel.find();
      projectsIdArr.push(projects);
    } else {
      for (let i = 0; i < user.projectIds.length; i++) {
        const currentId = user.projectIds[i].id;
        const allowProjects = await this.projectModel.find({ _id: currentId });
        projectsIdArr.push(allowProjects[0]);
      }

      const projectsOwns = await this.projectModel.find({
        owner: typedUser._id,
      });

      projectsOwns.map((item) => projectsIdArr.push(item));
    }

    const skipCurrent = (page - 1) * limit;

    const endElement =
      projectsIdArr.length < limit ? projectsIdArr.length : skipCurrent + limit;

    const selectKeyProjects = projectsIdArr.map(
      ({ _id, title, description }) => ({
        _id,
        title,
        description,
      }),
    );

    const projects = selectKeyProjects.slice(skipCurrent, endElement);

    const total = projects.length;

    return { projects, total };
  }
  async getById(
    @Param('projectId') projectId: Types.ObjectId,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    if (
      project.owner.toString() === typedUser._id.toString() ||
      typedUser.role === 'admin'
    ) {
      return await this.projectModel.findById(
        projectId,
        '-createdAt -updatedAt',
      );
    }
    const userProjectsArray: AlowUserList[] = typedUser.projectIds;

    const isEmptyProjectId = userProjectsArray.some(
      ({ id }) => id === projectId.toString(),
    );

    if (isEmptyProjectId) {
      const currentProjectId: AlowUserList[] = userProjectsArray.filter(
        ({ id }) => id === projectId.toString(),
      );

      if (
        currentProjectId[0].lookAt === 'small' &&
        currentProjectId[0].lookAtTotals === 'show'
      ) {
        return await {
          _id: project._id,
          title: project.title,
          description: project.description,
          materialsTotal: project.materialsTotal,
          advancesTotal: project.advancesTotal,
          materials: project.materials,
          advances: project.advances,
          lowPrices: project.lowPrices,
          lowEstimates: project.lowEstimates,
          lowTotal: project.lowTotal,
          lowGeneral: project.lowGeneral,
        };
      }
      if (
        currentProjectId[0].lookAt === 'small' &&
        currentProjectId[0].lookAtTotals === 'notShow'
      ) {
        return await {
          _id: project._id,
          title: project.title,
          description: project.description,
          lowPrices: project.lowPrices,
          lowEstimates: project.lowEstimates,
          lowTotal: project.lowTotal,
        };
      }

      if (
        currentProjectId[0].lookAt === 'large' &&
        currentProjectId[0].lookAtTotals === 'show'
      ) {
        return await {
          _id: project._id,
          title: project.title,
          description: project.description,
          materials: project.materials,
          advances: project.advances,
          prices: project.prices,
          estimates: project.estimates,
          total: project.total,
          materialsTotal: project.materialsTotal,
          advancesTotal: project.advancesTotal,
          general: project.general,
          discount: project.discount,
          discountPercentage: project.discountPercentage,
        };
      }

      if (
        currentProjectId[0].lookAt === 'large' &&
        currentProjectId[0].lookAtTotals === 'notShow'
      ) {
        return await {
          _id: project._id,
          title: project.title,
          description: project.description,
          prices: project.prices,
          estimates: project.estimates,
          total: project.total,
        };
      }

      if (
        currentProjectId[0].lookAt === 'all' &&
        currentProjectId[0].lookAtTotals === 'show'
      ) {
        return await {
          _id: project._id,
          title: project.title,
          description: project.description,
          materials: project.materials,
          advances: project.advances,
          prices: project.prices,
          estimates: project.estimates,
          lowEstimates: project.lowEstimates,
          lowPrices: project.lowPrices,
          lowTotal: project.lowTotal,
          lowGeneral: project.lowGeneral,
          total: project.total,
          materialsTotal: project.materialsTotal,
          advancesTotal: project.advancesTotal,
          general: project.general,
          discount: project.discount,
          discountPercentage: project.discountPercentage,
        };
      }

      if (
        currentProjectId[0].lookAt === 'all' &&
        currentProjectId[0].lookAtTotals === 'notShow'
      ) {
        return await {
          _id: project._id,
          title: project.title,
          description: project.description,
          prices: project.prices,
          estimates: project.estimates,
          lowEstimates: project.lowEstimates,
          lowPrices: project.lowPrices,
          lowTotal: project.lowTotal,
          total: project.total,
        };
      }
    }
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
    const projects = await this.projectModel.find({ owner: typedUser._id });

    const isEmptyProject = projects.some(
      ({ title }) => title === projectDto.title,
    );

    if (isEmptyProject) {
      throw new ConflictException(ErrorsApp.EXIST_PROJECT(projectDto.title));
    }
    const prices = await this.priceModel.find({ owner: typedUser._id });
    const newProject = await this.projectModel.create({
      ...projectDto,
      prices,
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
    this.deleteAlowUser(projectId);
    return await this.projectModel.findOneAndDelete({
      owner: typedUser._id,
      _id: projectId,
    });
  }

  async deleteAlowUser(@Param('projectId') projectId: Types.ObjectId) {
    const users = await this.userModel.find();
    for (let i = 0; i < users.length; i++) {
      const newAlowList = users[i].projectIds.filter(
        ({ id }) => id !== projectId.toString(),
      );
      await this.userModel.findByIdAndUpdate(
        users[i]._id,
        { $set: { projectIds: newAlowList } },
        { new: true },
      );
    }
  }
}
