import { Module } from '@nestjs/common';
import { EstimatesService } from './estimates.service';
import { EstimatesController } from './estimates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/mongo/schemas/project/project.schema';
import { PositionsService } from '../positions/positions.service';
import { LowEstimateService } from '../low-estimate/low-estimate/low.estimate.service';
import { User, UserSchema } from 'src/mongo/schemas/user/user.schema';
import { SettingProjectService } from '../setting-project/setting.project.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [EstimatesController],
  providers: [
    EstimatesService,
    PositionsService,
    LowEstimateService,
    SettingProjectService,
  ],
  exports: [EstimatesService],
})
export class EstimatesModule {}
