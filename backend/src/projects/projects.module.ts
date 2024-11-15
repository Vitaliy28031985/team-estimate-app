import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/mongo/schemas/project/project.schema';
import { ProjectGuard } from './project/project.guard';
import { ProjectDeleteGuard } from './project/project.delete.guard';
import { Price, PriceSchema } from 'src/mongo/schemas/price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectGuard, ProjectDeleteGuard],
})
export class ProjectsModule {}
