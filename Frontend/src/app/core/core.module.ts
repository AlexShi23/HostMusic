import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiDataListModule, TuiDialogModule, TuiHostedDropdownModule, TuiModeModule, TuiAlertModule, TuiRootModule, TuiSvgModule, TuiThemeNightModule, TuiLoaderModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiTabsModule, TuiToggleModule, TuiBadgeModule, TuiBreadcrumbsComponent, TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { TuiLineChartModule, TuiAxesModule } from '@taiga-ui/addon-charts';
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
        TuiAlertModule,
        TuiTabsModule,
        TuiButtonModule,
        TuiThemeNightModule,
        TuiModeModule,
        TuiSvgModule,
        TuiAvatarModule,
        TuiToggleModule,
        TuiHostedDropdownModule,
        TuiDataListModule,
        TuiLineChartModule,
        TuiAxesModule,
        TuiLoaderModule,
        TuiBadgeModule,
        TuiLinkModule,
        TuiBreadcrumbsModule
    ],
    declarations: [
        LayoutComponent,
        DashboardComponent
    ]
})
export class CoreModule { }