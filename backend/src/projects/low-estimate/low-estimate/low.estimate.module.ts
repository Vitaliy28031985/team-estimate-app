import { Module } from '@nestjs/common';
import { LowEstimateService } from './low.estimate.service';
import { LowEstimateController } from './low.estimate.controller';
import { PositionsService } from 'src/projects/positions/positions.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/mongo/schemas/project/project.schema';
import { EstimatesService } from 'src/projects/estimates/estimates.service';
import { SettingProjectService } from 'src/projects/setting-project/setting.project.service';
import { User, UserSchema } from 'src/mongo/schemas/user/user.schema';
import { Price, PriceSchema } from 'src/mongo/schemas/price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
  ],
  controllers: [LowEstimateController],
  providers: [
    LowEstimateService,
    EstimatesService,
    PositionsService,
    SettingProjectService,
  ],
  exports: [LowEstimateService],
})
export class LowEstimateModule {}
