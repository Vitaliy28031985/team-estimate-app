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
import { LowProjectPriceService } from './low.project.price.service';
import { ProjectGuard } from '../project/project.guard';
import { PricesDto } from 'src/prices/price.dto';
import { Types } from 'mongoose';

@Controller('low/project/price')
export class LowProjectPriceController {
  constructor(
    private readonly lowProjectPriceService: LowProjectPriceService,
  ) {}

  @Post('/:projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async create(@Body() dto: PricesDto, @Param('projectId') projectId: string) {
    const objectId = new Types.ObjectId(projectId);
    return await this.lowProjectPriceService.createPrice(dto, objectId);
  }

  @Patch('/:projectId/:priceId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async update(
    @Body() dto: PricesDto,
    @Param('projectId') projectId: string,
    @Param('priceId') priceId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.lowProjectPriceService.updatePrice(
      dto,
      objectId,
      priceId,
    );
  }

  @Delete('/:projectId/:priceId')
  @UseGuards(ProjectGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('priceId') priceId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.lowProjectPriceService.removePrice(objectId, priceId);
  }
}
