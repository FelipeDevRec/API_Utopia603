import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async criarUsuario(usuario: Partial<Usuario>): Promise<Usuario> {
    const novoUsuario = this.usuarioRepository.create(usuario);
    return this.usuarioRepository.save(novoUsuario);
  }

  async listarUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async editarUsuario(
    id: string,
    usuario: Partial<Usuario>,
  ): Promise<Usuario | null> {
    await this.usuarioRepository.update(id, usuario);
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async excluirUsuario(id: string): Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}
