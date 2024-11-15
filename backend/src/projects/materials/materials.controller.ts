import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { ProjectGuard } from '../project/project.guard';
import { MaterialDto } from './material.dto';
import { Types } from 'mongoose';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post(':projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async create(
    @Body() dto: MaterialDto,
    @Param('projectId') projectId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.materialsService.createMaterial(dto, objectId);
  }

  @Patch('/:projectId/:materialsId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async update(
    @Body() dto: MaterialDto,
    @Param('projectId') projectId: string,
    @Param('materialsId') materialsId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    await this.materialsService.updateMaterial(dto, objectId, materialsId);
  }

  @Delete('/:projectId/:materialsId')
  @UseGuards(ProjectGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('materialsId') materialsId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    await this.materialsService.remove(objectId, materialsId);
  }
}
