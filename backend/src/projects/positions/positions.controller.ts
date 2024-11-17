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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './position-dto/position.create.dto';
import { Types } from 'mongoose';
import { ErrorsApp } from 'src/common/errors';
import { Helpers } from './helpers';
import { ProjectLargeGuard } from '../project/project.large.guard';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post('/:projectId/:estimateId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLargeGuard)
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
    return await this.positionsService.createPosition(
      dto,
      objectProjectId,
      objectEstimatedId,
    );
  }

  @Patch(':projectId/:estimateId/:positionId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLargeGuard)
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
    await this.positionsService.updatePosition(
      dto,
      objectProjectId,
      objectEstimatedId,
      positionId,
    );
  }

  @Delete(':projectId/:estimateId/:positionId')
  @UseGuards(ProjectLargeGuard)
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
    return await this.positionsService.removePosition(
      objectProjectId,
      objectEstimatedId,
      positionId,
    );
  }
}
