import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-listar',
  imports: [],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent implements OnInit {
  clientes: any[] = [];
  clientesExibidos: any[] = [];

  paginaAtual = 1;
  porPagina = 5;
  totalPaginas = 1;
  paginas: number[] = [];

  constructor(private clientesService: ClientesService) { }

  ngOnInit(): void {
    this.clientesService.getTodos().subscribe((dados) => {
      this.clientes = dados;
      this.totalPaginas = Math.ceil(this.clientes.length / this.porPagina);
      this.atualizarPaginacao();
    });
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
