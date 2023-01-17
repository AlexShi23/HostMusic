import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, FilesService } from '@app/services';
import { Account, FileType } from '@app/models';
import { SafeUrl } from '@angular/platform-browser';

@Component({ templateUrl: 'list.component.html', styleUrls: ['list.component.less'] })
export class ListComponent implements OnInit {
    accounts: any[];

    constructor(
        private accountService: AccountService,
        private filesService: FilesService
    ) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => { 
                this.accounts = accounts;
                this.getAvarars();
            });
    }

    deleteAccount(id: string) {
        const account = this.accounts.find(x => x.id === id);
        account.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.accounts = this.accounts.filter(x => x.id !== id) 
            });
    }

    getAvarars() {
        this.accounts.forEach(
            (account: Account) => {
                this.filesService.getFileUrl(account.id, FileType.Avatar, true).subscribe(
                (imageUrl: SafeUrl) => {
                    account.avatar = imageUrl;
                })
            }
        );
    }
}