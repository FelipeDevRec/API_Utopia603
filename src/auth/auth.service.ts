/* eslint-disable */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Usuario> {
    const user = await this.usuarioService.findByEmail(email);
    if (user && user.senha && (await bcrypt.compare(password, user.senha))) {
      return user;
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async login(user: Usuario) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
