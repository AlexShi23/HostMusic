import { Component, OnInit } from "@angular/core";
import { Release } from "@app/_models";
import { ReleaseService } from "@app/_services";
import { first } from "rxjs/operators";
import { environment } from '@environments/environment';

@Component({ templateUrl: 'list.component.html',
            styleUrls: ['list.component.less'] })
export class ListComponent implements OnInit {
    search = '';
    releases: Release[];
    length: number;
    index = 1;

    constructor(private releaseService: ReleaseService) {}

    ngOnInit() {
        this.releaseService.getAll()
            .pipe(first())
            .subscribe(releases => this.releases = releases);
        length = this.releases.length / 10;
    }
 
    goToPage(index: number): void {
        this.index = index;
        console.info('New page:', index);
    }

    getFilePath(filename: string) {
        return `${environment.releasesUrl}/Resources/${filename}`;
    }

    formatDate(date: Date) {
        return date.toString().split('T')[0];
    }
}