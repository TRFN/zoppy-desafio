import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ClientesService {
	private apiUrl = 'http://localhost:3000';

	constructor(private http: HttpClient) { }

	lerClientes(): Observable<any[]> {
		return this.http.get<any[]>(`${this.apiUrl}/clientes`);
	}

	adicionarCliente(cliente: any): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}/clientes`, cliente);
	}

	editarCliente(id: number, cliente: any): Observable<any> {
		return this.http.put<any>(`${this.apiUrl}/clientes/${id}`, cliente);
	}

	deletarCliente(id: number): Observable<any> {
		return this.http.delete<any>(`${this.apiUrl}/clientes/${id}`);
	}

	getClientePorId(id: number): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/clientes/${id}`);
	}

	getCep(cep: string): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/cep/${cep}`);
	}
}
