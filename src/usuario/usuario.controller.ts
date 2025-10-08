import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async criar(@Body() usuario: Partial<Usuario>): Promise<Usuario> {
    return this.usuarioService.criarUsuario(usuario);
  }

  @Get()
  async listar(): Promise<Usuario[]> {
    return this.usuarioService.listarUsuarios();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string): Promise<Usuario | null> {
    return this.usuarioService.buscarPorId(id);
  }

  @Put(':id')
  async editar(
    @Param('id') id: string,
    @Body() usuario: Partial<Usuario>,
  ): Promise<Usuario | null> {
    return this.usuarioService.editarUsuario(id, usuario);
  }

  @Delete(':id')
  async excluir(@Param('id') id: string): Promise<void> {
    return this.usuarioService.excluirUsuario(id);
  }
}
