import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiInputPasswordModule, TuiFieldErrorModule, TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiDataListModule } from '@taiga-ui/core';

import { AccountsRoutingModule } from './accounts-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountsRoutingModule,
        TuiButtonModule,
        TuiInputModule,
        TuiInputPasswordModule,
        TuiFieldErrorModule,
        TuiLinkModule,
        TuiDataListWrapperModule,
        TuiSelectModule,
        TuiDataListModule
    ],
    declarations: [
        ListComponent,
        AddEditComponent
    ]
})
export class AccountsModule { }