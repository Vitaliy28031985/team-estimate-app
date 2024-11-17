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
import { LowProjectPriceService } from './low.project.price.service';
import { PricesDto } from 'src/prices/price.dto';
import { Types } from 'mongoose';
import { Helpers } from '../positions/helpers';
import { ErrorsApp } from 'src/common/errors';
import { ProjectLowGuard } from '../project/project.low.guard';

@Controller('low/project/price')
export class LowProjectPriceController {
  constructor(
    private readonly lowProjectPriceService: LowProjectPriceService,
  ) {}

  @Post('/:projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLowGuard)
  async create(@Body() dto: PricesDto, @Param('projectId') projectId: string) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.lowProjectPriceService.createPrice(dto, objectId);
  }

  @Patch('/:projectId/:priceId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectLowGuard)
  async update(
    @Body() dto: PricesDto,
    @Param('projectId') projectId: string,
    @Param('priceId') priceId: string,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.lowProjectPriceService.updatePrice(
      dto,
      objectId,
      priceId,
    );
  }

  @Delete('/:projectId/:priceId')
  @UseGuards(ProjectLowGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Param('priceId') priceId: string,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.lowProjectPriceService.removePrice(objectId, priceId);
  }
}
