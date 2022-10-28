import { Component, OnInit } from "@angular/core";
import { Release, Role, Status } from "@app/_models";
import { AccountService, ReleaseService } from "@app/_services";
import { catchError, debounceTime, distinctUntilChanged, first, switchMap } from "rxjs/operators";
import { environment } from '@environments/environment';
import { FormControl, FormGroup } from "@angular/forms";
import { from, of } from "rxjs";

@Component({ templateUrl: 'list.component.html',
            styleUrls: ['list.component.less'] })
export class ListComponent implements OnInit {
    role: Role;
    search = '';
    releases: Release[];
    length: number = 1;
    index = 1;
    loading: boolean;
    deletedReleaseId: string;
    deletedRelease: Release;
    open = false;
    readonly searchForm = new FormGroup({
        search: new FormControl(),
    });

    constructor(
        private releaseService: ReleaseService,
        private accountService: AccountService) {
            this.accountService.account.subscribe(x => this.role = x.role);
        }

    ngOnInit() {
        this.searchForm.controls.search.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            switchMap(value => {
                if (value.length > 0) {
                    this.loading = true;
                    return from(this.releaseService.search(value)).pipe(
                        catchError(err => of([]))
                    )
                } else {
                    return this.role == Role.Moderator ? 
                        from(this.releaseService.getAllOnModeration()) :
                        from(this.releaseService.getAll());
                }
            })
            ).subscribe({
                next: (resp: Release[]) => {
                    this.releases = resp;
                    length = this.releases.length / 10;
                    this.loading = false;
            }
          })
        
        this.loading = true;
        if (this.role == Role.Moderator) {
            this.releaseService.getAllOnModeration()
            .pipe(first())
            .subscribe(releases => {
                this.releases = releases;
                length = this.releases.length / 10;
                this.loading = false;
            });
        } else {
            this.releaseService.getAll()
            .pipe(first())
            .subscribe(releases => {
                this.releases = releases;
                length = this.releases.length / 10;
                this.loading = false;
            });
        }
    }
 
    goToPage(index: number): void {
        this.index = index;
        console.info('New page:', index);
    }

    getFilePath(filename: string) {
        return `${environment.releasesUrl}/Resources/${filename}`;
    }

    getFeatText(featuring: string) {
        return featuring.length > 0 ? `(feat. ${featuring})` : null;
    }

    getSubtitleText(subtitle: string) {
        return subtitle.length > 0 ? `(${subtitle})` : null;
    }

    formatDate(date: Date) {
        return date.toString().split('T')[0];
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

    showDeleteDialog(id: string): void {
        this.open = true;
        this.deletedReleaseId = id;
        this.deletedRelease = this.releases.find(x => x.id == this.deletedReleaseId);
    }

    deleteRelease(): void {
        this.releaseService.delete(this.deletedReleaseId)
            .pipe(first())
            .subscribe(() => {
                this.releases = this.releases.filter(x => x.id !== this.deletedReleaseId)
            });
    }
}