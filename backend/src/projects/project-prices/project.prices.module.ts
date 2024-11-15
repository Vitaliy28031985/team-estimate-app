import { Module } from '@nestjs/common';
import { ProjectPricesService } from './project.prices.service';
import { ProjectPricesController } from './project.prices.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/mongo/schemas/project/project.schema';
import { PositionsService } from '../positions/positions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectPricesController],
  providers: [ProjectPricesService, PositionsService],
  exports: [ProjectPricesService],
})
export class ProjectPricesModule {}
