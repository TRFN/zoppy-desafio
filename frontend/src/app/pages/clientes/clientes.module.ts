/**
 * Módulo de funcionalidade responsável pela área de clientes.
 *
 * Este módulo organiza e encapsula a funcionalidade relacionada a clientes,
 * agrupando as rotas específicas do módulo via ClientesRoutingModule e 
 * importando o CommonModule para funcionalidades básicas do Angular.
 *
 * Estrutura típica de um módulo "feature" no Angular, que facilita a manutenção,
 * escalabilidade e carregamento separado das funcionalidades da aplicação.
 *
 * Atualmente, não declara componentes diretamente, pois os componentes podem ser
 * standalone ou declarados em módulos específicos.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,          // Importa diretivas e pipes comuns do Angular (ngIf, ngFor, etc)
    ClientesRoutingModule  // Importa as rotas específicas do módulo clientes
  ],
  providers: []             // Serviços específicos do módulo podem ser declarados aqui, se houver
})
export class ClientesModule { }
