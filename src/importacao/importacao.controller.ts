import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportacaoService } from './importacao.service';

@Controller('importacao')
export class ImportacaoController {
  constructor(private readonly importacaoService: ImportacaoService) {}

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async importarCsv(@UploadedFile() file: Express.Multer.File) {
    return this.importacaoService.importarCsv(file);
  }
}
