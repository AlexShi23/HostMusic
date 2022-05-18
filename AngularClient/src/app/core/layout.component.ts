import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Account, Role } from '@app/_models';
import { AccountService } from '@app/_services';
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
        private accountService: AccountService) {
        this.accountService.account.subscribe(x => this.account = x);
        this.menuClosed = true;
        this.nightMode = false;
    }
    ngOnInit(): void {
        this.themeForm = this.formBuilder.group({
            theme: [false]
        });

        this.themeForm.controls['theme'].valueChanges.subscribe(value => {
            this.nightMode = value;
        });
    }

    logout() {
        this.accountService.logout();
    }

    changeMenuClosed(): void {
        this.menuClosed = !this.menuClosed;
    }
}