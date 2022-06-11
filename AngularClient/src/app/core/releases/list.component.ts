import { Component, OnInit } from "@angular/core";
import { Release, Status } from "@app/_models";
import { ReleaseService } from "@app/_services";
import { catchError, debounceTime, distinctUntilChanged, first, switchMap } from "rxjs/operators";
import { environment } from '@environments/environment';
import { FormControl, FormGroup } from "@angular/forms";
import { from, of } from "rxjs";

@Component({ templateUrl: 'list.component.html',
            styleUrls: ['list.component.less'] })
export class ListComponent implements OnInit {
    search = '';
    releases: Release[];
    length: number = 1;
    index = 1;
    readonly searchForm = new FormGroup({
        search: new FormControl(),
    });

    constructor(private releaseService: ReleaseService) {}

    ngOnInit() {
        this.searchForm.controls.search.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            switchMap(value => {
                if (value.length > 0) {
                    return from(this.releaseService.search(value)).pipe(
                        catchError(err => of([]))
                    )
                } else {
                    return from(this.releaseService.getAll());
                }
            })
            ).subscribe({
                next: (resp: Release[]) => {
                    this.releases = resp;
                    length = this.releases.length / 10;
            }
          })
        
        this.releaseService.getAll()
            .pipe(first())
            .subscribe(releases => {
                this.releases = releases;
                length = this.releases.length / 10;
            });
        
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
}