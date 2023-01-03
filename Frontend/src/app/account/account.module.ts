import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiInputPasswordModule, TuiIslandModule, TuiCheckboxLabeledModule } from '@taiga-ui/kit'
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';

import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        TuiInputModule,
        TuiInputPasswordModule,
        TuiButtonModule,
        TuiIslandModule,
        TuiCheckboxLabeledModule,
        TuiLinkModule
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ]
})
export class AccountModule { }