import {
  ConflictException,
  Injectable,
  NotFoundException,
  Param,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserGet } from 'src/interfaces/userGet';
import { Price } from 'src/mongo/schemas/price.schema';
import { PricesDto } from './price.dto';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { ErrorsApp } from 'src/common/errors';
import { MiddlePricesService } from 'src/middle-prices/middle.prices.service';

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Price.name) private priceModel: Model<Price>,
    private readonly middlePricesService: MiddlePricesService,
  ) {}

  async findAll(@Req() req: RequestWithUser): Promise<Price[]> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    return this.priceModel.find({ owner: typedUser._id });
  }

  async create(
    priceDto: PricesDto,
    @Req() req: RequestWithUser,
  ): Promise<Price> {
    const newPriceId = new Types.ObjectId();
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    if (typeof priceDto.price !== 'number') {
      throw new Error('price isn`t number');
    }

    const prices = await this.priceModel.find({ owner: typedUser._id });

    const isExistPrice = prices.some(
      ({ title }) =>
        title.toLocaleLowerCase() === priceDto.title.toLocaleLowerCase(),
    );

    if (isExistPrice) {
      throw new ConflictException(ErrorsApp.EXIST_PRICE(priceDto.title));
    }

    const newPrice = await this.priceModel.create({
      ...priceDto,
      id: newPriceId,
      owner: typedUser._id,
    });

    await this.middlePricesService.addMiddlePrice({
      ...priceDto,
      id: newPriceId,
      owner: typedUser._id,
    });
    return newPrice;
  }

  async update(
    @Param('priceId') priceId: Types.ObjectId,
    priceDto: PricesDto,
    @Req() req: RequestWithUser,
  ): Promise<Price> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const pricesList = await this.priceModel.find({
      owner: typedUser._id,
    });

    if (pricesList.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_PRICE);
    }
    const targetPrice = pricesList.filter(
      ({ id }) => id.toString() === String(priceId),
    );
    if (targetPrice.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_PRICE);
    }
    await this.middlePricesService.updateMiddlePrice({
      ...priceDto,
      id: priceId,
      owner: typedUser._id,
    });

    return await this.priceModel.findByIdAndUpdate(
      { owner: typedUser._id, _id: targetPrice[0]._id },
      priceDto,
      { new: true, fields: ['-createdAt', '-updatedAt'] },
    );
  }

  async remove(
    @Param('priceId') priceId: Types.ObjectId,
    @Req() req: RequestWithUser,
  ): Promise<Price> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const pricesList = await this.priceModel.find({
      owner: typedUser._id,
    });

    if (pricesList.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_PRICE);
    }
    const targetPrice = pricesList.filter(
      ({ id }) => id.toString() === priceId.toString(),
    );
    if (targetPrice.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_PRICE);
    }

    await this.middlePricesService.removeMiddlePrice(priceId);

    return this.priceModel.findOneAndDelete({
      owner: typedUser._id,
      _id: targetPrice[0]._id,
    });
  }
}
