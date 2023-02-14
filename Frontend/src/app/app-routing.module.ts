import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const coreModule = () => import('./core/core.module').then(x => x.CoreModule);

const routes: Routes = [
    { path: '', loadChildren: coreModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
