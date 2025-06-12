import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../clientes.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  clientes: any[] = [];
  clientesExibidos: any[] = [];

  paginaAtual = 1;
  porPagina = 5;
  totalPaginas = 1;
  paginas: number[] = [];

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clientesService.lerClientes().subscribe((dados) => {
      this.clientes = dados;
      this.totalPaginas = Math.ceil(this.clientes.length / this.porPagina);
      this.atualizarPaginacao();
    });
  }

  adicionarCliente(): void {
    this.router.navigate(['/clientes/novo']);
  }

  mudarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaAtual = pagina;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.porPagina;
    const fim = inicio + this.porPagina;
    this.clientesExibidos = this.clientes.slice(inicio, fim);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }
}
