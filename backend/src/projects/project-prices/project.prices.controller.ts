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
import { ProjectPricesService } from './project.prices.service';
import { CreateProjectGuard } from '../project/create.project.guard.guard';
import { PricesDto } from 'src/prices/price.dto';
import { Types } from 'mongoose';

@Controller('project/prices')
export class ProjectPricesController {
  constructor(private readonly projectPricesService: ProjectPricesService) {}

  @Post('/:projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(CreateProjectGuard)
  async create(@Body() dto: PricesDto, @Param('projectId') projectId: string) {
    const objectId = new Types.ObjectId(projectId);
    return await this.projectPricesService.createPrice(dto, objectId);
  }

  @Patch('/:projectId/:priceId')
  @UsePipes(new ValidationPipe())
  @UseGuards(CreateProjectGuard)
  async update(
    @Body() dto: PricesDto,
    @Param('projectId') projectId: string,
    @Param('priceId') priceId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.projectPricesService.updatePrice(dto, objectId, priceId);
  }

  @Delete('/:projectId/:priceId')
  @UseGuards(CreateProjectGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('priceId') priceId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.projectPricesService.removePrice(objectId, priceId);
  }
}
