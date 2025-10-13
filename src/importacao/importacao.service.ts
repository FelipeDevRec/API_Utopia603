/* eslint-disable */

import { Injectable } from '@nestjs/common';
import csvParser = require('csv-parser');
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Fidelidade } from '../fidelidade/fidelidade.entity';


@Injectable()
export class ImportacaoService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Fidelidade)
    private fidelidadeRepo: Repository<Fidelidade>,
  ) {}

  async importarCsv(file: any) {
    const resultados: Record<string, any>[] = [];
    return new Promise((resolve, reject) => {
      const stream = require('streamifier')
        .createReadStream(file.buffer)
        .pipe(csvParser());

      stream.on('data', (data: Record<string, any>) => resultados.push(data));
      stream.on('end', async () => {
        for (const item of resultados) {
          let usuario = await this.usuarioRepo.findOne({
            where: { email: item.email },
          });
          if (!usuario) {
            usuario = this.usuarioRepo.create({
              nome: item.nome,
              email: item.email,
            });
            usuario = await this.usuarioRepo.save(usuario);
          }
          const fidelidade = this.fidelidadeRepo.create({
            usuario,
            saldo_pontos: Number(item.saldo_pontos || 0),
            pontos_resgatados: Number(item.pontos_resgatados || 0),
            ultima_atividade: new Date(item.ultima_atividade),
          });
          await this.fidelidadeRepo.save(fidelidade);
        }
        resolve({ importados: resultados.length });
      });
      stream.on('error', (err: any) => reject(err));
    });
  }
}
