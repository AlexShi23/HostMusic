import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { Release, Status } from "@app/_models";
import { ReleaseService } from "@app/_services";
import { TuiNotificationsService } from "@taiga-ui/core";
import { environment } from "@environments/environment";

@Component({ templateUrl: './view.component.html',
            styleUrls: ['view.component.less'] })
export class ViewComponent implements OnInit {
    id: string;
    release: Release;
    currentTime: number[];
    paused: boolean[];
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private releaseService: ReleaseService,
        @Inject(TuiNotificationsService)
        private readonly notificationsService: TuiNotificationsService
    ) {}

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
}