import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Account, FileType, Role } from '@app/models';
import { AccountService, FilesService } from '@app/services';
import { TuiHostedDropdownComponent } from '@taiga-ui/core';
import {TuiCountryIsoCode, TuiLanguageName, TuiLanguageSwitcher} from '@taiga-ui/i18n';
import { SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

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

    public readonly language: FormControl;
 
    readonly flags: Map<TuiLanguageName, TuiCountryIsoCode> = new Map([
        ['russian', TuiCountryIsoCode.RU],
        ['english', TuiCountryIsoCode.GB]
    ]);
 
    readonly names: TuiLanguageName[] = Array.from(this.flags.keys());

    constructor(private formBuilder: FormBuilder,
        @Inject(TuiLanguageSwitcher)
        readonly switcher: TuiLanguageSwitcher,
        private accountService: AccountService,
        private cookieService: CookieService,
        private filesService: FilesService,
        public translate: TranslateService
    ) {
        this.accountService.account.subscribe(x => this.account = x);
        this.menuClosed = true;
        this.nightMode = cookieService.get('theme') != null ? (cookieService.get('theme') == "true") : false;

        translate.addLangs(['en', 'ru']);
        let localStorageLanguage = localStorage.getItem('locale');
        if (localStorageLanguage) {
            translate.setDefaultLang(localStorageLanguage);
            translate.use(localStorageLanguage);

            if (localStorageLanguage == 'en') {
                this.language = new FormControl('english');
            } else {
                this.language = new FormControl('russian');
            }
        } else {
            translate.setDefaultLang('ru');
            this.language = new FormControl('russian');
            translate.use('ru');
            localStorage.setItem('locale', 'ru');
        }
    }

    ngOnInit(): void {
        this.themeForm = this.formBuilder.group({
            theme: [this.nightMode]
        });

        this.themeForm.controls['theme'].valueChanges.subscribe(value => {
            this.nightMode = value;
            this.cookieService.set('theme', value);
        });

        this.filesService.getFileUrl(this.account.id, FileType.Avatar, true).subscribe(
            (imageUrl: SafeUrl) => {
                this.account.avatar = imageUrl;
            }
        )
    }

    logout() {
        this.accountService.logout();
    }

    changeMenuClosed(): void {
        this.menuClosed = !this.menuClosed;
    }

    languageMatch(name: string) {
        return name == this.language.value;
    }

    switchLanguage(name: string) {
        this.switcher.setLanguage(name);
        this.translate.use(name.slice(0, 2));
        localStorage.setItem('locale', name.slice(0, 2));
        this.language.setValue(name);
    }
}