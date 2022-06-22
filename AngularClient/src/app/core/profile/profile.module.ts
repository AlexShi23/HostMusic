import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiInputPasswordModule, TuiFieldErrorModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.component';
import { UpdateComponent } from './update.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProfileRoutingModule,
        TuiInputModule,
        TuiInputPasswordModule,
        TuiFieldErrorModule,
        TuiButtonModule,
        TuiLinkModule
    ],
    declarations: [
        LayoutComponent,
        DetailsComponent,
        UpdateComponent
    ]
})
export class ProfileModule { }