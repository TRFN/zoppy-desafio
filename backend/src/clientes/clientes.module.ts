import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cliente } from './clientes.model';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';

@Module({
  imports: [SequelizeModule.forFeature([Cliente])],
  providers: [ClientesService],
  controllers: [ClientesController],
})
export class ClientesModule { }
