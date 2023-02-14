import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '@app/helpers/must-match.validator';
import { AccountService } from '@app/services';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { first } from 'rxjs';

@Component({ templateUrl: 'change-password.component.html' })
export class ChangePasswordComponent implements OnInit {
    account = this.accountService.accountValue;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private accountService: AccountService,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            password: ['', [Validators.minLength(6)]],
            confirmPassword: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    onSubmit() {
        if (this.form.invalid) {
            return;
        }

        this.changePassword();
    }

    changePassword() {
        delete this.form.controls.avatar;
        this.accountService.changePassword(this.form.controls.password.value)
            .pipe(first())
            .subscribe({
                next: () => { this.alertService
                    .open('Пароль изменён успешно', {
                        status: TuiNotification.Success
                    }).subscribe()
                    this.router.navigate(['../']);
                },
                error: error => { this.alertService
                    .open(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                }
            });
    }
}