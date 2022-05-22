import { Component, OnInit } from "@angular/core";

@Component({ templateUrl: 'list.component.html',
            styleUrls: ['list.component.less'] })
export class ListComponent implements OnInit {
    search = '';
    releases: any[];
    length = 64;
    index = 10;

    ngOnInit(): void {
        this.releases = [];
    }
 
    goToPage(index: number): void {
        this.index = index;
        console.info('New page:', index);
    }
}