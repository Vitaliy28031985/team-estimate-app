import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdvancesService } from './advances.service';
import { ProjectGuard } from '../project/project.guard';
import { AdvanceDto } from './advance.dto';
import { Types } from 'mongoose';
import { Helpers } from '../positions/helpers';
import { ErrorsApp } from 'src/common/errors';

@Controller('advances')
export class AdvancesController {
  constructor(private readonly advancesService: AdvancesService) {}

  @Post('/:projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async create(@Body() dto: AdvanceDto, @Param('projectId') projectId: string) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.advancesService.createAdvances(dto, objectId);
  }

  @Patch('/:projectId/:advancesId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async update(
    @Body() dto: AdvanceDto,
    @Param('projectId') projectId: string,
    @Param('advancesId') advancesId: string,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.advancesService.updateAdvance(dto, objectId, advancesId);
  }
  @Delete('/:projectId/:advancesId')
  @UseGuards(ProjectGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('advancesId') advancesId: string,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    await this.advancesService.removeAdvance(objectId, advancesId);
  }
}
