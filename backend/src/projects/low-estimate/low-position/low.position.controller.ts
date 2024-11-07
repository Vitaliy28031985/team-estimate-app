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
import { LowPositionService } from './low.position.service';
import { ProjectGuard } from 'src/projects/project/project.guard';
import { CreatePositionDto } from 'src/projects/positions/position-dto/position.create.dto';
import { Types } from 'mongoose';

@Controller('low/position')
export class LowPositionController {
  constructor(private readonly lowPositionService: LowPositionService) {}

  @Post('/:projectId/:estimateId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async create(
    @Body() dto: CreatePositionDto,
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
  ) {
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
  @UseGuards(ProjectGuard)
  async update(
    @Body() dto: CreatePositionDto,
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
    @Param('positionId') positionId: string,
  ) {
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
  @UseGuards(ProjectGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
    @Param('positionId') positionId: string,
  ) {
    const objectProjectId = new Types.ObjectId(projectId);
    const objectEstimatedId = new Types.ObjectId(estimateId);
    return await this.lowPositionService.removePosition(
      objectProjectId,
      objectEstimatedId,
      positionId,
    );
  }
}
