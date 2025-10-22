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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

// DTOs

export class UsuarioCreateDto {
  @ApiProperty({ example: 'Felipe Alves', description: 'Nome do usuário' })
  nome: string;

  @ApiProperty({ example: 'felipe@email.com', description: 'Email do usuário' })
  email: string;
}

export class UsuarioEditDto {
  @ApiProperty({ example: 'Novo Nome', required: false })
  nome?: string;

  @ApiProperty({ example: 'novo@email.com', required: false })
  email?: string;

  @ApiProperty({ example: 'novaSenha123', required: false })
  senha?: string;
}

// Decorators Swagger

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({ type: UsuarioCreateDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: Usuario,
  })
  async criar(@Body() usuario: UsuarioCreateDto): Promise<Usuario> {
    return this.usuarioService.criarUsuario(usuario);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
    type: [Usuario],
  })
  async listar(): Promise<Usuario[]> {
    return this.usuarioService.listarUsuarios();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: Usuario,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async buscarPorId(@Param('id') id: string): Promise<Usuario | null> {
    return this.usuarioService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edita um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário (UUID)' })
  @ApiBody({ type: UsuarioEditDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário editado com sucesso',
    type: Usuario,
  })
  async editar(
    @Param('id') id: string,
    @Body() usuario: UsuarioEditDto,
  ): Promise<Usuario | null> {
    return this.usuarioService.editarUsuario(id, usuario);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário (UUID)' })
  @ApiResponse({ status: 200, description: 'Usuário excluído com sucesso' })
  async excluir(@Param('id') id: string): Promise<void> {
    return this.usuarioService.excluirUsuario(id);
  }
}
