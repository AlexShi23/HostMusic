import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiInputPasswordModule, TuiFieldErrorModule, TuiDataListWrapperModule, TuiSelectModule, TuiPaginationModule,
    TuiInputDateModule, TuiFilesModule, TuiInputFilesModule, TuiProgressModule, TuiTextAreaModule, TuiCheckboxLabeledModule, TuiIslandModule,
    TuiSliderModule, TuiBadgeModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiDataListModule, TuiTooltipModule, TuiHintModule } from '@taiga-ui/core';
import {TuiMediaModule} from '@taiga-ui/cdk';

import { ReleasesRoutingModule } from './releases-routing.module';
import { FieldSetItemComponent } from '../../common/components/field-set-item/field-set-item.component'
import { ListComponent } from './list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';

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
        TuiCheckboxLabeledModule,
        TuiIslandModule,
        TuiMediaModule,
        TuiSliderModule,
        TuiTooltipModule,
        TuiHintModule,
        TuiBadgeModule
    ],
    declarations: [
        FieldSetItemComponent,
        ListComponent,
        AddComponent,
        EditComponent,
        ViewComponent
    ]
})
export class ReleasesModule { }