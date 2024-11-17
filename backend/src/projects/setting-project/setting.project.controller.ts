import {
  Body,
  Controller,
  NotFoundException,
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
import { DiscountDto } from './dto/discount.dto';
import { Helpers } from '../positions/helpers';
import { ErrorsApp } from 'src/common/errors';
import { ProjectOwnerGuard } from '../project/project.owner.guard';

@Controller('setting/project')
export class SettingProjectController {
  constructor(private readonly settingProjectService: SettingProjectService) {}
  @Patch('/add/:projectId')
  @UseGuards(ProjectOwnerGuard)
  async addAllowProject(
    @Body() allowDto: AddAllowDto,
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.addAllowProject(
      allowDto,
      objectId,
      req,
    );
  }

  @Patch('/update/:projectId')
  @UseGuards(ProjectOwnerGuard)
  async updateAllowProject(
    @Body() allowDto: AddAllowDto,
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.updateProjectAllow(
      allowDto,
      objectId,
      req,
    );
  }

  @Patch('/delete/:projectId')
  @UseGuards(ProjectOwnerGuard)
  async deleteAllowProject(
    @Body() allowDto: DeleteAllowDto,
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.deleteAllowProject(
      allowDto,
      objectId,
      req,
    );
  }
  @Post('/discount/:projectId')
  @UseGuards(ProjectOwnerGuard)
  async addDiscount(
    @Body() dto: DiscountDto,
    @Param('projectId') projectId: string,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.addDiscount(dto, objectId);
  }

  @Post('/lowEstimates/:projectId')
  @UseGuards(ProjectOwnerGuard)
  async addLowEstimates(
    @Body() dto: DiscountDto,
    @Param('projectId') projectId: string,
    @Req() req: RequestWithUser,
  ) {
    if (!Helpers.checkId(projectId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(projectId);
    return await this.settingProjectService.addLowEstimates(dto, objectId, req);
  }
}
