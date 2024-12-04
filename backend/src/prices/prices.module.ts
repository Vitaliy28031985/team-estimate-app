import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Price, PriceSchema } from 'src/mongo/schemas/price.schema';
import {
  MiddlePrice,
  MiddlePriceSchema,
} from 'src/mongo/schemas/middle-prices/middle.prices';
import { MiddlePricesService } from 'src/middle-prices/middle.prices.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
    MongooseModule.forFeature([
      { name: MiddlePrice.name, schema: MiddlePriceSchema },
    ]),
  ],
  controllers: [PricesController],
  providers: [PricesService, MiddlePricesService],
  // exports: [PricesService],
})
export class PricesModule {}
