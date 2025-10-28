import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { FidelidadeService } from './fidelidade.service';
import { Fidelidade } from './fidelidade.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsuarioService } from '../usuario/usuario.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

// --- DTOs ---

export class CreateFidelidadeDto {
  @ApiProperty({ example: 'uuid-do-usuario', description: 'ID do usuário' })
  id_usuario: string;

  @ApiProperty({ example: 1200, description: 'Saldo de pontos acumulados' })
  saldo_pontos: number;

  @ApiProperty({ example: 300, description: 'Pontos já resgatados' })
  pontos_resgatados: number;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Última atividade',
  })
  ultima_atividade: Date;
}

export class EditFidelidadeDto {
  @ApiProperty({ example: 900, required: false })
  saldo_pontos?: number;

  @ApiProperty({ example: 400, required: false })
  pontos_resgatados?: number;

  @ApiProperty({ example: new Date().toISOString(), required: false })
  ultima_atividade?: Date;
}

// --- Controller ---

@ApiBearerAuth()
@ApiTags('fidelidade')
@UseGuards(JwtAuthGuard)
@Controller('fidelidades')
export class FidelidadeController {
  constructor(
    private readonly fidelidadeService: FidelidadeService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo registro de fidelidade' })
  @ApiBody({ type: CreateFidelidadeDto })
  @ApiResponse({
    status: 201,
    description: 'Registro criado com sucesso',
    type: Fidelidade,
  })
  async criar(@Body() data: CreateFidelidadeDto): Promise<Fidelidade> {
    const usuario = await this.usuarioService.buscarPorId(data.id_usuario);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.fidelidadeService.criarFidelidade({
      usuario,
      saldo_pontos: data.saldo_pontos,
      pontos_resgatados: data.pontos_resgatados,
      ultima_atividade: data.ultima_atividade,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os registros de fidelidade' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fidelidades',
    type: [Fidelidade],
  })
  async listar(): Promise<Fidelidade[]> {
    return this.fidelidadeService.listarFidelidades();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um registro de fidelidade pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da fidelidade' })
  @ApiResponse({
    status: 200,
    description: 'Registro encontrado',
    type: Fidelidade,
  })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async buscarPorId(@Param('id') id: number): Promise<Fidelidade | null> {
    return this.fidelidadeService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edita um registro de fidelidade pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da fidelidade' })
  @ApiBody({ type: EditFidelidadeDto })
  @ApiResponse({
    status: 200,
    description: 'Registro editado com sucesso',
    type: Fidelidade,
  })
  async editar(
    @Param('id') id: number,
    @Body() data: EditFidelidadeDto,
  ): Promise<Fidelidade | null> {
    return this.fidelidadeService.editarFidelidade(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um registro de fidelidade pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da fidelidade' })
  @ApiResponse({ status: 200, description: 'Registro excluído com sucesso' })
  async excluir(@Param('id') id: number): Promise<void> {
    return this.fidelidadeService.excluirFidelidade(id);
  }
}
