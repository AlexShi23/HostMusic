import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, FilesService } from '@app/services';
import { MustMatch } from '@app/helpers';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Subject } from 'rxjs';
import { TuiFileLike } from '@taiga-ui/kit';
import { SafeUrl } from '@angular/platform-browser';
import { FileType } from '@app/models';

@Component({ templateUrl: 'edit.component.html' })
export class EditComponent implements OnInit {
    account = this.accountService.accountValue;
    form: FormGroup;
    loading = false;
    submitted = false;
    deleting = false;
    avatar: SafeUrl;
    needAvatarInput = true;
    rejectedFiles$ = new Subject<TuiFileLike | null>();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private filesService: FilesService,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: [this.account.firstName, Validators.required],
            lastName: [this.account.lastName, Validators.required],
            email: [this.account.email, [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: [''],
            avatar: [null]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });

        this.filesService.getFileUrl(this.account.id, FileType.Avatar, false).subscribe(
            (imageUrl: SafeUrl) => {
                this.avatar = imageUrl;
                this.needAvatarInput = false;
            }
        )
    }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.form.controls.avatar.value) {
            this.filesService.uploadFile(this.account.id, this.form.controls.avatar.value, FileType.Avatar).subscribe(
                () => {
                    this.updateAccount();
                }
            );
        } else {
            this.updateAccount();
        }
    }

    updateAccount() {
        delete this.form.controls.avatar;
        this.accountService.update(this.account.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => { this.alertService
                    .open('Обновление данных прошло успешно', {
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

    onDelete() {
        if (confirm('Вы действительно хотите удалить аккаунт?')) {
            this.deleting = true;
            this.accountService.delete(this.account.id)
                .pipe(first())
                .subscribe(() => {
                    this.alertService
                    .open('Аккаунт удалён', {
                        status: TuiNotification.Success
                    }).subscribe()
                });
        }
    }

    onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
        this.rejectedFiles$.next(file as TuiFileLike);
    }

    clearRejected(): void {
        this.rejectedFiles$.next(null);
    }

    removeFile(): void {
        this.form.controls.avatar.setValue(null);
    }

    setNeedAvatarInput(): void {
        this.needAvatarInput = true;
    }
}