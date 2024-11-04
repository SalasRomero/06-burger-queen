import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductExtraOption } from 'src/app/models/product-extra-option';
import { ToastService } from 'src/app/services/toast.service';
import { UserOrderService } from 'src/app/services/user-order.service';
import { GetProductById } from 'src/app/state/products/products.actions';
import { ProductsState } from 'src/app/state/products/products.state';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage{

  public product: Product = null;
  public total:number = 0;

  private subscription:Subscription;

  constructor(
    private navCtrl:NavController,
    private navParams:NavParams,
    private store:Store,
    private userOrderService:UserOrderService,
    private toastService:ToastService,
    private translate:TranslateService
  ) { 

  }

  ionViewWillEnter() {

    this.subscription = new Subscription();

    console.log(this.navParams.data['product']);
    this.product = this.navParams.data['product'];

    if(this.product && this.product.extras){
      this.total = this.product.price;
    }

    if(!this.product){
      this.navCtrl.navigateForward('categories');
    }

  }


  public changeMultipleOption(event,options:ProductExtraOption[]){

    options.forEach( op => op.activate = event.detail.value == op.name);
    
    this.calculateTotal();
    
    
  }

  calculateTotal(){

    this.total = this.userOrderService.priceProduct(this.product);
    // let total = this.product.price;

    // this.product.extras.forEach(extra =>{
    //   extra.blocks.forEach(block =>{
    //     if(block.options.length == 1 && block.options[0].activate){
    //       total+=  block.options[0].price;
    //     }else if(block.options.length > 1){
    //       const option = block.options.find(op => op.activate);
    //       total+=  option.price;

    //     }
    //   });

    //   this.total = +total.toFixed(2);


    // });
  }

  getProduct(event){
    const sub = this.store.dispatch(new GetProductById({id:this.product._id}))
    .subscribe({
      next:()=>{
        this.product = this.store.selectSnapshot(ProductsState.product);
        this.calculateTotal(); 
      },
      complete:()=>{
        event.target.complete();
      }
    });

    this.subscription.add(sub);
  }

  addProductOrder(){
    this.userOrderService.addProduct(this.product);

    console.log(this.userOrderService.getProducts());

    this.toastService.showToast(
      this.translate.instant('label.product.add.success')
    );

    this.navCtrl.navigateRoot('/');
  }


  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

}
