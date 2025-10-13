import { Module } from '@nestjs/common';
import { ImportacaoService } from './importacao.service';
import { ImportacaoController } from './importacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Fidelidade } from '../fidelidade/fidelidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Fidelidade])],
  providers: [ImportacaoService],
  controllers: [ImportacaoController],
})
export class ImportacaoModule {}
