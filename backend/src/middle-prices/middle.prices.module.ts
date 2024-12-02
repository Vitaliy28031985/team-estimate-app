import { Module } from '@nestjs/common';
import { MiddlePricesService } from './middle.prices.service';
import { MiddlePricesController } from './middle.prices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MiddlePrice,
  MiddlePriceSchema,
} from 'src/mongo/schemas/middle-prices/middle.prices';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MiddlePrice.name, schema: MiddlePriceSchema },
    ]),
  ],
  controllers: [MiddlePricesController],
  providers: [MiddlePricesService],
  exports: [MiddlePricesService],
})
export class MiddlePricesModule {}
