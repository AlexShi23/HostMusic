import { Component, OnInit } from "@angular/core";
import { Release } from "@app/_models";
import { ReleaseService } from "@app/_services";
import { first } from "rxjs/operators";

@Component({ templateUrl: 'list.component.html',
            styleUrls: ['list.component.less'] })
export class ListComponent implements OnInit {
    search = '';
    releases: Release[];
    length = 64;
    index = 10;

    constructor(private releaseService: ReleaseService) {}

    ngOnInit() {
        this.releaseService.getAll()
            .pipe(first())
            .subscribe(releases => this.releases = releases);
    }
 
    goToPage(index: number): void {
        this.index = index;
        console.info('New page:', index);
    }
}