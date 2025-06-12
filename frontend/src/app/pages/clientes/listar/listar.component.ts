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
  // Lista completa de clientes carregados da API
  clientes: any[] = [];

  // Lista de clientes exibidos na página atual (paginada e filtrada)
  clientesExibidos: any[] = [];

  // String para o filtro de pesquisa
  filtro: string = '';

  // Controle de paginação
  paginaAtual = 1;      // Página atual selecionada
  porPagina = 5;        // Quantidade de clientes por página
  totalPaginas = 1;     // Total de páginas calculadas
  paginas: number[] = []; // Array com números das páginas para navegação

  // Referências a elementos HTML para manipulação direta (inputs de filtro e botão limpar)
  @ViewChild('filtroPesquisa') filtroPesquisa!: ElementRef;
  @ViewChild('limparPesquisa') limparPesquisa!: ElementRef;

  constructor(
    private clientesService: ClientesService, // Serviço para CRUD de clientes
    private router: Router                    // Navegação entre rotas
  ) { }

  /**
   * Método do ciclo de vida Angular que é chamado quando o componente é inicializado.
   * Aqui carregamos a lista inicial de clientes.
   */
  ngOnInit(): void {
    this.lerClientes();
  }

  /**
   * Lê os clientes da API via serviço.
   * Aceita opcionalmente um filtro que será aplicado localmente na lista.
   * Atualiza a lista de clientes, formata dados e controla visibilidade do botão de limpar filtro.
   * Também calcula paginação.
   *
   * @param filtro Função de filtro opcional para filtrar clientes
   */
  private lerClientes(filtro?: (entrada: any) => boolean): void {
    this.clientesService.lerClientes().subscribe((dados) => {
      this.clientes = dados;

      // Ordena os clientes por nome (alfabeticamente)
      this.clientes.sort((a, b) => a.nome.localeCompare(b.nome));

      // Formata data de nascimento e telefone para exibição
      this.clientes.map(cliente => {
        cliente.datanascimento = new Date(cliente.datanascimento).toLocaleDateString('pt-BR');
        cliente.telefone = cliente.telefone
          .replace(/[^0-9]/g, '')
          .replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
      });

      // Aplica filtro, se fornecido
      if (filtro) {
        this.clientes = this.clientes.filter(filtro);
        // Exibe o botão limpar filtro
        if (this.limparPesquisa.nativeElement.classList.contains("d-none")) {
          this.limparPesquisa.nativeElement.classList.remove("d-none");
        }
      } else {
        // Oculta o botão limpar filtro se não há filtro aplicado
        if (!this.limparPesquisa.nativeElement.classList.contains("d-none")) {
          this.limparPesquisa.nativeElement.classList.add("d-none");
        }
      }

      // Atualiza lista exibida e paginação
      this.clientesExibidos = this.clientes;
      this.totalPaginas = Math.ceil(this.clientesExibidos.length / this.porPagina);
      this.paginaAtual = 1; // Reseta para primeira página após filtro
      this.atualizarPaginacao();
    });
  }

  /**
   * Aplica o filtro de pesquisa baseado no valor do input.
   * Filtra por nome, email ou telefone.
   */
  filtrarClientes(): void {
    const filtro = new RegExp(this.filtroPesquisa.nativeElement.value, "gi");
    if (!filtro || this.filtroPesquisa.nativeElement.value.trim() === '') {
      this.lerClientes(); // Se filtro vazio, recarrega todos
      return;
    } else {
      this.lerClientes(cliente =>
        filtro.test(cliente.nome) ||
        filtro.test(cliente.email) ||
        filtro.test(cliente.telefone)
      );
    }
  }

  /**
   * Limpa o filtro e recarrega a lista completa.
   */
  limparFiltro(): void {
    this.filtroPesquisa.nativeElement.value = '';
    this.lerClientes();
  }

  /**
   * Navega para a página de cadastro de novo cliente.
   */
  adicionarCliente(): void {
    this.router.navigate(['/clientes/novo']);
  }

  /**
   * Navega para a página de edição do cliente selecionado.
   *
   * @param cliente ID do cliente a ser editado
   */
  editarCliente(cliente: number): void {
    this.router.navigate(['/clientes/editar', cliente]);
  }

  /**
   * Solicita confirmação e deleta o cliente selecionado.
   * Após sucesso, recarrega a lista.
   *
   * @param cliente ID do cliente a ser deletado
   */
  deletarCliente(cliente: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, deletar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.deletarCliente(cliente).subscribe({
          next: () => {
            Swal.fire(
              'Deletado!',
              'O cliente foi deletado com sucesso.',
              'success'
            );
            this.lerClientes();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao deletar cliente',
              text: 'Não foi possível deletar o cliente. Tente novamente mais tarde.'
            });
            console.error('Erro ao deletar cliente:', err);
          }
        });
      }
    });
  }

  /**
   * Muda a página exibida, respeitando limites.
   *
   * @param pagina Número da página para navegar
   */
  mudarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaAtual = pagina;
    this.atualizarPaginacao();
  }

  /**
   * Atualiza a lista de clientes exibidos de acordo com a página atual
   * e gera o array de páginas para o componente de paginação.
   */
  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.porPagina;
    const fim = inicio + this.porPagina;
    this.clientesExibidos = this.clientes.slice(inicio, fim);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }
}
