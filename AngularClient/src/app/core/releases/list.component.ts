import { Component, OnInit } from "@angular/core";
import { FileType, Release, ReleasesPage, Role } from "@app/_models";
import { formatDate, getBadge, getFeatText, getSubtitleText } from "@app/common/functions/release.utils";
import { AccountService, FilesService, ReleaseService } from "@app/_services";
import { catchError, debounceTime, distinctUntilChanged, first, switchMap } from "rxjs/operators";
import { environment } from '@environments/environment';
import { FormControl, FormGroup } from "@angular/forms";
import { from, of } from "rxjs";
import { SafeUrl } from "@angular/platform-browser";

@Component({ templateUrl: 'list.component.html',
            styleUrls: ['list.component.less'] })
export class ListComponent implements OnInit {
    placeholder = "data:image/jpg;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    role: Role;
    search = '';
    releases: Release[];
    pagesCount: number = 1;
    page = 1;
    loading: boolean;
    deletedReleaseId: string;
    deletedRelease: Release;
    open = false;
    readonly searchForm = new FormGroup({
        search: new FormControl(),
    });

    constructor(
        private releaseService: ReleaseService,
        private accountService: AccountService,
        private filesService: FilesService) {
            this.accountService.account.subscribe(x => this.role = x.role);
        }

    ngOnInit() {
        this.loading = true;
        this.searchForm.controls.search.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            switchMap(value => {
                if (value.length > 0) {
                    this.loading = true;
                    this.page = 1;
                    return from(this.releaseService.search(value, this.page)).pipe(
                        catchError(err => of([]))
                    )
                } else {
                    return this.role == Role.Moderator ?
                        from(this.releaseService.getAllOnModeration(this.page)) :
                        from(this.releaseService.getAll(this.page));
                }
            })
            ).subscribe({
                next: (resp: ReleasesPage) => {
                    this.releases = resp.releases;
                    this.pagesCount = resp.pagesCount;
                    this.loading = false;
                    this.getCovers();
            }
          })
    }

    getBadge = getBadge;
    formatDate = formatDate;
    getFeatText = getFeatText;
    getSubtitleText = getSubtitleText;

    goToPage(index: number): void {
        this.page = index + 1;
        if (this.searchForm.controls.search.value) {
            this.releaseService.search(this.searchForm.controls.search.value, this.page)
                .pipe(first())
                .subscribe((releasesPage: ReleasesPage) => {
                    this.releases = releasesPage.releases;
                    this.pagesCount = releasesPage.pagesCount;
                    this.loading = false;
                    this.getCovers();
                });
        } else {
            this.releaseService.getAll(this.page)
            .pipe(first())
            .subscribe(releasesPage => {
                this.releases = releasesPage.releases;
                this.pagesCount = releasesPage.pagesCount;
                this.loading = false;
                this.getCovers();
            });
        }
    }

    getCovers() {
        this.releases.forEach(
            (release: Release) => {
                this.filesService.getFileUrl(release.id, FileType.Cover, true).subscribe(
                (imageUrl: SafeUrl) => {
                    release.cover = imageUrl;
                })
            }
        );
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
        this.filesService.deleteFile(this.deletedReleaseId, FileType.Cover).subscribe();
        this.deletedRelease.tracks.forEach(track => {
            this.filesService.deleteFile(track.id, FileType.Track).subscribe();
        });
    }
}
