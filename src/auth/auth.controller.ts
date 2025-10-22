/* eslint-disable */

import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
) {}

@Post('login')
async login(@Body() body: { email: string, senha: string }) {
  const user = await this.usuarioService.findByEmail(body.email);
  if (!user) throw new UnauthorizedException('Credenciais inválidas');
  if (!user.senha) {
    // Senha não definida ainda!
    return { error: 'senha_nao_definida', message: 'Defina sua senha primeiro.' };
  }
  return this.authService.login(await this.authService.validateUser(body.email, body.senha));
}
@Post('definir-senha')
async definirSenha(@Body() body: { email: string, senha: string }) {
  const user = await this.usuarioService.findByEmail(body.email);
  if (!user) throw new UnauthorizedException('Usuário não encontrado');
  if (user.senha) throw new UnauthorizedException('Usuário já possui senha');
  // Gerar hash e salvar
  const hash = await bcrypt.hash(body.senha, 10);
  await this.usuarioService.editarUsuario(user.id, { senha: hash });
  return { message: 'Senha definida com sucesso! Agora você pode logar.' };
}
}
