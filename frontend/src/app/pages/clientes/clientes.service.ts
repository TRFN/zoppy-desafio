import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ClientesService {
	private apiUrl = 'http://localhost:3000/clientes';

	constructor(private http: HttpClient) { }

	getTodos(): Observable<any[]> {
		return this.http.get<any[]>(this.apiUrl);
	}
}
