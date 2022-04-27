import { Component, ViewChild } from '@angular/core';
import { Account, Role } from '@app/_models';

import { AccountService } from '@app/_services';
import { TuiHostedDropdownComponent } from '@taiga-ui/core';

@Component({ templateUrl: 'home.component.html',
             styleUrls: ['home.component.less'] })
export class HomeComponent {
    @ViewChild(TuiHostedDropdownComponent)
    component?: TuiHostedDropdownComponent;
 
    Role = Role;
    account: Account;
    menuClosed: boolean;

    constructor(private accountService: AccountService) {
        this.accountService.account.subscribe(x => this.account = x);
        this.menuClosed = true;
    }

    logout() {
        this.accountService.logout();
    }

    changeMenuClosed(): void {
        this.menuClosed = !this.menuClosed;
    }
}