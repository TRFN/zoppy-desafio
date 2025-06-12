import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreationAttributes } from 'sequelize';
import { Cliente } from './clientes.model';

@Controller('clientes')
export class ClientesController {
	constructor(private readonly clientesService: ClientesService) { }

	@Get()
	findAll(): Promise<Cliente[]> {
		return this.clientesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string): Promise<Cliente> {
		return this.clientesService.findOne(id);
	}

	@Put()
	create(@Body() cliente: CreationAttributes<Cliente>): Promise<Cliente> {
		return this.clientesService.insert(cliente);
	}

	@Post(':id')
	update(@Param('id') id: string, @Body() cliente: CreationAttributes<Cliente>): Promise<[number, Cliente[]]> {
		return this.clientesService.update(id, cliente);
	}

	@Delete(':id')
	delete(@Param('id') id: string): Promise<void> {
		return this.clientesService.delete(id);
	}
}
