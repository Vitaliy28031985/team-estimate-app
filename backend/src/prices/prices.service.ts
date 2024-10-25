import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Price } from 'src/mongo/schemas/price.schema';

@Injectable()
export class PricesService {
  constructor(@InjectModel(Price.name) private priceModel: Model<Price>) {}
}
