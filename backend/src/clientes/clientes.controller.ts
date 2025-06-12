// src/clientes/clientes.controller.ts
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Controller('clientes')
export class ClientesController {
	constructor(private readonly clientesService: ClientesService) { }

	@Get()
	async findAll() {
		return this.clientesService.findAll();
	}

	@Get(':id')
	async findOne(id: string) {
		return this.clientesService.findOne(id);
	}

	@Post()
	async insert(cliente: any) {
		return this.clientesService.insert(cliente);
	}
	@Post(':id')
	async update(id: string, cliente: any) {
		return this.clientesService.update(id, cliente);
	}
	
	@Delete(':id')
	async delete(id: string) {
		return this.clientesService.delete(id);
	}
}
