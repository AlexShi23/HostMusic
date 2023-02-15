import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { FileType, Release, Role, Status, Track } from "@app/models";
import { AccountService, FilesService, ReleaseService } from "@app/services";
import { TuiNotification, TuiAlertService } from "@taiga-ui/core";
import { formatDate, getBadge, getFeatText, getSubtitleText } from "@app/common/functions/release.utils";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";

@Component({ templateUrl: './view.component.html',
            styleUrls: ['view.component.less'] })
export class ViewComponent implements OnInit {
    placeholder = "data:image/jpg;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    id: string;
    role: Role;
    release: Release;
    currentTime: number[];
    paused: boolean[];
    textDialogOpen = false;
    moderationDialogOpen = false;
    moderationForm = new FormGroup({
        moderationComment: new FormControl(``, Validators.required),
    });
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private releaseService: ReleaseService,
        private filesService: FilesService,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService,
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
                this.filesService.getFileUrl(release.id, FileType.Cover, false).subscribe(
                    (imageUrl: SafeUrl) => {
                        release.cover = imageUrl;
                    }
                )
                this.currentTime = new Array<number>(release.numberOfTracks).fill(0);
                this.paused = new Array<boolean>(release.numberOfTracks).fill(true);
                this.release.tracks.forEach(
                    (track: Track) => {
                        this.filesService.getFileUrl(track.id, FileType.Track, false).subscribe(
                            (trackUrl: SafeUrl) => {
                                track.file = trackUrl;
                            }
                        )
                    }
                );
            });
    }

    getBadge = getBadge;
    formatDate = formatDate;
    getFeatText = getFeatText;
    getSubtitleText = getSubtitleText;

    getIcon(index: number): string {
        return this.paused[index] ? 'tuiIconPlayLarge' : 'tuiIconPauseLarge';
    }

    toggleState(index: number): void {
        this.paused[index] = !this.paused[index];
    }

    isModerationCase(): boolean {
        return this.release.status === Status.Moderation && this.role === Role.Moderator;
    }

    isCorrectingCase(): boolean {
        return this.release.status === Status.Correcting;
    }

    showTextDialog(): void {
        this.textDialogOpen = true;
    }

    showModerationDialog(): void {
        this.moderationDialogOpen = true;
    }

    approveRelease(): void {
        this.releaseService.moderate(this.id, { moderationPassed: true, moderationComment: null })
            .pipe(first())
            .subscribe({
                next: (id: string) => {
                    this.alertService
                    .open('Релиз прошёл модерацию', {
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

    declineRelease(): void {
        this.releaseService.moderate(this.id,
            { moderationPassed: false, moderationComment: this.moderationForm.controls.moderationComment.value })
            .pipe(first())
            .subscribe({
                next: (id: string) => {
                    this.alertService
                    .open('Вы успешно отклонили релиз', {
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
}
