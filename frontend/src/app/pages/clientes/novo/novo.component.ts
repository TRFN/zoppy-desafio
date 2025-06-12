import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../clientes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import IMask from 'imask';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-novo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.css'],
})

export class NovoComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private router: Router
  ) {
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

  @ViewChild('cepInput') cepInput!: ElementRef;
  @ViewChild('ruaInput') ruaInput!: ElementRef;
  @ViewChild('telefoneInput') telefoneInput!: ElementRef;

  ngAfterViewInit(): void {
    const camposComMascara = {
      "cep": [this.cepInput.nativeElement, '00000-000'],
      "telefone": [this.telefoneInput.nativeElement, ['(00) 0000-0000', '(00) 00000-0000']],
    };
    Object.entries(camposComMascara).forEach(([campo, [elemento, mascara]]) => {
      if (elemento) {
        IMask(elemento, { mask: mascara });
      }
    });

    // forcar tooltip nos inputs
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


  voltarParaLista(): void {
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
        this.router.navigate(['/clientes']);
      }
    });
  }

  buscarCep(): void {
    const cep = this.form.get('cep')?.value;
    if (cep && cep.length === 9) {
      this.clientesService.getCep(cep.replace(/[^0-9]/g, '')).subscribe({
        next: (dados) => {
          if (dados.erro && dados.erro === "true") {
            Swal.fire({
              icon: 'error',
              title: 'CEP inválido',
              text: 'O CEP informado não foi encontrado.',
            });
            return;
          }
          this.form.patchValue({
            rua: dados.logradouro + " Nº ",
            bairro: dados.bairro,
            cidade: dados.localidade,
            uf: dados.uf,
          });
          setTimeout(() => {
            this.ruaInput.nativeElement.focus();
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.clientesService.adicionarCliente(this.form.value).subscribe({
      next: () => {
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
            const countdownElement = Swal.getHtmlContainer()?.querySelector('.countdown');
            let countdown = 5;
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
          if (acao.isConfirmed) {
            this.form.reset();
            this.form.markAsPristine();
            this.form.markAsUntouched();
            this.form.updateValueAndValidity();
          } else {
            this.router.navigate(['/clientes']);
          }
        });
      },
      error: (err) => {
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
