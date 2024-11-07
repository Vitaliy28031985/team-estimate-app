import {
  Body,
  Controller,
  Delete,
  Get,
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
import { PriceGuard } from './price.guard';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  @UseGuards(PriceGuard)
  async getAll(@Req() req: RequestWithUser) {
    return this.pricesService.findAll(req);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(PriceGuard)
  async create(
    @Body() priceDto: PricesDto,
    @Req() req: RequestWithUser,
  ): Promise<Price> {
    return this.pricesService.create(priceDto, req);
  }

  @Put(':priceId')
  @UsePipes(new ValidationPipe())
  @UseGuards(PriceGuard)
  async update(
    @Param('priceId') priceId: string,
    @Body() priceDto: PricesDto,
    @Req() req: RequestWithUser,
  ) {
    const objectId = new Types.ObjectId(priceId);
    return this.pricesService.update(objectId, priceDto, req);
  }

  @Delete(':priceId')
  async remove(@Param('priceId') priceId: string, @Req() req: RequestWithUser) {
    const objectId = new Types.ObjectId(priceId);
    return this.pricesService.remove(objectId, req);
  }
}
