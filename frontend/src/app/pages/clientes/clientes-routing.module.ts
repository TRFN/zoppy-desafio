// Importação dos módulos necessários do Angular

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { NovoComponent } from './novo/novo.component';
import { EditarComponent } from './editar/editar.component';

// Definição das rotas para o módulo de clientes
const routes: Routes = [
  { path: '', component: ListarComponent },
  { path: 'listar', component: ListarComponent },
  { path: 'novo', component: NovoComponent },
  { path: 'editar/:id', component: EditarComponent }
];

// Módulo de roteamento para o módulo de clientes
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

// Exportação do módulo de roteamento
export class ClientesRoutingModule { }
