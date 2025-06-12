/**
 * Módulo de roteamento para o módulo de clientes.
 *
 * Define as rotas específicas para as operações de clientes, vinculando URLs
 * a componentes correspondentes.
 *
 * Rotas configuradas:
 * - '' e 'listar': exibem a lista de clientes via ListarComponent.
 * - 'novo': formulário para criação de um novo cliente via NovoComponent.
 * - 'editar/:id': formulário para edição de um cliente existente, identificado pelo parâmetro 'id', via EditarComponent.
 *
 * Este módulo é importado pelo ClientesModule para configurar o roteamento interno
 * do módulo de clientes.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { NovoComponent } from './novo/novo.component';
import { EditarComponent } from './editar/editar.component';

const routes: Routes = [
  { path: '', component: ListarComponent },
  { path: 'listar', component: ListarComponent },
  { path: 'novo', component: NovoComponent },
  { path: 'editar/:id', component: EditarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesRoutingModule { }
