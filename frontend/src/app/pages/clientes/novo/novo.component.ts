import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../clientes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
      logradouro: [''],
      bairro: [''],
      localidade: [''],
      uf: [''],
    });
  }

  voltarParaLista(): void {
    this.router.navigate(['/clientes']);
  }

  buscarCep(): void {
    const cep = this.form.get('cep')?.value;
    if (cep && cep.length === 8) {
      this.clientesService.getCep(cep).subscribe({
        next: (dados) => {
          this.form.patchValue({
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            localidade: dados.localidade,
            uf: dados.uf,
          });
        },
        error: (err) => {
          alert('Erro ao buscar CEP: ' + err.message);
        },
      });
    } else {
      alert('CEP inválido. Deve conter 8 dígitos.');
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
