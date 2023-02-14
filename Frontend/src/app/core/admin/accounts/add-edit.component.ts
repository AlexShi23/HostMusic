import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService} from '@app/services';
import { MustMatch } from '@app/helpers';
import { TuiNotification, TuiAlertService } from '@taiga-ui/core';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService,
    ) {}

    roles = [
        'User',
        'Admin',
        'Moderator'
    ];

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            nickname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
        });

        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createAccount();
        } else {
            this.updateAccount();
        }
    }

    private createAccount() {
        this.accountService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => { this.alertService
                    .open('Аккаунт успешно создан', {
                        status: TuiNotification.Success
                    }).subscribe()
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => { this.alertService
                    .open(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                }
            });
    }

    private updateAccount() {
        this.accountService.updateByAdmin(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => { this.alertService
                    .open('Изменения успешно внесены', {
                        status: TuiNotification.Success
                    }).subscribe()
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => { this.alertService
                    .open(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                }
            });
    }
}