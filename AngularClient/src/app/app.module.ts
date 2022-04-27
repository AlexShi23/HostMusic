import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TuiRootModule, TuiDialogModule, TuiNotificationsModule, TuiButtonModule, TuiThemeNightModule, TuiModeModule, TuiSvgModule, TuiHostedDropdownModule, TuiDataListModule, TUI_SANITIZER } from "@taiga-ui/core";
import { TuiTabsModule, TuiAvatarModule, TuiToggleModule } from '@taiga-ui/kit';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AccountService } from './_services';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { of } from "rxjs";

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        TuiRootModule,
        BrowserAnimationsModule,
        TuiDialogModule,
        TuiNotificationsModule,
        TuiTabsModule,
        TuiButtonModule,
        TuiThemeNightModule,
        TuiModeModule,
        TuiSvgModule,
        TuiAvatarModule,
        TuiToggleModule,
        TuiHostedDropdownModule,
        TuiDataListModule
    ],
    declarations: [
        AppComponent,
        HomeComponent],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: TUI_LANGUAGE, useValue: of(TUI_RUSSIAN_LANGUAGE) },
        { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }