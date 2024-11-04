import { Component, OnInit } from '@angular/core';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { CreatePaymentIntent } from 'src/app/models/create-payment-intent';
import { Payment } from 'src/app/models/payment';
import { ToastService } from 'src/app/services/toast.service';
import { UserOrderService } from 'src/app/services/user-order.service';
import { CreateOrder } from 'src/app/state/orders/orders.actions';
import { OrdersState } from 'src/app/state/orders/orders.state';
import { ClearPayment, CreatePaymentSheet } from 'src/app/state/stripe/stripe.actions';
import { StripeState } from 'src/app/state/stripe/stripe.state';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage {

  @Select(StripeState.payment)
  private payment$:Observable<Payment>;

  public showNewAccount: boolean =false;
  public step:number = 1;
  public optionAddress:string = "";
  public showNewAddress:boolean =false;
  public address:string = "";
  private subscription:Subscription;

  constructor(
    public userOrderService:UserOrderService,
    private navCtrl:NavController,
    private store:Store,
    private toastService:ToastService,
    private translateService:TranslateService
  ) { }

  ionViewWillEnter(){
    this.showNewAccount = false;
    this.step = 1;
    this.subscription = new Subscription();
    this.optionAddress = "adress-default";
    this.showNewAddress = false;
    this.address = "";
    this.changeOptionAddress();
    Stripe.initialize({
      publishableKey:environment.publishkey
    });
    this.detectChangesPayments();
  }

  newAccount(){
    this.showNewAccount = true;
  }

  showLogin(){
    this.showNewAccount = false;
  }

  nextStep(){
    this.step++;
  }

  previusStep(){
    this.step--;
  }

  backHome(){
    this.navCtrl.navigateForward('categories');
  }

  changeOptionAddress(){
    switch(this.optionAddress){
      case 'address-default':
        this.showNewAddress = false;
        this.address = this.userOrderService.getUser().address;
      break;
      
      case 'choose-address':
        this.showNewAddress = true;
        this.address = "";
      break;

    }
  }

  payWithStripe(){

    const total = this.userOrderService.totalOrder() * 100;

    const paymentIntent:CreatePaymentIntent={
      secretKey: environment.secretkey,
      amount:+total.toFixed(0),
      currency:'USD',
      customer_id:'cus_R6y3x1sjZlv2nc'
    };

    this.store.dispatch(new CreatePaymentSheet({paymentIntent}));
  }

  createOrder(){

    const order = this.userOrderService.getOrder();
    order.adress = this.address;

    this.store.dispatch( new CreateOrder({ order }))
    .subscribe({
      next:()=>{
        const success = this.store.selectSnapshot(OrdersState.success);
        if(success){
          this.toastService.showToast(
            this.translateService.instant('label.pay.success',{'address':this.address})
          );
          this.userOrderService.resetOrder();
          this.navCtrl.navigateForward('categories');
        }else{
          this.toastService.showToast(
            this.translateService.instant('label.pay.fail')
          );
        }
      },
      error:(err)=>{
        console.error(err);
        this.toastService.showToast(
          this.translateService.instant('label.pay.fail')
        );

      }
    });
  }

  detectChangesPayments(){
    const sub = this.payment$.subscribe({
      next:()=>{
        const payment = this.store.selectSnapshot(StripeState.payment);
        if(payment){
          Stripe.createPaymentSheet(payment);
          Stripe.presentPaymentSheet().then(result=>{
            console.log(result);
            if(result.paymentResult == PaymentSheetEventsEnum.Completed){
              this.createOrder();
            }else if(result.paymentResult == PaymentSheetEventsEnum.Failed){
              this.toastService.showToast(
                this.translateService.instant('label.pay.fail')
              );
            }
          });
        }
      }
    });
    this.subscription.add(sub);
  }

  ionViewWillLeave(){
    this.store.dispatch(new ClearPayment());
    this.subscription.unsubscribe();
  }

}
