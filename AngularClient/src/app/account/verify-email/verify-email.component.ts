import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';

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
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService
    ) { }

    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];

        // remove token from url to prevent http referer leakage
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

        this.accountService.verifyEmail(token)
            .pipe(first())
            .subscribe({
                next: () => { this.notificationsService
                    .show('Верификация прошла успешно, вы можете войти', {
                        status: TuiNotification.Success
                    }).subscribe()
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => { this.notificationsService
                    .show(error, {
                        status: TuiNotification.Error
                    }).subscribe();
                    this.emailStatus = EmailStatus.Failed;
                }
            });
    }
}