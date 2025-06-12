import { Table, Column, Model, DataType } from 'sequelize-typescript';

/**
 * Modelo Cliente representando a tabela 'clientes' no banco de dados.
 */
@Table
export class Cliente extends Model {

	/**
	 * Nome do cliente (obrigatório)
	 */
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	nome: string;

	/**
	 * Email do cliente (obrigatório)
	 */
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	email: string;

	/**
	 * Telefone do cliente (obrigatório)
	 */
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	telefone: string;

	/**
	 * Data de nascimento do cliente no formato string (obrigatório)
	 */
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	datanascimento: string;

	/**
	 * CEP do cliente (obrigatório)
	 */
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	cep: string;

	/**
	 * Rua do endereço do cliente (opcional)
	 */
	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	rua: string;

	/**
	 * Bairro do endereço do cliente (opcional)
	 */
	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	bairro: string;

	/**
	 * Cidade do cliente (opcional)
	 */
	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	cidade: string;

	/**
	 * Unidade Federativa (Estado) do cliente (opcional)
	 */
	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	uf: string;
}
