// Importações principais
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../clientes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap'; // Tooltips do Bootstrap
import IMask from 'imask';              // Máscara de input
import Swal from 'sweetalert2';         // Pop-ups bonitos e funcionais

@Component({
  selector: 'app-novo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.css'],
})
export class NovoComponent {
  form: FormGroup; // Formulário reativo

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private router: Router
  ) {
    // Inicialização do formulário com validações
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

  // Referências aos campos de input no template
  @ViewChild('cepInput') cepInput!: ElementRef;
  @ViewChild('ruaInput') ruaInput!: ElementRef;
  @ViewChild('telefoneInput') telefoneInput!: ElementRef;

  ngAfterViewInit(): void {
    // Aplica máscaras nos campos usando IMask
    const camposComMascara = {
      "cep": [this.cepInput.nativeElement, '00000-000'],
      "telefone": [this.telefoneInput.nativeElement, ['(00) 0000-0000', '(00) 00000-0000']],
    };
    Object.entries(camposComMascara).forEach(([campo, [elemento, mascara]]) => {
      if (elemento) {
        IMask(elemento, { mask: mascara });
      }
    });

    // Inicializa tooltips do Bootstrap em inputs que possuírem o atributo data-bs-toggle="tooltip"
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

  // Chama o método compartilhado de navegação com confirmação
  voltarParaLista(): void {
    this.clientesService.voltarParaLista(this);
  }

  // Chama o método compartilhado para buscar o CEP
  buscarCep(): void {
    this.clientesService.buscarCep(this);
  }

  // Envio do formulário
  onSubmit(): void {
    if (this.form.invalid) {
      // Marca todos os campos como tocados para exibir erros
      this.form.markAllAsTouched();
      return;
    }

    // Envia os dados do formulário para o backend
    this.clientesService.adicionarCliente(this.form.value).subscribe({
      next: () => {
        // Exibe modal de sucesso com redirecionamento automático ou opção de continuar
        Swal.fire({
          icon: 'success',
          title: 'Cliente adicionado',
          html: '<strong>O cliente foi cadastrado com sucesso!</strong><br>Você será redirecionado para a lista de clientes automaticamente em <span class="countdown">5</span> segundos.',
          showCancelButton: true,
          confirmButtonText: 'Cadastrar outro cliente',
          cancelButtonText: 'Voltar para lista',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showCloseButton: false,
          timer: 5000,
          timerProgressBar: true,
          didOpen: () => {
            // Atualiza contador de tempo no modal
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
          // Se o usuário quiser cadastrar outro cliente, limpa o formulário
          if (acao.isConfirmed) {
            this.form.reset();
            this.form.markAsPristine();
            this.form.markAsUntouched();
            this.form.updateValueAndValidity();
          } else {
            // Caso contrário, volta para a lista de clientes
            this.router.navigate(['/clientes']);
          }
        });
      },
      error: (err) => {
        // Exibe erro ao adicionar cliente
        console.error('Erro ao adicionar cliente:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao adicionar cliente',
          text: 'Não foi possível adicionar o cliente. Verifique os dados e tente novamente.',
        });
      }
    });
  }
}
