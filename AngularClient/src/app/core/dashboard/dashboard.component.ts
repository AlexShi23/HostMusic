import { Component } from "@angular/core";
import { TUI_DEFAULT_STRINGIFY } from "@taiga-ui/cdk";
import { TuiPoint } from "@taiga-ui/core";

@Component({ templateUrl: 'dashboard.component.html',
             styleUrls: ['dashboard.component.less'] })
export class DashboardComponent {
    readonly axisXLabels = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut' ];
    readonly values: readonly TuiPoint[] = [
        [50, 50],
        [100, 75],
        [150, 50],
        [200, 150],
        [250, 155],
        [300, 190],
        [350, 90],
    ];
 
    readonly stringify = TUI_DEFAULT_STRINGIFY;
}