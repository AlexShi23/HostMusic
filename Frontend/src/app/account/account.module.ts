import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiInputPasswordModule, TuiIslandModule, TuiCheckboxLabeledModule, TuiFieldErrorPipeModule } from '@taiga-ui/kit'
import { TuiButtonModule, TuiErrorModule, TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';

import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TuiLanguageSwitcherModule } from "../common/language-switcher/language-switcher.module";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { httpTranslateLoader } from '@app/app.module';

@NgModule({
    declarations: [
        LayoutComponent,
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        TuiInputModule,
        TuiInputPasswordModule,
        TuiButtonModule,
        TuiIslandModule,
        TuiCheckboxLabeledModule,
        TuiLinkModule,
        TuiErrorModule,
        TuiFieldErrorPipeModule,
        TuiSvgModule,
        TuiLanguageSwitcherModule,
        TranslateModule.forRoot({
            defaultLanguage: 'ru',
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        }),
    ]
})
export class AccountModule { }