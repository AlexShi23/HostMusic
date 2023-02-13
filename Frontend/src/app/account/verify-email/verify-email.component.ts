import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/services';
import { TuiNotification, TuiAlertService } from '@taiga-ui/core';

enum EmailStatus {
    Verifying,
    Failed
}

@Component({ templateUrl: 'verify-email.component.html' })
export class VerifyEmailComponent implements OnInit {
    EmailStatus = EmailStatus;
    emailStatus = EmailStatus.Verifying;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService,
    ) { }

    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];
        const id = this.route.snapshot.queryParams['id'];

        // remove token from url to prevent http referer leakage
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

        this.accountService.verifyEmail(token, id)
            .pipe(first())
            .subscribe({
                next: () => { this.alertService
                    .open('Верификация прошла успешно, вы можете войти', {
                        status: TuiNotification.Success
                    }).subscribe()
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => { this.alertService
                    .open(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                    this.emailStatus = EmailStatus.Failed;
                }
            });
    }
}