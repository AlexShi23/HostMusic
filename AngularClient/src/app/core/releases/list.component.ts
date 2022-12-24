import { Component, OnInit } from "@angular/core";
import { FileType, Release, Role } from "@app/_models";
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
                    this.releases.forEach(
                        (release: Release) => {
                            this.filesService.getFileUrl(release.id, FileType.Cover, true).subscribe(
                                (imageUrl: SafeUrl) => {
                                    release.cover = imageUrl;
                                }
                            )
                        }
                    );
                }
            }
        )
    }

    getBadge = getBadge;
    formatDate = formatDate;
    getFeatText = getFeatText;
    getSubtitleText = getSubtitleText;
 
    goToPage(index: number): void {
        this.index = index;
        console.info('New page:', index);
    }

    getFilePath(filename: string) {
        return `${environment.releasesUrl}/Resources/${filename}`;
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