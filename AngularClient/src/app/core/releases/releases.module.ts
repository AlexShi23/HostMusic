import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiInputPasswordModule, TuiFieldErrorModule, TuiDataListWrapperModule, TuiSelectModule, TuiPaginationModule, TuiInputDateModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiDataListModule } from '@taiga-ui/core';

import { ReleasesRoutingModule } from './releases-routing.module';
import { ListComponent } from './list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
    imports: [
        FormsModule,
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
        TuiPaginationModule
    ],
    declarations: [
        ListComponent,
        AddComponent,
        EditComponent
    ]
})
export class ReleasesModule { }