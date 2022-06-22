import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
    account = this.accountService.accountValue;
    form: FormGroup;
    loading = false;
    submitted = false;
    deleting = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: [this.account.firstName, Validators.required],
            lastName: [this.account.lastName, Validators.required],
            email: [this.account.email, [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.update(this.account.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => { this.notificationsService
                    .show('Обновление данных прошло успешно', {
                        status: TuiNotification.Success
                    }).subscribe()
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => { this.notificationsService
                    .show(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                }
            });
    }

    onDelete() {
        if (confirm('Вы действительно хотите удалить аккаунт?')) {
            this.deleting = true;
            this.accountService.delete(this.account.id)
                .pipe(first())
                .subscribe(() => {
                    this.notificationsService
                    .show('Аккаунт удалён', {
                        status: TuiNotification.Success
                    }).subscribe()
                });
        }
    }
}