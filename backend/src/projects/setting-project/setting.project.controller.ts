import { Body, Controller, Param, Patch, Req } from '@nestjs/common';
import { SettingProjectService } from './setting.project.service';
import { AddAllowDto } from './dto/add.allow.dto';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { Types } from 'mongoose';
import { DeleteAllowDto } from './dto/delete.dto';

@Controller('setting/project')
export class SettingProjectController {
  constructor(private readonly settingProjectService: SettingProjectService) {}
  @Patch('/add/:projectId')
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
}
