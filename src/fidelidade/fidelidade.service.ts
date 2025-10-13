import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fidelidade } from './fidelidade.entity';

@Injectable()
export class FidelidadeService {
  constructor(
    @InjectRepository(Fidelidade)
    private fidelidadeRepository: Repository<Fidelidade>,
  ) {}

  async criarFidelidade(data: Partial<Fidelidade>): Promise<Fidelidade> {
    const novaFidelidade = this.fidelidadeRepository.create(data);
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
    data: Partial<Fidelidade>,
  ): Promise<Fidelidade | null> {
    await this.fidelidadeRepository.update(id, data);
    return this.fidelidadeRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
  }

  async excluirFidelidade(id: number): Promise<void> {
    await this.fidelidadeRepository.delete(id);
  }
}
