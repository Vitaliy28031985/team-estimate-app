import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { PricesDto } from './price.dto';
import { Price } from 'src/mongo/schemas/price.schema';
import { Types } from 'mongoose';
import { RoleGuard } from 'src/guards/roleGuard';
import { Helpers } from 'src/projects/positions/helpers';
import { ErrorsApp } from 'src/common/errors';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  @UseGuards(RoleGuard)
  async getAll(@Req() req: RequestWithUser) {
    return this.pricesService.findAll(req);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(RoleGuard)
  async create(
    @Body() priceDto: PricesDto,
    @Req() req: RequestWithUser,
  ): Promise<Price> {
    return this.pricesService.create(priceDto, req);
  }

  @Put(':priceId')
  @UsePipes(new ValidationPipe())
  @UseGuards(RoleGuard)
  async update(
    @Param('priceId') priceId: string,
    @Body() priceDto: PricesDto,
    @Req() req: RequestWithUser,
  ) {
    if (!Helpers.checkId(priceId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(priceId);
    return this.pricesService.update(objectId, priceDto, req);
  }

  @Delete(':priceId')
  async remove(@Param('priceId') priceId: string, @Req() req: RequestWithUser) {
    if (!Helpers.checkId(priceId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(priceId);
    return this.pricesService.remove(objectId, req);
  }
}
