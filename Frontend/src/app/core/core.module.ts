import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiDataListModule, TuiDialogModule, TuiHostedDropdownModule, TuiModeModule, TuiAlertModule, TuiRootModule, TuiSvgModule, TuiThemeNightModule, TuiLoaderModule, TuiLinkModule, TuiDropdownModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiTabsModule, TuiToggleModule, TuiBadgeModule, TuiBreadcrumbsModule, TuiDataListDropdownManagerModule } from '@taiga-ui/kit';
import { TuiLineChartModule, TuiAxesModule } from '@taiga-ui/addon-charts';
import { CommonModule } from '@angular/common';

import { AdminModule } from './admin/admin.module';
import { ProfileModule } from './profile/profile.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoreRoutingModule } from './core-routing.module';
import { LayoutComponent } from './layout.component';
import { TuiLanguageSwitcherModule } from '@app/common/language-switcher/language-switcher.module';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from '@app/app.module';
import { HttpClient } from '@angular/common/http';

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
        TuiBreadcrumbsModule,
        TuiDataListDropdownManagerModule,
        TuiDropdownModule,
        TuiActiveZoneModule,
        TuiLanguageSwitcherModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [
        LayoutComponent,
        DashboardComponent
    ]
})
export class CoreModule { }