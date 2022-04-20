import { Component } from '@angular/core';

import { AccountService } from '../_services';
import { Account, Role } from '../_models';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

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
