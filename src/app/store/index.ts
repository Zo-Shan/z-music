import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from './reducers/player.reduce';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(
      { player: playerReducer }, 
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true
        },
      }
    ),
    StoreDevtoolsModule.instrument({ maxAge: 20, logOnly: environment.production }),
  ]
})
export class AppStoreModule { }
