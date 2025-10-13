import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fidelidade } from './fidelidade.entity';
import { FidelidadeService } from './fidelidade.service';
import { FidelidadeController } from './fidelidade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Fidelidade])],
  providers: [FidelidadeService],
  controllers: [FidelidadeController],
})
export class FidelidadeModule {}
