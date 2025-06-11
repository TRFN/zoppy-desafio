import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CepService } from './cep/cep.service';
import { CepController } from './cep/cep.controller';

@Module({
  imports: [],
  controllers: [AppController, CepController],
  providers: [AppService, CepService],
})
export class AppModule {}
