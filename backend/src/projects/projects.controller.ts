import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './projects-dtos/create.project.dto';
import { Project } from 'src/mongo/schemas/project/project.schema';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { Types } from 'mongoose';

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
  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() projectDto: CreateProjectDto,
    @Req() req: RequestWithUser,
  ): Promise<Project> {
    return this.projectsService.create(projectDto, req);
  }

  @Put(':projectId')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('projectId') projectId: string,
    @Body() projectDto: CreateProjectDto,
    @Req() req: RequestWithUser,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return this.projectsService.update(objectId, projectDto, req);
  }

  @Delete(':projectId')
  async remove(
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return this.projectsService.remove(objectId, req);
  }
}
