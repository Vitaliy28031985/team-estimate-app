import { Module } from '@nestjs/common';
import { LowPositionService } from './low.position.service';
import { LowPositionController } from './low.position.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/mongo/schemas/project/project.schema';
import { EstimatesService } from 'src/projects/estimates/estimates.service';
import { PositionsService } from 'src/projects/positions/positions.service';
import { SettingProjectService } from 'src/projects/setting-project/setting.project.service';
import { User, UserSchema } from 'src/mongo/schemas/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [LowPositionController],
  providers: [
    LowPositionService,
    EstimatesService,
    PositionsService,
    SettingProjectService,
  ],
})
export class LowPositionModule {}
