import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { NgxFlipCardModule } from 'ngx-flip-card';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxFlipCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
