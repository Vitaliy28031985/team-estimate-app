import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MiddlePrice } from 'src/mongo/schemas/middle-prices/middle.prices';
import { PricesDto } from 'src/prices/price.dto';
import { Helpers } from 'src/projects/positions/helpers';

@Injectable()
export class MiddlePricesService {
  constructor(
    @InjectModel(MiddlePrice.name) private middlePriceModel: Model<MiddlePrice>,
  ) {}

  async addMiddlePrice(dto: PricesDto) {
    const middlePrices = await this.middlePriceModel.find({
      title: dto.title,
    });

    if (middlePrices.length === 0) {
      await this.middlePriceModel.create({
        title: dto.title,
        price: dto.price,
        prices: [{ id: dto.id, price: dto.price, owner: dto.owner }],
      });
    }
    if (middlePrices.length !== 0) {
      await this.middlePriceModel.findByIdAndUpdate(
        middlePrices[0]._id,
        {
          $push: {
            prices: { id: dto.id, price: dto.price, owner: dto.owner },
          },
        },
        { new: true },
      );
      const newMiddlePrices = await this.middlePriceModel.find({
        title: dto.title,
      });

      await this.middlePriceModel.findByIdAndUpdate(
        newMiddlePrices[0]._id,
        { $set: { price: Helpers.middlePrice(newMiddlePrices[0].prices) } },
        { new: true },
      );
    }
  }
}
