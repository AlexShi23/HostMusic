import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {TuiActionModule} from '@taiga-ui/kit';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        TuiActionModule
    ],
    declarations: [
        LayoutComponent,
        OverviewComponent
    ]
})
export class AdminModule { }