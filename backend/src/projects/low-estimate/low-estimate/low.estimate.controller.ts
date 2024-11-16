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
import { LowEstimateService } from './low.estimate.service';
import { ProjectGuard } from 'src/projects/project/project.guard';
import { Types } from 'mongoose';
import { EstimateDto } from 'src/projects/estimates/estimate.dto';

@Controller('low/estimate')
export class LowEstimateController {
  constructor(private readonly lowEstimateService: LowEstimateService) {}

  @Post(':projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async create(
    @Body() dto: EstimateDto,
    @Param('projectId') projectId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.lowEstimateService.createLowEstimate(dto, objectId);
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
    return await this.lowEstimateService.updateEstimated(
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
    return await this.lowEstimateService.removeEstimateLow(
      objectProjectId,
      objectEstimatedId,
    );
  }
}
