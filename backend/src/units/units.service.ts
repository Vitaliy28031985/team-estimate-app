import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Unit } from 'src/database/models/units.schema';

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<Unit>) {}
}
