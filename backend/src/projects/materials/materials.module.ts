import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/mongo/schemas/project/project.schema';
import { PositionsService } from '../positions/positions.service';
import { User, UserSchema } from 'src/mongo/schemas/user/user.schema';
import { Price, PriceSchema } from 'src/mongo/schemas/price.schema';
import { SettingProjectService } from '../setting-project/setting.project.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
  ],
  controllers: [MaterialsController],
  providers: [MaterialsService, PositionsService, SettingProjectService],
})
export class MaterialsModule {}
