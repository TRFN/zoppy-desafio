import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CepService {
	async buscarCep(cep: string) {
		const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
		return response.data;
	}
}
