import { Injectable, NotFoundException, Param, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorsApp } from 'src/common/errors';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { UserGet } from 'src/interfaces/userGet';
import { Unit } from 'src/mongo/schemas/units.schema';
import { UnitsDto } from './units.dto';

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<Unit>) {}

  async findAll(@Req() req: RequestWithUser): Promise<Unit[]> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    return this.unitModel.find({ owner: typedUser._id });
  }

  async create(@Req() req: RequestWithUser, unitsDto: UnitsDto): Promise<Unit> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const newUnit = this.unitModel.create({ ...unitsDto, owner: typedUser });
    return newUnit;
  }

  async remove(
    @Param('unitId') unitId: Types.ObjectId,
    @Req() req: RequestWithUser,
  ): Promise<Unit> {
    const user = req.user;
    if (!user || typeof user !== 'object' || !('_id' in user)) {
      throw new Error(ErrorsApp.EMPTY_USER);
    }
    const typedUser = user as unknown as UserGet;

    const unitsList = await this.unitModel.find({
      owner: typedUser._id,
    });

    if (unitsList.length === 0) {
      throw new NotFoundException(ErrorsApp.NOT_PRICE);
    }
    const targetPrice = unitsList.some(
      ({ _id }) => _id.toString() === String(unitId),
    );
    if (!targetPrice) {
      throw new NotFoundException(ErrorsApp.NOT_PRICE);
    }

    return this.unitModel.findOneAndDelete({
      owner: typedUser._id,
      _id: unitId,
    });
  }
}
