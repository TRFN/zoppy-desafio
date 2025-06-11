import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppService } from './app.service';
import { CepService } from './cep/cep.service';
import { CepController } from './cep/cep.controller';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [SequelizeModule.forRoot({
    dialect: 'sqlite',
    storage: './db.sqlite', // será criado na raiz do projeto
    autoLoadModels: true,
    synchronize: true,
  }), ClientesModule],
  controllers: [AppController, CepController],
  providers: [AppService, CepService],
})
export class AppModule { }
