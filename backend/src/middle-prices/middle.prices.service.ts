import { Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MiddlePrice } from 'src/mongo/schemas/middle-prices/middle.prices';
import { PricesDto } from 'src/prices/price.dto';
import { Helpers } from 'src/projects/positions/helpers';

@Injectable()
export class MiddlePricesService {
  constructor(
    @InjectModel(MiddlePrice.name) private middlePriceModel: Model<MiddlePrice>,
  ) {}

  async getAll() {
    return await this.middlePriceModel.find();
  }

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

  async updateMiddlePrice(dto: PricesDto) {
    const middlePrices = await this.middlePriceModel.find();
    if (middlePrices.length !== 0) {
      for (let i = 0; i < middlePrices.length; i++) {
        const prices = middlePrices[i].prices;
        for (let i = 0; i < prices.length; i++) {
          if (prices[i].id.toString() === dto.id.toString()) {
            prices[i].price = dto.price;
          }
        }
        await this.middlePriceModel.findByIdAndUpdate(
          middlePrices[i]._id,
          { $set: { prices } },
          { new: true },
        );
      }
    }

    const newMiddlePrices = await this.middlePriceModel.find();
    if (newMiddlePrices.length !== 0) {
      for (let i = 0; i < newMiddlePrices.length; i++) {
        const prices = newMiddlePrices[i].prices;
        if (prices.length !== 0) {
          await this.middlePriceModel.findByIdAndUpdate(
            newMiddlePrices[i]._id,
            { $set: { price: Helpers.middlePrice(prices) } },
            { new: true },
          );
        }
      }
    }
  }

  async removeMiddlePrice(@Param('priceId') priceId: Types.ObjectId) {
    const middlePrices = await this.middlePriceModel.find();
    if (middlePrices.length !== 0) {
      for (let i = 0; i < middlePrices.length; i++) {
        const prices = middlePrices[i].prices.filter(
          ({ id }) => id.toString() !== priceId.toString(),
        );
        await this.middlePriceModel.findByIdAndUpdate(
          middlePrices[i]._id,
          { $set: { prices } },
          { new: true },
        );
      }
    }

    const newMiddlePrices = await this.middlePriceModel.find();
    if (newMiddlePrices.length !== 0) {
      for (let i = 0; i < newMiddlePrices.length; i++) {
        const prices = newMiddlePrices[i].prices;
        if (prices.length === 0) {
          await this.middlePriceModel.findByIdAndUpdate(
            newMiddlePrices[i]._id,
            { $set: { price: 0 } },
            { new: true },
          );
        }
        if (prices.length !== 0) {
          await this.middlePriceModel.findByIdAndUpdate(
            newMiddlePrices[i]._id,
            { $set: { price: Helpers.middlePrice(prices) } },
            { new: true },
          );
        }
      }
    }
  }
}
