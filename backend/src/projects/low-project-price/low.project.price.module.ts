import { Module } from '@nestjs/common';
import { LowProjectPriceService } from './low.project.price.service';
import { LowProjectPriceController } from './low.project.price.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/mongo/schemas/project/project.schema';
import { ProjectPricesService } from '../project-prices/project.prices.service';
import { PositionsService } from '../positions/positions.service';
import { SettingProjectService } from '../setting-project/setting.project.service';
import { EstimatesService } from '../estimates/estimates.service';
import { LowPositionService } from '../low-estimate/low-position/low.position.service';
import { User, UserSchema } from 'src/mongo/schemas/user/user.schema';
import { Price, PriceSchema } from 'src/mongo/schemas/price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
  ],
  controllers: [LowProjectPriceController],
  providers: [
    LowProjectPriceService,
    PositionsService,
    ProjectPricesService,
    LowPositionService,
    EstimatesService,
    SettingProjectService,
  ],
})
export class LowProjectPriceModule {}
