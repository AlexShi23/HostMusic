import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';

@Component({ templateUrl: 'forgot-password.component.html' })
export class ForgotPasswordComponent {
    loading = false;
    submitted = false;

    constructor(
        private accountService: AccountService,
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService
    ) { }

    readonly form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    });

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.forgotPassword(this.f.email.value)
            .pipe(first())
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => this.notificationsService
                    .show('Инструкция по восстановлению пароля отправлена на ваш email', {
                        status: TuiNotification.Success
                    }).subscribe(),
                error: error => {this.notificationsService
                    .show(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                    this.loading = false;
                }
            });
    }
}