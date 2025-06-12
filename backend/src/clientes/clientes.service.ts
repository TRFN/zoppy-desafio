// src/clientes/clientes.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cliente } from './clientes.model';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class ClientesService {
	constructor(
		@InjectModel(Cliente) // Injeta o modelo Sequelize do Cliente
		private clienteModel: typeof Cliente,
	) { }

	/**
	 * Retorna todos os clientes cadastrados no banco
	 * @returns Promise com um array de objetos Cliente
	 */
	async findAll(): Promise<Cliente[]> {
		return this.clienteModel.findAll();
	}

	/**
	 * Busca um cliente pelo seu ID (chave primária)
	 * @param id - ID do cliente a ser buscado
	 * @returns Promise com o objeto Cliente encontrado ou null se não existir
	 */
	async findOne(id: string): Promise<Cliente> {
		return this.clienteModel.findByPk(id);
	}

	/**
	 * Insere um novo cliente no banco de dados
	 * @param cliente - Objeto com os atributos para criação do cliente
	 * @returns Promise com o cliente criado
	 */
	async insert(cliente: CreationAttributes<Cliente>): Promise<Cliente> {
		return this.clienteModel.create(cliente);
	}

	/**
	 * Atualiza um cliente existente com base no ID
	 * @param id - ID do cliente a ser atualizado
	 * @param cliente - Objeto com os atributos para atualização
	 * @returns Promise com um array contendo [número de registros afetados, array com os clientes atualizados]
	 */
	async update(id: string, cliente: CreationAttributes<Cliente>): Promise<[number, Cliente[]]> {
		return this.clienteModel.update(cliente, {
			where: { id },
			returning: true, // Retorna os registros atualizados
		});
	}

	/**
	 * Deleta um cliente pelo ID, se existir
	 * @param id - ID do cliente a ser deletado
	 * @throws Erro se o cliente não for encontrado
	 * @returns Promise<void> indica que é uma operação assíncrona sem retorno
	 */
	async delete(id: string): Promise<void> {
		const cliente = await this.clienteModel.findByPk(id);
		if (cliente) {
			await cliente.destroy();
		} else {
			throw new Error(`Cliente with id ${id} not found`);
		}
	}
}
