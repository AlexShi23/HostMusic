import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiIslandModule, TuiAvatarModule,
    TuiFilesModule, TuiInputFilesModule, TuiBadgedContentModule, TuiBadgeModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiErrorModule, TuiLinkModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { LayoutComponent } from './layout.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProfileRoutingModule,
        TuiInputModule,
        TuiInputPasswordModule,
        TuiButtonModule,
        TuiLinkModule,
        TuiErrorModule,
        TuiFieldErrorPipeModule,
        TuiIslandModule,
        TuiAvatarModule,
        TuiFilesModule,
        TuiInputFilesModule,
        TuiBadgeModule,
        TuiBadgedContentModule,
        TuiSvgModule,
        TranslateModule.forChild(),
        TuiLoaderModule
    ],
    declarations: [
        LayoutComponent,
        ViewComponent,
        EditComponent,
        ChangePasswordComponent
    ]
})
export class ProfileModule { }
