import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiDataListModule, TuiDialogModule, TuiHostedDropdownModule, TuiModeModule, TuiNotificationsModule, TuiRootModule, TuiSvgModule, TuiThemeNightModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiTabsModule, TuiToggleModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';

import { AdminModule } from './admin/admin.module';
import { ProfileModule } from './profile/profile.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoreRoutingModule } from './core-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
    imports: [
        CoreRoutingModule,
        AdminModule,
        ProfileModule,
        CommonModule,
        ReactiveFormsModule,
        TuiRootModule,
        TuiDialogModule,
        TuiNotificationsModule,
        TuiTabsModule,
        TuiButtonModule,
        TuiThemeNightModule,
        TuiModeModule,
        TuiSvgModule,
        TuiAvatarModule,
        TuiToggleModule,
        TuiHostedDropdownModule,
        TuiDataListModule
    ],
    declarations: [
        LayoutComponent,
        DashboardComponent
    ]
})
export class CoreModule { }