import { Component, OnInit } from "@angular/core";
import { Release, Status } from "@app/_models";
import { ReleaseService } from "@app/_services";
import { first } from "rxjs/operators";
import { TUI_DEFAULT_STRINGIFY } from "@taiga-ui/cdk";
import { TuiPoint } from "@taiga-ui/core";
import { environment } from "@environments/environment";

@Component({ templateUrl: 'dashboard.component.html',
             styleUrls: ['dashboard.component.less'] })
export class DashboardComponent implements OnInit {
    releases: Release[];
    loading: boolean;
    listenings = 0;
    listeners = 0;
    sales = 0;
    
    readonly axisXLabels = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut' ];
    values: readonly TuiPoint[] = [
        [50, 0],
        [100, 0],
        [150, 0],
        [200, 0],
        [250, 0],
        [300, 0],
        [350, 0],
    ];
 
    readonly stringify = TUI_DEFAULT_STRINGIFY;

    constructor(private releaseService: ReleaseService) {}

    ngOnInit() {
        this.loading = true;
        this.releaseService.getAll(1)
            .pipe(first())
            .subscribe(releasesPage => {
                this.releases = releasesPage.releases;
                this.loading = false;
                if (releasesPage.releases.length > 4) {
                    this.listenings = 1034;
                    this.listeners = 178;
                    this.sales = 123;
                    this.values = [
                        [50, 50],
                        [100, 75],
                        [150, 50],
                        [200, 150],
                        [250, 155],
                        [300, 190],
                        [350, 90],
                    ];
                }
            });
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