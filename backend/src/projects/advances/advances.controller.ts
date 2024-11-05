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
import { AdvancesService } from './advances.service';
import { ProjectGuard } from '../project/project.guard';
import { AdvanceDto } from './advance.dto';
import { Types } from 'mongoose';

@Controller('advances')
export class AdvancesController {
  constructor(private readonly advancesService: AdvancesService) {}

  @Post('/:projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async create(@Body() dto: AdvanceDto, @Param('projectId') projectId: string) {
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
    const objectId = new Types.ObjectId(projectId);
    return await this.advancesService.updateAdvance(dto, objectId, advancesId);
  }
  @Delete('/:projectId/:advancesId')
  @UseGuards(ProjectGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('advancesId') advancesId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    await this.advancesService.removeAdvance(objectId, advancesId);
  }
}
