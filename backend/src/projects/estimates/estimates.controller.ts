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
import { EstimatesService } from './estimates.service';
import { Types } from 'mongoose';
import { ProjectGuard } from '../project/project.guard';
import { EstimateDto } from './estimate.dto';

@Controller('estimates')
export class EstimatesController {
  constructor(private readonly estimatesService: EstimatesService) {}
  @Post(':projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async create(
    @Body() dto: EstimateDto,
    @Param('projectId') projectId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.estimatesService.createEstimate(dto, objectId);
  }

  @Patch('/:projectId/:estimateId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async update(
    @Body() dto: EstimateDto,
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
  @Delete('/:projectId/:estimateId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
  ) {
    const objectProjectId = new Types.ObjectId(projectId);
    const objectEstimatedId = new Types.ObjectId(estimateId);
    return await this.estimatesService.removeEstimate(
      objectProjectId,
      objectEstimatedId,
    );
  }
}
