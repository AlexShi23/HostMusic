import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiInputPasswordModule, TuiFieldErrorModule, TuiDataListWrapperModule, TuiSelectModule, TuiPaginationModule,
    TuiInputDateModule, TuiFilesModule, TuiInputFilesModule, TuiProgressModule, TuiTextAreaModule, TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiDataListModule } from '@taiga-ui/core';

import { ReleasesRoutingModule } from './releases-routing.module';
import { ListComponent } from './list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ReleasesRoutingModule,
        TuiButtonModule,
        TuiInputModule,
        TuiInputPasswordModule,
        TuiFieldErrorModule,
        TuiLinkModule,
        TuiDataListWrapperModule,
        TuiSelectModule,
        TuiDataListModule,
        TuiInputDateModule,
        TuiPaginationModule,
        TuiFilesModule,
        TuiInputFilesModule,
        TuiProgressModule,
        TuiTextAreaModule,
        TuiCheckboxLabeledModule
    ],
    declarations: [
        ListComponent,
        AddComponent,
        EditComponent
    ]
})
export class ReleasesModule { }