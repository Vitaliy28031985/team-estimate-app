import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EstimatesService } from './estimates.service';
import { Types } from 'mongoose';
import { ProjectGuard } from '../project/project.guard';

@Controller('estimates')
export class EstimatesController {
  constructor(private readonly estimatesService: EstimatesService) {}
  @Post(':projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async create(
    @Body() dto: { title: string },
    @Param('projectId') projectId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.estimatesService.createEstimate(dto, objectId);
  }

  @Patch('/:projectId/:estimateId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async update(
    @Body() dto: { title: string },
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
  ) {
    const objectProjectId = new Types.ObjectId(projectId);
    const objectEstimatedId = new Types.ObjectId(estimateId);
    return await this.estimatesService.updateEstimated(
      dto,
      objectProjectId,
      objectEstimatedId,
    );
  }
}
