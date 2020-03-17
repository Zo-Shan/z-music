import { NgModule } from '@angular/core';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [WyPlayerComponent],
  imports: [
    CommonModule,
    FormsModule,
    WySliderModule
  ],
  exports: [WyPlayerComponent]
})
export class WyPlayerModule { }
