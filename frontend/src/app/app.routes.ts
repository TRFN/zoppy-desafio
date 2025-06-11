import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'clientes', pathMatch: 'full' },
	{
		path: 'clientes',
		loadChildren: () =>
			import('./pages/clientes/clientes.module').then(m => m.ClientesModule),
	},
	{ path: '**', redirectTo: 'clientes' }
];
