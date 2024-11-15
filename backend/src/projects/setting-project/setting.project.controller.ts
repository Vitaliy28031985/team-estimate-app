import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SettingProjectService } from './setting.project.service';
import { AddAllowDto } from './dto/add.allow.dto';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { Types } from 'mongoose';
import { DeleteAllowDto } from './dto/delete.dto';
import { ProjectGuard } from '../project/project.guard';

@Controller('setting/project')
export class SettingProjectController {
  constructor(private readonly settingProjectService: SettingProjectService) {}
  @Patch('/add/:projectId')
  @UseGuards(ProjectGuard)
  async addAllowProject(
    @Body() allowDto: AddAllowDto,
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.addAllowProject(
      allowDto,
      objectId,
      req,
    );
  }

  @Patch('/update/:projectId')
  @UseGuards(ProjectGuard)
  async updateAllowProject(
    @Body() allowDto: AddAllowDto,
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.updateProjectAllow(
      allowDto,
      objectId,
      req,
    );
  }

  @Patch('/delete/:projectId')
  @UseGuards(ProjectGuard)
  async deleteAllowProject(
    @Body() allowDto: DeleteAllowDto,
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.deleteAllowProject(
      allowDto,
      objectId,
      req,
    );
  }
  @Post('/discount/:projectId')
  @UseGuards(ProjectGuard)
  async addDiscount(
    @Body() dto: { discount: number },
    @Param('projectId') projectId: string,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.addDiscount(dto, objectId);
  }

  @Post('/lowEstimates/:projectId')
  @UseGuards(ProjectGuard)
  async addLowEstimates(
    @Body() dto: { discount: number },
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.addLowEstimates(dto, objectId, req);
  }
}
