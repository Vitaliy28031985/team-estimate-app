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
import { ProjectPricesService } from './project.prices.service';
import { PricesDto } from 'src/prices/price.dto';
import { Types } from 'mongoose';
import { Helpers } from '../positions/helpers';
import { ErrorsApp } from 'src/common/errors';
import { ProjectLargeGuard } from '../project/project.large.guard';

@Controller('project/prices')
export class ProjectPricesController {
  constructor(private readonly projectPricesService: ProjectPricesService) {}

  @Post('/:projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLargeGuard)
  async create(@Body() dto: PricesDto, @Param('projectId') projectId: string) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.projectPricesService.createPrice(dto, objectId);
  }

  @Patch('/:projectId/:priceId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLargeGuard)
  async update(
    @Body() dto: PricesDto,
    @Param('projectId') projectId: string,
    @Param('priceId') priceId: string,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.projectPricesService.updatePrice(dto, objectId, priceId);
  }

  @Delete('/:projectId/:priceId')
  @UseGuards(ProjectLargeGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('priceId') priceId: string,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.projectPricesService.removePrice(objectId, priceId);
  }
}
