import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Param,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { User } from 'src/mongo/schemas/user/user.schema';
import { AddAllowDto } from './dto/add.allow.dto';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { ErrorsApp } from 'src/common/errors';
import { UserGet } from 'src/interfaces/userGet';
import { MessageApp } from 'src/common/message';
import { DeleteAllowDto } from './dto/delete.dto';

@Injectable()
export class SettingProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addAllowProject(
    allowDto: AddAllowDto,
    @Param('projectId') projectId: Types.ObjectId,
    @Req() req: RequestWithUser,
  ) {
    const { email, allowLevel, lookAt, lookAtTotals } = allowDto;

    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const users = await this.userModel.find();
    const project = await this.projectModel.findById(
      { owner: typedUser._id, _id: projectId },
      '-createdAt -updatedAt',
    );

    const currentUser = users.filter((user) => user.email === email);

    if (currentUser.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_USER(email));
    }

    if (project.owner.toString() !== typedUser._id.toString()) {
      throw new ForbiddenException(ErrorsApp.ERROR_FORBIDDEN);
    }

    const userId = currentUser[0]._id;
    const userAllowList = currentUser[0].projectIds;

    const isEmptyProject = userAllowList.filter(
      (user) => user.id.toString() === projectId.toString(),
    );

    if (isEmptyProject.length !== 0) {
      throw new ForbiddenException(ErrorsApp.EXISTS_ALLOW(email));
    }

    const allowItem = {
      id: projectId.toString(),
      userId: userId.toString(),
      allowLevel,
      lookAt,
      lookAtTotals,
    };
    userAllowList.push(allowItem);

    const projectAllowList = project.allowList;

    if (!Array.isArray(projectAllowList)) {
      throw new Error('allowList не є масивом');
    }

    projectAllowList.push(userId.toString());

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { allowList: projectAllowList } },
      { new: true },
    );
    await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { projectIds: userAllowList } },
      { new: true },
    );

    return {
      message: MessageApp.ADD_ALLOW(email),
      projectId,
      userId: userId.toString(),
    };
  }

  async updateProjectAllow(
    allowDto: AddAllowDto,
    @Param('projectId') projectId: Types.ObjectId,
    @Req() req: RequestWithUser,
  ) {
    const { email, allowLevel, lookAt, lookAtTotals } = allowDto;

    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const users = await this.userModel.find();
    const project = await this.projectModel.findById(
      { owner: typedUser._id, _id: projectId },
      '-createdAt -updatedAt',
    );

    const currentUser = users.filter((user) => user.email === email);

    if (currentUser.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_USER(email));
    }

    const userId = currentUser[0]._id;

    if (project.owner.toString() !== typedUser._id.toString()) {
      throw new ForbiddenException(ErrorsApp.ERROR_FORBIDDEN);
    }

    const currentProject = currentUser[0].projectIds.filter(
      ({ id }) => id.toString() === projectId.toString(),
    );

    if (currentProject.length === 0) {
      throw new NotFoundException(ErrorsApp.EMPTY_ALLOW(email));
    }

    const newProjectIds = currentUser[0].projectIds;

    for (let i = 0; i < newProjectIds.length; i++) {
      if (newProjectIds[i].id.toString() === projectId.toString()) {
        newProjectIds[i].allowLevel = allowLevel;
        newProjectIds[i].lookAt = lookAt;
        newProjectIds[i].lookAtTotals = lookAtTotals;
      }
    }
    await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { projectIds: newProjectIds } },
      { new: true },
    );

    return {
      message: MessageApp.UPDATE_ALLOW(email),
      projectId,
      userId: userId.toString(),
    };
  }

  async deleteAllowProject(
    allowDto: DeleteAllowDto,
    @Param('projectId') projectId: Types.ObjectId,
    @Req() req: RequestWithUser,
  ) {
    const { email } = allowDto;

    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const users = await this.userModel.find();
    const project = await this.projectModel.findById(
      { owner: typedUser._id, _id: projectId },
      '-createdAt -updatedAt',
    );

    const currentUser = users.filter((user) => user.email === email);

    if (currentUser.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_USER(email));
    }

    const userId = currentUser[0]._id;

    if (project.owner.toString() !== typedUser._id.toString()) {
      throw new ForbiddenException(ErrorsApp.ERROR_FORBIDDEN);
    }

    const userAllowList = currentUser[0].projectIds;

    const ProjectList = project.allowList;

    const isEmptyAllowList = userAllowList.filter(
      (user) => user.id.toString() === projectId.toString(),
    );

    if (!Array.isArray(ProjectList)) {
      throw new Error('allowList не є масивом');
    }

    const isEmptyProjectList = ProjectList.filter(
      (item) => item.toString() === userId.toString(),
    );

    if (isEmptyAllowList.length === 0 || isEmptyProjectList.length === 0) {
      throw new NotFoundException(ErrorsApp.EMPTY_ALLOW(email));
    }

    const newUserAllowList = userAllowList.filter(
      (user) => user.id.toString() !== projectId.toString(),
    );
    const newProjectList = ProjectList.filter(
      (item) => item.toString() !== userId.toString(),
    );
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { allowList: newProjectList } },
      { new: true },
    );

    await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { projectIds: newUserAllowList } },
      { new: true },
    );

    return {
      message: MessageApp.DELETE_ALLOW(email),
      projectId,
      userId: userId.toString(),
    };
  }
}