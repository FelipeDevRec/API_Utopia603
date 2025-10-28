import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fidelidade } from './fidelidade.entity';
import { FidelidadeService } from './fidelidade.service';
import { FidelidadeController } from './fidelidade.controller';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fidelidade]), UsuarioModule],
  providers: [FidelidadeService],
  controllers: [FidelidadeController],
})
export class FidelidadeModule {}
