/* eslint-disable */

import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ example: 'usuario@email.com' })
  email: string;

  @ApiProperty({ example: 'minhaSenha123' })
  senha: string;
}

export class DefinirSenhaDto {
  @ApiProperty({ example: 'usuario@email.com' })
  email: string;

  @ApiProperty({ example: 'senhaNova123' })
  senha: string;
}

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário, retorna o access_token JWT.' })
  @ApiResponse({ status: 201, description: 'Login realizado com sucesso.' })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas ou senha não definida.',
  })
  async login(@Body() body: AuthLoginDto) {
    const user = await this.usuarioService.findByEmail(body.email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    if (!user.senha) {
      // Senha não definida ainda!
      return {
        error: 'senha_nao_definida',
        message: 'Defina sua senha primeiro.',
      };
    }
    return this.authService.login(
      await this.authService.validateUser(body.email, body.senha),
    );
  }
  @Post('definir-senha')
  @ApiOperation({ summary: 'Definir a senha para o primeiro acesso.' })
  @ApiResponse({ status: 201, description: 'Senha definida com sucesso.' })
  @ApiResponse({
    status: 401,
    description: 'Usuário não encontrado ou já possui senha.',
  })
  async definirSenha(@Body() body: DefinirSenhaDto) {
    const user = await this.usuarioService.findByEmail(body.email);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    if (user.senha) throw new UnauthorizedException('Usuário já possui senha');
    await this.usuarioService.editarUsuario(user.id, { senha: body.senha });
    return { message: 'Senha definida com sucesso! Agora você pode logar.' };
  }
}
