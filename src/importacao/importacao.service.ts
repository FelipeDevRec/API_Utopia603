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

      stream.on('data', (data: Record<string, any>) => {
        console.log('Dados recebidos:', data);
        resultados.push(data);
      });
      stream.on('end', async () => {
        for (const item of resultados) {
          const chaves = Object.keys(item);
          const nome = item[chaves[0]]?.toString().trim(); // Nome
          const email = item[chaves[1]]?.toString().trim(); // Email
          const saldoPontos = item[chaves[2]]; // Saldo de pontos
          const pontosResgatados = item[chaves[3]]; // Pontos resgatados
          const ultimaAtividade = item[chaves[4]]; // Última atividade

          if (!nome || !email || nome === '' || email === '') {
            console.log('Pulando item com dados inválidos:', { nome, email });
            continue;
          }

          let usuario = await this.usuarioRepo.findOne({
            where: { email },
          });
          if (!usuario) {
            usuario = this.usuarioRepo.create({
              nome,
              email,
            });
            usuario = await this.usuarioRepo.save(usuario);
          }
          // Tratar data
          let dataUltimaAtividade: Date;
          if (ultimaAtividade && ultimaAtividade.trim() !== '') {
            const dataTemp = new Date(ultimaAtividade);
            dataUltimaAtividade = isNaN(dataTemp.getTime())
              ? new Date()
              : dataTemp;
          } else {
            dataUltimaAtividade = new Date();
          }

          const fidelidade = this.fidelidadeRepo.create({
            usuario,
            saldo_pontos: Number(saldoPontos || 0),
            pontos_resgatados: Number(pontosResgatados || 0),
            ultima_atividade: dataUltimaAtividade,
          });

          try {
            await this.fidelidadeRepo.save(fidelidade);
          } catch (error) {
            console.error('Erro ao salvar fidelidade:', error);
            console.error('Dados que causaram o erro:', {
              nome,
              email,
              saldoPontos,
              pontosResgatados,
              ultimaAtividade,
              dataUltimaAtividade,
            });
            throw error;
          }
        }
        resolve({ importados: resultados.length });
      });
      stream.on('error', (err: any) => reject(err));
    });
  }
}
