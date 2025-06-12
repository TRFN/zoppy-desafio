import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
	providedIn: 'root' // Serviço disponível globalmente na aplicação
})
export class ClientesService {
	// URL base da API (ajuste conforme ambiente/servidor)
	private apiUrl = 'http://localhost:3000';

	constructor(private http: HttpClient) { }

	/**
	 * Busca a lista completa de clientes via GET
	 * @returns Observable com array de clientes
	 */
	lerClientes(): Observable<any[]> {
		return this.http.get<any[]>(`${this.apiUrl}/clientes`);
	}

	/**
	 * Navega para a lista de clientes com confirmação caso o formulário esteja modificado (dirty)
	 * @param context - Contexto do componente que chama este método, deve conter o formulário e o router
	 */
	voltarParaLista(context: any): void {
		if (context.form.dirty) { // Verifica se houve alterações no formulário
			Swal.fire({
				title: 'Deseja voltar?',
				text: 'Deseja mesmo voltar para a lista de clientes? Todas as alterações não salvas serão perdidas.',
				icon: 'warning',
				showCancelButton: true,
				showConfirmButton: true,
				confirmButtonText: 'Sim, voltar',
				cancelButtonText: 'Não, continuar',
				timer: 5000,
				timerProgressBar: true
			}).then((result) => {
				if (result.isConfirmed) {
					context.router.navigate(['/clientes']); // Navega se confirmado
				}
			});
		} else {
			// Se não houver alterações, navega diretamente sem confirmação
			context.router.navigate(['/clientes']);
		}
	}

	/**
	 * Busca os dados do endereço a partir do CEP preenchido no formulário.
	 * Atualiza os campos rua, bairro, cidade e uf no formulário.
	 * Exibe pop-ups de carregamento, sucesso e erro.
	 * @param context - Contexto do componente que chama este método, deve conter o formulário, flag prevenirBuscaCep e referências dos inputs
	 */
	buscarCep(context: any): void {
		const cep = context.form.get('cep')?.value;
		if (cep && cep.length === 9) {
			// Evita busca no carregamento inicial para não sobrescrever dados já preenchidos
			if (context.prevenirBuscaCep) {
				context.prevenirBuscaCep = false;
				return;
			}
			Swal.fire({
				title: 'Buscando CEP...',
				text: 'Aguarde enquanto buscamos as informações do CEP.',
				allowOutsideClick: false,
				allowEscapeKey: false,
				allowEnterKey: false,
				showCloseButton: false,
				showConfirmButton: false,
				didOpen: () => {
					Swal.showLoading();
				}
			});
			// Consulta a API para buscar os dados do CEP (somente números)
			this.getCep(cep.replace(/[^0-9]/g, '')).subscribe({
				next: (dados) => {
					if (dados.erro && dados.erro === "true") {
						Swal.fire({
							icon: 'error',
							title: 'CEP inválido',
							text: 'O CEP informado não foi encontrado.',
						});
						return;
					}
					// Atualiza os campos do formulário com os dados retornados
					context.form.patchValue({
						rua: dados.logradouro + " Nº ",
						bairro: dados.bairro,
						cidade: dados.localidade,
						uf: dados.uf,
					});
					// Fecha o modal de carregamento e foca no input de rua
					setTimeout(() => {
						Swal.close();
						setTimeout(() => context.ruaInput.nativeElement.focus(), 1000);
					}, 0);
				},
				error: (err) => {
					Swal.fire({
						icon: 'error',
						title: 'Erro ao buscar CEP',
						text: 'Não foi possível buscar as informações do CEP. Verifique a conexão com a internet ou o formato do CEP.',
					});
					console.error('Erro ao buscar CEP:', err);
				}
			});
		}
	}

	/**
	 * Adiciona um novo cliente via PUT
	 * @param cliente - objeto com os dados do cliente a serem adicionados
	 * @returns Observable da requisição
	 */
	adicionarCliente(cliente: any): Observable<any> {
		return this.http.put<any>(`${this.apiUrl}/clientes`, cliente);
	}

	/**
	 * Edita um cliente existente via POST
	 * @param id - ID do cliente a ser editado
	 * @param cliente - objeto com os dados atualizados do cliente
	 * @returns Observable da requisição
	 */
	editarCliente(id: number, cliente: any): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}/clientes/${id}`, cliente);
	}

	/**
	 * Remove um cliente via DELETE
	 * @param id - ID do cliente a ser deletado
	 * @returns Observable da requisição
	 */
	deletarCliente(id: number): Observable<any> {
		return this.http.delete<any>(`${this.apiUrl}/clientes/${id}`);
	}

	/**
	 * Busca um cliente pelo ID via GET
	 * @param id - ID do cliente
	 * @returns Observable com os dados do cliente
	 */
	getClientePorId(id: number): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/clientes/${id}`);
	}

	/**
	 * Busca os dados do CEP via GET
	 * @param cep - CEP para consulta (somente números)
	 * @returns Observable com os dados do endereço
	 */
	getCep(cep: string): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/cep/${cep}`);
	}
}
