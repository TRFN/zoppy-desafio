import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../clientes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import IMask from 'imask';

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
      rua: [''],
      bairro: [''],
      cidade: [''],
      uf: [''],
    });
  }

  @ViewChild('cepInput') cepInput!: ElementRef;
  @ViewChild('ruaInput') ruaInput!: ElementRef;

  ngAfterViewInit(): void {
    const popoverTrigger = this.cepInput.nativeElement;
    if (popoverTrigger) {
      // Aplicando máscara de CEP no campo de entrada

      IMask(popoverTrigger, {
        mask: '00000-000'
      });
    }
  }


  voltarParaLista(): void {
    this.router.navigate(['/clientes']);
  }

  buscarCep(): void {
    const cep = this.form.get('cep')?.value;
    if (cep && cep.length === 9) {
      this.clientesService.getCep(cep.replace(/[^0-9]/g, '')).subscribe({
        next: (dados) => {
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
          alert('Erro ao buscar CEP: ' + err.message);
        },
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
        alert('Cliente adicionado com sucesso!');
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        alert('Erro ao adicionar cliente: ' + err.message);
      },
    });
  }
}
