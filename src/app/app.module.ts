import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {TranslateModule,TranslateLoader} from '@ngx-translate/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { CategoriesState } from './state/categories/categories.state';
import { ProductsState } from './state/products/products.state';
import { AuthState } from './state/auth/auth.state';
import { UsersState } from './state/users/users.state';
import { StripeState } from './state/stripe/stripe.state';
import { OrdersState } from './state/orders/orders.state';

export function HttpLoaderFactory(http:HttpClient){
  return new TranslateHttpLoader(http,'./assets/i18n/','.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    SharedModule,
    NgxsModule.forRoot([
      CategoriesState,
      ProductsState,
      AuthState,
      UsersState,
      StripeState,
      OrdersState
    ]),
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory:HttpLoaderFactory,
        deps:[HttpClient]
      }
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    NavParams
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
