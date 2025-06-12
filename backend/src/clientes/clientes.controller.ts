import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreationAttributes } from 'sequelize';
import { Cliente } from './clientes.model';

@Controller('clientes')
export class ClientesController {
	constructor(private readonly clientesService: ClientesService) { }

	/**
	 * Endpoint GET /clientes
	 * Retorna todos os clientes cadastrados.
	 * @returns Promise com array de clientes
	 */
	@Get()
	findAll(): Promise<Cliente[]> {
		return this.clientesService.findAll();
	}

	/**
	 * Endpoint GET /clientes/:id
	 * Busca um cliente pelo seu ID.
	 * @param id - ID do cliente recebido via URL
	 * @returns Promise com o cliente encontrado ou null
	 */
	@Get(':id')
	findOne(@Param('id') id: string): Promise<Cliente> {
		return this.clientesService.findOne(id);
	}

	/**
	 * Endpoint PUT /clientes
	 * Cria um novo cliente.
	 * @param cliente - Dados do cliente recebidos no corpo da requisição
	 * @returns Promise com o cliente criado
	 */
	@Put()
	create(@Body() cliente: CreationAttributes<Cliente>): Promise<Cliente> {
		return this.clientesService.insert(cliente);
	}

	/**
	 * Endpoint POST /clientes/:id
	 * Atualiza um cliente existente pelo ID.
	 * @param id - ID do cliente recebido via URL
	 * @param cliente - Dados para atualização recebidos no corpo da requisição
	 * @returns Promise com um array contendo [número de registros afetados, array dos clientes atualizados]
	 */
	@Post(':id')
	update(
		@Param('id') id: string,
		@Body() cliente: CreationAttributes<Cliente>,
	): Promise<[number, Cliente[]]> {
		return this.clientesService.update(id, cliente);
	}

	/**
	 * Endpoint DELETE /clientes/:id
	 * Remove um cliente pelo ID.
	 * @param id - ID do cliente recebido via URL
	 * @returns Promise<void>
	 */
	@Delete(':id')
	delete(@Param('id') id: string): Promise<void> {
		return this.clientesService.delete(id);
	}
}

