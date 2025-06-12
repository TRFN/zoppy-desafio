import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClientesService } from '../clientes.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar',
  imports: [CommonModule],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  clientes: any[] = [];
  clientesExibidos: any[] = [];
  filtro: string = '';

  paginaAtual = 1;
  porPagina = 5;
  totalPaginas = 1;
  paginas: number[] = [];

  @ViewChild('filtroPesquisa') filtroPesquisa!: ElementRef;

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lerClientes();

  }

  private lerClientes(filtro?: (entrada: any) => boolean): void {
    this.clientesService.lerClientes().subscribe((dados) => {
      this.clientes = dados;
      this.clientes.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordenar por nome
      this.clientes.map(cliente => {
        cliente.datanascimento = new Date(cliente.datanascimento).toLocaleDateString('pt-BR');
        cliente.telefone = cliente.telefone.replace(/[^0-9]/g, '').replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3'); // Formatar telefone
      });

      if (filtro) {
        this.clientes = this.clientes.filter(filtro);
      }

      this.clientesExibidos = this.clientes;
      this.totalPaginas = Math.ceil(this.clientesExibidos.length / this.porPagina);
      this.paginaAtual = 1; // Resetar para a primeira página após o filtro
      this.atualizarPaginacao();
    });
  }

  filtrarClientes(): void {
    const filtro = new RegExp(this.filtroPesquisa.nativeElement.value, "gi");
    if (!filtro) {
      this.lerClientes();
      return;
    } else {
      this.lerClientes(cliente =>
        filtro.test(cliente.nome) ||
        filtro.test(cliente.email) ||
        filtro.test(cliente.telefone)
      );
    }
  }

  limparFiltro(): void {
    this.filtroPesquisa.nativeElement.value = '';
    this.lerClientes();
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
