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
 
    readonly language = new FormControl(tuiCapitalizeFirstLetter('russian'));
 
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
        translate.setDefaultLang('ru');
    }
 
    getFlagPath(code?: TuiCountryIsoCode): string | null {
        return code ? `${this.path}${code}.png` : null;
    }

    switchLanguage(name: string) {
        this.switcher.setLanguage(name);
        this.translate.use(name.slice(0, 2));
    }
}