import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FidelidadeService } from './fidelidade.service';
import { Fidelidade } from './fidelidade.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('fidelidades')
export class FidelidadeController {
  constructor(private readonly fidelidadeService: FidelidadeService) {}

  @Post()
  async criar(@Body() data: Partial<Fidelidade>): Promise<Fidelidade> {
    return this.fidelidadeService.criarFidelidade(data);
  }

  @Get()
  async listar(): Promise<Fidelidade[]> {
    return this.fidelidadeService.listarFidelidades();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: number): Promise<Fidelidade | null> {
    return this.fidelidadeService.buscarPorId(id);
  }

  @Put(':id')
  async editar(
    @Param('id') id: number,
    @Body() data: Partial<Fidelidade>,
  ): Promise<Fidelidade | null> {
    return this.fidelidadeService.editarFidelidade(id, data);
  }

  @Delete(':id')
  async excluir(@Param('id') id: number): Promise<void> {
    return this.fidelidadeService.excluirFidelidade(id);
  }
}
