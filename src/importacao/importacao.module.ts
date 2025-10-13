import { Module } from '@nestjs/common';
import { ImportacaoService } from './importacao.service';
import { ImportacaoController } from './importacao.controller';

@Module({
  providers: [ImportacaoService],
  controllers: [ImportacaoController]
})
export class ImportacaoModule {}
