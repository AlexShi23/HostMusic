import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { FileType } from '@app/models';

import { AccountService, FilesService } from '@app/services';

@Component({ templateUrl: 'view.component.html', styleUrls: ['view.component.less'] })
export class ViewComponent implements OnInit {
    account = this.accountService.accountValue;
    avatar: SafeUrl = null;

    constructor(
        private accountService: AccountService,
        private filesService: FilesService
    ) { }

    ngOnInit(): void {
        this.filesService.getFileUrl(this.account.id, FileType.Avatar, false).subscribe(
            (imageUrl: SafeUrl) => {
                this.avatar = imageUrl;
            }
        )
    }
}