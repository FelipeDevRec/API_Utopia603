import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fidelidade } from './fidelidade.entity';
import { Usuario } from '../usuario/usuario.entity';

interface CreateFidelidadeDto {
  usuario: Usuario;
  saldo_pontos: number;
  pontos_resgatados: number;
  ultima_atividade: Date;
}

interface UpdateFidelidadeDto {
  saldo_pontos?: number;
  pontos_resgatados?: number;
  ultima_atividade?: Date;
}

@Injectable()
export class FidelidadeService {
  constructor(
    @InjectRepository(Fidelidade)
    private fidelidadeRepository: Repository<Fidelidade>,
  ) {}

  async criarFidelidade(data: CreateFidelidadeDto): Promise<Fidelidade> {
    const novaFidelidade = this.fidelidadeRepository.create({
      usuario: data.usuario,
      saldo_pontos: data.saldo_pontos,
      pontos_resgatados: data.pontos_resgatados,
      ultima_atividade: data.ultima_atividade,
    });
    return this.fidelidadeRepository.save(novaFidelidade);
  }

  async listarFidelidades(): Promise<Fidelidade[]> {
    return this.fidelidadeRepository.find({ relations: ['usuario'] });
  }

  async buscarPorId(id: number): Promise<Fidelidade | null> {
    return this.fidelidadeRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
  }

  async editarFidelidade(
    id: number,
    data: UpdateFidelidadeDto,
  ): Promise<Fidelidade | null> {
    try {
      const updateData: Partial<Fidelidade> = {};
      if (data.saldo_pontos !== undefined) updateData.saldo_pontos = data.saldo_pontos;
      if (data.pontos_resgatados !== undefined) updateData.pontos_resgatados = data.pontos_resgatados;
      if (data.ultima_atividade !== undefined) updateData.ultima_atividade = data.ultima_atividade;
      
      await this.fidelidadeRepository.update(id, updateData);
      return this.fidelidadeRepository.findOne({
        where: { id },
        relations: ['usuario'],
      });
    } catch (error) {
      throw new Error('Erro ao editar fidelidade');
    }
  }

  async excluirFidelidade(id: number): Promise<void> {
    await this.fidelidadeRepository.delete(id);
  }
}
