import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ip')
  getIp(@Req() request: Request): string {
    return request.ip || (request as any).connection?.remoteAddress || 'unknown';
  }
}
