import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './projects-dtos/create.project.dto';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { Types } from 'mongoose';
import { CreateProjectGuard } from './project/create.project.guard.guard';
import { ProjectGuard } from './project/project.guard';
import { ProjectDeleteGuard } from './project/project.delete.guard';
import { Helpers } from './positions/helpers';
import { ErrorsApp } from 'src/common/errors';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  async getAll(
    @Req() req: RequestWithUser,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;
    return this.projectsService.getAll(req, pageNum, limitNum);
  }
  @Get(':projectId')
  async getById(
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.projectsService.getById(objectId, req);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(CreateProjectGuard)
  async create(
    @Body() projectDto: CreateProjectDto,
    @Req() req: RequestWithUser,
  ): Promise<Project> {
    return this.projectsService.create(projectDto, req);
  }

  @Put(':projectId')
  @UsePipes(new ValidationPipe())
  @UseGuards(ProjectGuard)
  async update(
    @Param('projectId') projectId: string,
    @Body() projectDto: CreateProjectDto,
    @Req() req: RequestWithUser,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return this.projectsService.update(objectId, projectDto, req);
  }

  @Delete(':projectId')
  @UseGuards(ProjectDeleteGuard)
  async remove(
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return this.projectsService.remove(objectId, req);
  }
}
