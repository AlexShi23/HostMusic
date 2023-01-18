import { Component, OnInit } from "@angular/core";
import { FileType, Release } from "@app/models";
import { FilesService, ReleaseService } from "@app/services";
import { first } from "rxjs/operators";
import { TUI_DEFAULT_STRINGIFY } from "@taiga-ui/cdk";
import { TuiPoint } from "@taiga-ui/core";
import { SafeUrl } from "@angular/platform-browser";
import { getBadge, getFeatText, getSubtitleText } from "@app/common/functions/release.utils";

@Component({ templateUrl: 'dashboard.component.html',
             styleUrls: ['dashboard.component.less'] })
export class DashboardComponent implements OnInit {
    placeholder = "data:image/jpg;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
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

    constructor(private releaseService: ReleaseService,
        private filesService: FilesService) {}

    ngOnInit() {
        this.loading = true;
        this.releaseService.getAll(1)
            .pipe(first())
            .subscribe(releasesPage => {
                this.releases = releasesPage.releases;
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

    getBadge = getBadge;
    getFeatText = getFeatText;
    getSubtitleText = getSubtitleText;
}
