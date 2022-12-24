import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Account, Role } from '@app/models';
import { AccountService } from '@app/services';
import { TuiHostedDropdownComponent } from '@taiga-ui/core';

@Component({ templateUrl: 'layout.component.html',
    styleUrls: ['layout.component.less'] })
export class LayoutComponent implements OnInit {
    @ViewChild(TuiHostedDropdownComponent)
    component?: TuiHostedDropdownComponent;
 
    Role = Role;
    account: Account;
    menuClosed: boolean;
    nightMode: boolean;
    themeForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        private accountService: AccountService,
        private cookieService: CookieService) {
        this.accountService.account.subscribe(x => this.account = x);
        this.menuClosed = true;
        this.nightMode = cookieService.get('theme') != null ? (cookieService.get('theme') == "true") : false;
    }
    ngOnInit(): void {
        this.themeForm = this.formBuilder.group({
            theme: [this.nightMode]
        });

        this.themeForm.controls['theme'].valueChanges.subscribe(value => {
            this.nightMode = value;
            this.cookieService.set('theme', value);
        });
    }

    logout() {
        this.accountService.logout();
    }

    changeMenuClosed(): void {
        this.menuClosed = !this.menuClosed;
    }
}