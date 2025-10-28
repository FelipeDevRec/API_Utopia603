import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const config = new DocumentBuilder()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .setTitle('API Utopia603')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .setDescription('Documentação da API do Programa de Fidelidade')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .setVersion('1.0')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .addBearerAuth()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
