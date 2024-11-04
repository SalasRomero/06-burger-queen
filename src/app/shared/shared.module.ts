import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ListProductsOrderComponent } from './list-product-order/list-product-order.component';
import { ExtrasSelectedPipe } from './extras-selected/extras-selected.pipe';



@NgModule({
  declarations: [
    ToolbarComponent,
    FooterComponent,
    LoginComponent,
    CreateAccountComponent,
    ListProductsOrderComponent,
    ExtrasSelectedPipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule
  ],
  exports:[
    ToolbarComponent,
    FooterComponent,
    LoginComponent,
    CreateAccountComponent,
    ListProductsOrderComponent
  ]
})
export class SharedModule { }
