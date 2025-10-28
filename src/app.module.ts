import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { FidelidadeModule } from './fidelidade/fidelidade.module';
import { ImportacaoModule } from './importacao/importacao.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'api_utopia',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsuarioModule,
    FidelidadeModule,
    ImportacaoModule,
    AuthModule,
  ],
})
export class AppModule {}
