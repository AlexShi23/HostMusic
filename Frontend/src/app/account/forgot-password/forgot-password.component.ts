import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { AccountService } from '@app/services';
import { TuiNotification, TuiAlertService } from '@taiga-ui/core';

@Component({ templateUrl: 'forgot-password.component.html' })
export class ForgotPasswordComponent {
    loading = false;
    submitted = false;

    constructor(
        private accountService: AccountService,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService,
    ) { }

    readonly form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    });

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.forgotPassword(this.f.email.value)
            .pipe(first())
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => this.alertService
                    .open('Инструкция по восстановлению пароля отправлена на ваш email', {
                        status: TuiNotification.Success
                    }).subscribe(),
                error: error => {this.alertService
                    .open(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                    this.loading = false;
                }
            });
    }
}