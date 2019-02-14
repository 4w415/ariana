import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyHttpClient } from './_interceptors/http.interceptor';
import { QuestionnairsService } from './_services/questionnairs.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MyHttpClient,
    multi: true
  }, {
    provide: QuestionnairsService, useClass: QuestionnairsService
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
