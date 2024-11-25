import {
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { PositionsService } from '../positions/positions.service';
import { MaterialDto } from './material.dto';
import { ErrorsApp } from 'src/common/errors';
import { Helpers } from '../positions/helpers';
import { MessageApp } from 'src/common/message';
import { SettingProjectService } from '../setting-project/setting.project.service';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly positionsService: PositionsService,
    private readonly settingService: SettingProjectService,
  ) {}

  async createMaterial(
    dto: MaterialDto,
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
    const materialList = project.materials;
    const isEmptyMaterial = materialList.some(
      ({ order }) => order === dto.order,
    );

    if (isEmptyMaterial) {
      throw new ConflictException(ErrorsApp.EXIST_MATERIAL(dto.order));
    }

    materialList.push({
      id: newId,
      title: dto.title,
      order: dto.order,
      date: dto.date,
      sum: dto.sum,
    });
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { materials: materialList } },
      { new: true },
    );

    await this.getTotal(projectId);

    await this.positionsService.getResults(projectId);
    await this.settingService.getResults(projectId);
    return { message: MessageApp.CREATE_MATERIALS(dto.title) };
  }

  async updateMaterial(
    dto: MaterialDto,
    @Param('projectId') projectId: Types.ObjectId,
    @Param('materialsId') materialsId: string,
  ) {
    const newMaterialsList = [];
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const materialList = project.materials;

    const isEmptyMaterial = materialList.some(({ id }) => id === materialsId);
    if (!isEmptyMaterial) {
      throw new NotFoundException(ErrorsApp.NOT_MATERIAL);
    }

    for (let i = 0; i < materialList.length; i++) {
      if (materialList[i].id === materialsId) {
        newMaterialsList.push({
          id: materialList[i].id,
          ...dto,
        });
      } else {
        newMaterialsList.push({
          id: materialList[i].id,
          title: materialList[i].title,
          order: materialList[i].order,
          date: materialList[i].date,
          sum: materialList[i].sum,
        });
      }
    }

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { materials: newMaterialsList } },
      { new: true },
    );

    await this.getTotal(projectId);

    await this.positionsService.getResults(projectId);
    await this.settingService.getResults(projectId);
    return { message: MessageApp.UPDATE_MATERIAL(dto.title) };
  }

  async remove(
    @Param('projectId') projectId: Types.ObjectId,
    @Param('materialsId') materialsId: string,
  ) {
    const project = await this.projectModel.findById(
      projectId,
      '-createdAt -updatedAt',
    );
    if (!project) {
      throw new NotFoundException(ErrorsApp.NOT_PROJECT);
    }
    const materialList = project.materials;

    const isEmptyMaterial = materialList.some(({ id }) => id === materialsId);
    if (!isEmptyMaterial) {
      throw new NotFoundException(ErrorsApp.NOT_MATERIAL);
    }

    const newMaterialsList = project.materials.filter(
      ({ id }) => id !== materialsId,
    );

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { materials: newMaterialsList } },
      { new: true },
    );

    await this.getTotal(projectId);

    await this.positionsService.getResults(projectId);
    await this.settingService.getResults(projectId);
    return { message: MessageApp.DELETE_MATERIAL };
  }

  async getTotal(projectId: Types.ObjectId) {
    const materialsArray = await this.projectModel.findById(projectId);
    const sumMaterial = Helpers.sumMaterials(materialsArray.materials);

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: { materialsTotal: sumMaterial } },
      { new: true },
    );
    return;
  }
}
