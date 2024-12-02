import { Controller, Get } from '@nestjs/common';
import { MiddlePricesService } from './middle.prices.service';

@Controller('middle/prices')
export class MiddlePricesController {
  constructor(private readonly middlePricesService: MiddlePricesService) {}
  @Get()
  async getAll() {
    return await this.middlePricesService.getAll();
  }
}
