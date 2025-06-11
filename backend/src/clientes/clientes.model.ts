import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Cliente extends Model {
	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	nome: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	email: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	telefone: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	datanascimento: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	cep: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	logradouro: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	bairro: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	localidade: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	uf: string;
}
