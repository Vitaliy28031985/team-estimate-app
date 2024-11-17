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
import { LowPositionService } from './low.position.service';
import { CreatePositionDto } from 'src/projects/positions/position-dto/position.create.dto';
import { Types } from 'mongoose';
import { Helpers } from 'src/projects/positions/helpers';
import { ErrorsApp } from 'src/common/errors';
import { ProjectLowGuard } from 'src/projects/project/project.low.guard';

@Controller('low/position')
export class LowPositionController {
  constructor(private readonly lowPositionService: LowPositionService) {}

  @Post('/:projectId/:estimateId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLowGuard)
  async create(
    @Body() dto: CreatePositionDto,
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
  ) {
    if (!Helpers.checkId(projectId) || !Helpers.checkId(estimateId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectProjectId = new Types.ObjectId(projectId);
    const objectEstimatedId = new Types.ObjectId(estimateId);
    return await this.lowPositionService.createPosition(
      dto,
      objectProjectId,
      objectEstimatedId,
    );
  }

  @Patch(':projectId/:estimateId/:positionId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLowGuard)
  async update(
    @Body() dto: CreatePositionDto,
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
    @Param('positionId') positionId: string,
  ) {
    if (!Helpers.checkId(projectId) || !Helpers.checkId(estimateId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectProjectId = new Types.ObjectId(projectId);
    const objectEstimatedId = new Types.ObjectId(estimateId);
    await this.lowPositionService.updatePosition(
      dto,
      objectProjectId,
      objectEstimatedId,
      positionId,
    );
  }

  @Delete(':projectId/:estimateId/:positionId')
  @UseGuards(ProjectLowGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
    @Param('positionId') positionId: string,
  ) {
    if (!Helpers.checkId(projectId) || !Helpers.checkId(estimateId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectProjectId = new Types.ObjectId(projectId);
    const objectEstimatedId = new Types.ObjectId(estimateId);
    return await this.lowPositionService.removePosition(
      objectProjectId,
      objectEstimatedId,
      positionId,
    );
  }
}
