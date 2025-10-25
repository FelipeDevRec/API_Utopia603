/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async criarUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    const novoUsuario = this.usuarioRepository.create(usuario);

    // Hash da senha se foi fornecida
    if (usuario.senha) {
      novoUsuario.senha = await bcrypt.hash(usuario.senha, 10);
    }

    return this.usuarioRepository.save(novoUsuario);
  }

  async listarUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async editarUsuario(id: string, usuario: Partial<Usuario>): Promise<Usuario | null> {
    // Hash da senha se foi fornecida e não é já um hash
    if (usuario.senha && !usuario.senha.startsWith('$2b$')) {
      usuario.senha = await bcrypt.hash(usuario.senha, 10);
    }

    await this.usuarioRepository.update(id, usuario);
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async excluirUsuario(id: string): Promise<void> {
    await this.usuarioRepository.delete(id);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { email } });
  }
}
