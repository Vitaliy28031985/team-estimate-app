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
import { PositionsService } from '../positions/positions.service';
import { EstimateInterface } from 'src/interfaces/estimate';
import { Helpers } from '../positions/helpers';
import { Price } from 'src/mongo/schemas/price.schema';
import { DiscountDto } from './dto/discount.dto';

@Injectable()
export class SettingProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly positionsService: PositionsService,
    @InjectModel(Price.name) private priceModel: Model<Price>,
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

    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

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

    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

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

    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

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

  async addDiscount(
    dto: DiscountDto,
    @Param('projectId') projectId: Types.ObjectId,
  ) {
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }

    if (typeof dto.discount !== 'number' || !dto.discount) {
      throw new NotFoundException(ErrorsApp.NOT_DISCOUNT);
    }

    const discountConvert =
      dto.discount >= 1 ? dto.discount / 100 : dto.discount;

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { discountPercentage: discountConvert } },
      { new: true },
    );

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { discount: project.total * discountConvert } },
      { new: true },
    );

    await this.positionsService.getResults(projectId);
    return { message: MessageApp.ADD_DISCOUNT(dto.discount) };
  }

  async addLowEstimates(
    dto: DiscountDto,
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

    if (typeof dto.discount !== 'number' || !dto.discount) {
      throw new NotFoundException(ErrorsApp.NOT_DISCOUNT);
    }

    const discountConvert =
      dto.discount >= 1 ? dto.discount / 100 : dto.discount;

    const estimateList: EstimateInterface[] = project.estimates;

    for (let i = 0; i < estimateList.length; i++) {
      const positionsList = estimateList[i].positions;
      for (let i = 0; i < positionsList.length; i++) {
        const currentDiscount = positionsList[i].price * discountConvert;
        const newResult = Helpers.multiplication(
          positionsList[i].number,
          positionsList[i].price - currentDiscount,
        );
        positionsList[i].price = positionsList[i].price - currentDiscount;
        positionsList[i].result = newResult;
      }
      const newTotalEstimates = Helpers.sumData(estimateList[i]);
      estimateList[i].total = newTotalEstimates;
    }

    const lowPrices = await this.priceModel.find({ owner: typedUser._id });

    for (let i = 0; i < lowPrices.length; i++) {
      lowPrices[i].price =
        lowPrices[i].price - lowPrices[i].price * discountConvert;
    }
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowEstimates: estimateList } },
      { new: true },
    );

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowPrices: lowPrices } },
      { new: true },
    );

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowDiscount: discountConvert } },
      { new: true },
    );

    await this.getTotal(projectId);
    await this.getResults(projectId);
    return { message: MessageApp.ADD_LOW_PROJECT(dto.discount) };
  }

  async getTotal(projectId: Types.ObjectId) {
    const projectListForTotal = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    const projectTotal = Helpers.sumLowEstimates(projectListForTotal);
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowTotal: projectTotal } },
      { new: true },
    );
    return;
  }

  async getResults(projectId: Types.ObjectId) {
    const updateListLowGeneral = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    const getLowGeneral =
      updateListLowGeneral.lowTotal +
      updateListLowGeneral.materialsTotal -
      updateListLowGeneral.advancesTotal;
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { lowGeneral: getLowGeneral } },
      { new: true },
    );
    return;
  }
}
