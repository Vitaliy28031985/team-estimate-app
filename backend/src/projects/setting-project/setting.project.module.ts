import { Module } from '@nestjs/common';
import { SettingProjectService } from './setting.project.service';
import { SettingProjectController } from './setting.project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/mongo/schemas/project/project.schema';
import { User, UserSchema } from 'src/mongo/schemas/user/user.schema';
import { PositionsService } from '../positions/positions.service';
import { Price, PriceSchema } from 'src/mongo/schemas/price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
  ],
  controllers: [SettingProjectController],
  providers: [SettingProjectService, PositionsService],
  exports: [SettingProjectService],
})
export class SettingProjectModule {}
