import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiInputPasswordModule, TuiDataListWrapperModule, TuiSelectModule, TuiPaginationModule,
    TuiInputDateModule, TuiFilesModule, TuiInputFilesModule, TuiProgressModule, TuiTextAreaModule, TuiCheckboxLabeledModule, TuiIslandModule,
    TuiSliderModule, TuiBadgeModule, TuiBadgedContentModule, TuiFieldErrorPipeModule, TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiDataListModule, TuiTooltipModule, TuiHintModule, TuiDialogModule, TuiLoaderModule,
    TuiNotificationModule, TuiSvgModule, TuiErrorModule } from '@taiga-ui/core';
import {TuiMediaModule} from '@taiga-ui/cdk';

import { ReleasesRoutingModule } from './releases-routing.module';
import { FieldSetItemComponent } from '../../common/components/field-set-item/field-set-item.component'
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { TrackInputComponent } from './add-edit/track-input/track-input.component';
import { ViewComponent } from './view/view.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from '@app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ReleasesRoutingModule,
        TuiButtonModule,
        TuiInputModule,
        TuiInputPasswordModule,
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
        TuiBadgeModule,
        TuiDialogModule,
        TuiLoaderModule,
        TuiNotificationModule,
        TuiBadgeModule,
        TuiBadgedContentModule,
        TuiSvgModule,
        TuiErrorModule,
        TuiFieldErrorPipeModule,
        TuiBreadcrumbsModule,
        TranslateModule.forChild(),
        TuiHintModule
    ],
    declarations: [
        TrackInputComponent,
        FieldSetItemComponent,
        ListComponent,
        AddEditComponent,
        ViewComponent
    ]
})
export class ReleasesModule { }
