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
import { EstimatesService } from './estimates.service';
import { Types } from 'mongoose';
import { EstimateDto } from './estimate.dto';
import { Helpers } from '../positions/helpers';
import { ErrorsApp } from 'src/common/errors';
import { ProjectLargeGuard } from '../project/project.large.guard';

@Controller('estimates')
export class EstimatesController {
  constructor(private readonly estimatesService: EstimatesService) {}
  @Post(':projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLargeGuard)
  async create(
    @Body() dto: EstimateDto,
    @Param('projectId') projectId: string,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.estimatesService.createEstimate(dto, objectId);
  }

  @Patch('/:projectId/:estimateId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLargeGuard)
  async update(
    @Body() dto: EstimateDto,
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
  ) {
    if (!Helpers.checkId(projectId) || !Helpers.checkId(estimateId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
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
  @UseGuards(ProjectLargeGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('estimateId') estimateId: string,
  ) {
    if (!Helpers.checkId(projectId) || !Helpers.checkId(estimateId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectProjectId = new Types.ObjectId(projectId);
    const objectEstimatedId = new Types.ObjectId(estimateId);
    return await this.estimatesService.removeEstimate(
      objectProjectId,
      objectEstimatedId,
    );
  }
}
