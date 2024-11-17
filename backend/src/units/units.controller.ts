import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { RoleGuard } from 'src/guards/roleGuard';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { UnitsDto } from './units.dto';
import { Unit } from 'src/mongo/schemas/units.schema';
import { Types } from 'mongoose';
import { Helpers } from 'src/projects/positions/helpers';
import { ErrorsApp } from 'src/common/errors';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @UseGuards(RoleGuard)
  async getAll(@Req() req: RequestWithUser) {
    return this.unitsService.findAll(req);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(RoleGuard)
  async create(
    @Body() unitsDto: UnitsDto,
    @Req() req: RequestWithUser,
  ): Promise<Unit> {
    return this.unitsService.create(req, unitsDto);
  }
  @Delete(':unitId')
  async remove(@Param('unitId') priceId: string, @Req() req: RequestWithUser) {
    if (!Helpers.checkId(priceId)) {
      throw new NotFoundException(ErrorsApp.BED_ID);
    }
    const objectId = new Types.ObjectId(priceId);
    return this.unitsService.remove(objectId, req);
  }
}
