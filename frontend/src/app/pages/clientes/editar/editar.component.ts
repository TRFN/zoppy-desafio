import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../clientes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import IMask from 'imask';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
  standalone: true
})
export class EditarComponent {
  // Formulário reativo para edição dos dados do cliente
  form: FormGroup;

  // Flag para evitar busca de CEP ao carregar o cliente (evita sobrescrever dados)
  prevenirBuscaCep: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private router: Router
  ) {
    // Inicializa o formulário com campos e validações
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      datanascimento: ['', Validators.required],
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
    });
  }

  // Referências aos inputs do template para manipulação direta (máscaras, foco)
  @ViewChild('cepInput') cepInput!: ElementRef;
  @ViewChild('ruaInput') ruaInput!: ElementRef;
  @ViewChild('telefoneInput') telefoneInput!: ElementRef;

  /**
   * Método privado para carregar os dados do cliente pelo ID da URL e preencher o formulário.
   * Também dispara eventos para acionar máscaras e marca o formulário como não modificado.
   */
  private carregarCliente(): void {
    // Extrai o ID do cliente da URL (último segmento)
    const id = Number(this.router.url.split('/').pop());

    this.clientesService.getClientePorId(id).subscribe({
      next: (cliente) => {
        if (!cliente) {
          // Caso cliente não encontrado, mostra alerta e redireciona para a lista
          Swal.fire({
            icon: 'error',
            title: 'Cliente não encontrado',
            text: 'O cliente que você está tentando editar não foi encontrado.',
          }).then(() => this.router.navigate(['/clientes']));
          return;
        }

        // Evita buscar CEP automaticamente ao preencher os dados
        this.prevenirBuscaCep = true;

        // Atualiza o formulário com os dados do cliente
        this.form.patchValue(cliente);

        // Dispara eventos 'input' para aplicar máscaras nos inputs de telefone e cep
        setTimeout(() => {
          const inputs = [
            this.telefoneInput.nativeElement as HTMLInputElement,
            this.cepInput.nativeElement as HTMLInputElement
          ];
          inputs.forEach(input => {
            if (input) {
              const event = new Event('input', { bubbles: true });
              input.dispatchEvent(event);
            }
          });

          // Marca o formulário como não modificado para evitar comportamento de dirty
          this.form.markAsPristine();
          this.form.markAsUntouched();
        });
      }
    });
  }

  /**
   * Lifecycle hook Angular chamado após a inicialização da view.
   * Executa carregamento do cliente, aplica máscaras e configura tooltips.
   */
  ngAfterViewInit(): void {
    // Carrega dados do cliente para edição
    this.carregarCliente();

    // Configura máscaras nos inputs de CEP e Telefone usando IMask
    const camposComMascara = {
      "cep": [this.cepInput.nativeElement, '00000-000'],
      "telefone": [this.telefoneInput.nativeElement, ['(00) 0000-0000', '(00) 00000-0000']],
    };

    Object.entries(camposComMascara).forEach(([campo, [elemento, mascara]]) => {
      if (elemento) {
        IMask(elemento, { mask: mascara });
      }
    });

    // Força tooltip nos inputs com atributo data-bs-toggle="tooltip"
    const inputs = document.querySelectorAll('input[data-bs-toggle="tooltip"]');
    inputs.forEach((input) => {
      const tooltip = new bootstrap.Tooltip(input, {
        trigger: 'focus',
        placement: 'top',
      });
      input.addEventListener('focus', () => {
        tooltip.show();
      });
      input.addEventListener('blur', () => {
        tooltip.hide();
      });
    });
  }

  /**
   * Método para navegar de volta para a lista de clientes.
   * Utiliza serviço para checar se o formulário foi modificado antes de sair.
   */
  voltarParaLista(): void {
    this.clientesService.voltarParaLista(this);
  }

  /**
   * Chama o serviço para buscar dados do CEP e atualizar o formulário.
   */
  buscarCep(): void {
    this.clientesService.buscarCep(this);
  }

  /**
   * Envia o formulário para edição do cliente.
   * Valida formulário, verifica existência do cliente e atualiza os dados.
   * Exibe alertas de sucesso ou erro e opções após a ação.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      // Marca todos os campos como tocados para exibir validações
      this.form.markAllAsTouched();
      return;
    }

    // Obtém o ID do cliente da URL para edição
    const clienteId = Number(this.router.url.split('/').pop());
    if (isNaN(clienteId)) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'ID do cliente inválido. Não foi possível editar o cliente.',
      });
      return;
    }

    // Verifica se o cliente existe antes de tentar editar
    this.clientesService.getClientePorId(clienteId).subscribe({
      next: (cliente) => {
        if (!cliente) {
          Swal.fire({
            icon: 'error',
            title: 'Cliente não encontrado',
            text: 'O cliente que você está tentando editar não foi encontrado.',
          }).then(() => this.router.navigate(['/clientes']));
          return;
        }
      },
    });

    // Chama serviço para editar o cliente com os dados do formulário
    this.clientesService.editarCliente(clienteId, this.form.value).subscribe({
      next: () => {
        // Alerta de sucesso com contagem regressiva e opção de voltar para lista
        Swal.fire({
          icon: 'success',
          title: 'Cliente editado',
          html: '<strong>O cliente foi modificado com sucesso!</strong><br>Você será redirecionado para a lista de clientes automaticamente em <span class="countdown">5</span> segundos.',
          showCancelButton: true,
          confirmButtonText: 'Permanecer na página',
          cancelButtonText: 'Voltar para a lista',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showCloseButton: false,
          timer: 5000,
          timerProgressBar: true,
          didOpen: () => {
            const countdownElement = Swal.getHtmlContainer()?.querySelector('.countdown');
            let countdown = 4;
            const interval = setInterval(() => {
              if (countdownElement) {
                countdownElement.textContent = countdown.toString();
              }
              countdown--;
              if (countdown < 0) {
                clearInterval(interval);
              }
            }, 1000);
          }
        }).then(acao => {
          if (!acao.isConfirmed) {
            // Navega para lista se o usuário não quiser permanecer
            this.router.navigate(['/clientes']);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao adicionar cliente:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao modificar cliente',
          text: 'Não foi possível modificar o cliente. Verifique os dados e tente novamente.',
        });
      }
    });
  }
}
