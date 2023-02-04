import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { HttpService } from 'src/shared/services/API/Base/http.service';
import { Interceptors } from 'src/shared/interceptors/index.interceptors';
import { ToastrModule } from 'ngx-toastr';
import { IconsModule } from 'src/shared/components/icons/icons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// #fake-end#
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { MaterialModule } from 'src/shared/components/Material/MaterialModule';
import { SplashScreenModule } from './_core/partials/layout/splash-screen/splash-screen.module';
 
function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    IconsModule,
    HighlightModule,
     FormsModule,
    SplashScreenModule,
    ReactiveFormsModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    // #fake-end#
    AppRoutingModule,
    MaterialModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      easeTime: 300,
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      titleClass: 'toast-titleClass',
      messageClass: 'toast-messageClass',
      toastClass: 'ngx-toastr',
    }),
  ],
  providers: [
    Interceptors,
    HttpService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
