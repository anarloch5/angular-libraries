import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFlipCardComponent } from './ngx-flip-card/ngx-flip-card.component';
import { NgxTiltCardComponent } from './ngx-tilt-card/ngx-tilt-card.component';



@NgModule({
  declarations: [
    NgxFlipCardComponent,
    NgxTiltCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgxFlipCardComponent,
    NgxTiltCardComponent
  ]
})
export class NgxFlipCardModule { }
