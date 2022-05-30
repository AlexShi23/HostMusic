import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { Role } from '@app/_models';
import { AuthGuard } from '@app/_helpers';
import { DashboardComponent } from './dashboard/dashboard.component';

const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const releasesModule = () => import('./releases/releases.module').then(x => x.ReleasesModule);

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
            { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
            { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
            { path: 'releases', loadChildren: releasesModule, canActivate: [AuthGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule { }