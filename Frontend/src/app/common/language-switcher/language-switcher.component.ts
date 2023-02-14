import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {TuiStringHandler} from '@taiga-ui/cdk';
import {TUI_ICONS_PATH, tuiCapitalizeFirstLetter} from '@taiga-ui/core';
import {TuiCountryIsoCode, TuiLanguageName, TuiLanguageSwitcher} from '@taiga-ui/i18n';
 
@Component({
    selector: 'tui-language-switcher',
    templateUrl: './language-switcher.component.html',
    styleUrls: ['./language-switcher.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiLanguageSwitcherComponent {
    private readonly path = this.iconsPath('tuiIcon').replace('tuiIcon.svg#tuiIcon', '');
 
    readonly language: FormControl;
 
    readonly flags: Map<TuiLanguageName, TuiCountryIsoCode> = new Map([
        ['russian', TuiCountryIsoCode.RU],
        ['english', TuiCountryIsoCode.GB]
    ]);
 
    readonly names: TuiLanguageName[] = Array.from(this.flags.keys());
 
    constructor(
        @Inject(TuiLanguageSwitcher)
        readonly switcher: TuiLanguageSwitcher,
        @Inject(TUI_ICONS_PATH)
        private readonly iconsPath: TuiStringHandler<string>,
        public translate: TranslateService
    ) {
        translate.addLangs(['en', 'ru']);
        let localStorageLanguage = localStorage.getItem('locale');
        if (localStorageLanguage) {
            translate.setDefaultLang(localStorageLanguage);
            translate.use(localStorageLanguage);

            if (localStorageLanguage == 'en') {
                this.language = new FormControl(tuiCapitalizeFirstLetter('english'));
            } else {
                this.language = new FormControl(tuiCapitalizeFirstLetter('russian'));
            }
        } else {
            translate.setDefaultLang('ru');
            this.language = new FormControl(tuiCapitalizeFirstLetter('russian'));
            translate.use('ru');
            localStorage.setItem('locale', 'ru');
        }
    }
 
    getFlagPath(code?: TuiCountryIsoCode): string | null {
        return code ? `${this.path}${code}.png` : null;
    }

    switchLanguage(name: string) {
        this.switcher.setLanguage(name);
        this.translate.use(name.slice(0, 2));
        localStorage.setItem('locale', name.slice(0, 2));
    }
}