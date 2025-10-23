/* eslint-disable */

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportacaoService } from './importacao.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';


@UseGuards(JwtAuthGuard)
@Controller('importacao')
export class ImportacaoController {
  constructor(private readonly importacaoService: ImportacaoService) {}

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async importarCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'Arquivo não enviado ou campo "file" ausente',
      );
    }
    return this.importacaoService.importarCsv(file);
  }
}
