// src/clientes/clientes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cliente } from './clientes.model';

@Injectable()
export class ClientesService {
	constructor(
		@InjectModel(Cliente)
		private clienteModel: typeof Cliente,
	) { }

	async findAll(): Promise<Cliente[]> {
		return this.clienteModel.findAll();
	}

	async findOne(id: string): Promise<Cliente> {
		return this.clienteModel.findByPk(id);
	}
	async insert(cliente: any): Promise<Cliente> {
		return this.clienteModel.create(cliente);
	}
	async update(id: string, cliente: any): Promise<[number, Cliente[]]> {
		return this.clienteModel.update(cliente, {
			where: { id },
			returning: true,
		});
	}
	async delete(id: string): Promise<void> {
		const cliente = await this.clienteModel.findByPk(id);
		if (cliente) {
			await cliente.destroy();
		}
		else {
			throw new Error(`Cliente with id ${id} not found`);
		}
	}
}
