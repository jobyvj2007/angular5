import {LOCALE_ID, NgModule} from '@angular/core';

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatDialogModule, MatProgressSpinnerModule} from '@angular/material';
import {CommonModule} from '@angular/common';

import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';

import {FeaturesModule} from './features/features.module';
import {LoaderService} from './shared/services/loader/loader.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpInterceptorService} from './shared/services/http-interceptor/http-interceptor.service';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    FeaturesModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    LoaderService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
