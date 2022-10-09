import { Component, Inject, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { Release, Role, Status } from "@app/_models";
import { AccountService, ReleaseService } from "@app/_services";
import { TuiDialogService, TuiNotification, TuiNotificationsService } from "@taiga-ui/core";
import { environment } from "@environments/environment";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({ templateUrl: './view.component.html',
            styleUrls: ['view.component.less'] })
export class ViewComponent implements OnInit {
    id: string;
    role: Role;
    release: Release;
    currentTime: number[];
    paused: boolean[];
    dialogOpen = false;
    moderationForm = new FormGroup({
        moderationComment: new FormControl(``, Validators.required),
    });
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private releaseService: ReleaseService,
        @Inject(TuiDialogService)
        private readonly dialogService: TuiDialogService,
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService
    ) {
        this.accountService.account.subscribe(x => this.role = x.role);
        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        };
    }

    ngOnInit(): void {
        this.loading = true;
        this.id = this.route.snapshot.params['id'];
        this.releaseService.getById(this.id)
            .pipe(first())
            .subscribe(release => {
                this.release = release;
                this.loading = false;
                this.currentTime = new Array<number>(release.numberOfTracks).fill(0);
                this.paused = new Array<boolean>(release.numberOfTracks).fill(true);
            });
    }

    getFilePath(filename: string) {
        return `${environment.releasesUrl}/Resources/${filename}`;
    }

    getIcon(index: number): string {
        return this.paused[index] ? 'tuiIconPlayLarge' : 'tuiIconPauseLarge';
    }
 
    toggleState(index: number): void {
        this.paused[index] = !this.paused[index];
    }

    formatDate(date: Date) {
        return date.toString().split('T')[0];
    }

    getFeatText(featuring: string) {
        return featuring.length > 0 ? `(feat. ${featuring})` : null;
    }

    getSubtitleText(subtitle: string) {
        return subtitle.length > 0 ? `(${subtitle})` : null;
    }

    getBadge(status: Status): string {
        switch(status) {
            case Status.Draft:
                return 'default';
            case Status.Moderation:
                return 'primary';
            case Status.Correcting:
                return 'error';
            case Status.Distributed:
                return 'info';
            case Status.Published:
                return 'success';
        }
    }

    isModerationCase(): boolean {
        return this.release.status === Status.Moderation && this.role === Role.Moderator;
    }

    isCorrectingCase(): boolean {
        return this.release.status === Status.Correcting;
    }

    showModerationDialog(): void {
        this.dialogOpen = true;
    }

    approveRelease(): void {
        this.releaseService.moderate(this.id, { moderationPassed: true, moderationComment: null })
            .pipe(first())
            .subscribe({
                next: (id: string) => {
                    this.notificationsService
                    .show('Релиз прошёл модерацию', {
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

    declineRelease(): void {
        this.releaseService.moderate(this.id,
            { moderationPassed: false, moderationComment: this.moderationForm.controls.moderationComment.value })
            .pipe(first())
            .subscribe({
                next: (id: string) => {
                    this.notificationsService
                    .show('Вы успешно отклонили релиз', {
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
}