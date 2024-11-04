import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { GetCategories } from 'src/app/state/categories/categories.actions';
import { CategoriesState } from 'src/app/state/categories/categories.state';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {

  @Select(CategoriesState.categories)
  private categories$:Observable<Category[]>;

  public categories:Category[] = [];

  private subscription:Subscription;

  constructor(
    private store:Store,
    private loadingCtrl:LoadingController,
    private translate:TranslateService,
    private navCtrl:NavController,
    private navParams:NavParams
  ) { }

  ionViewWillEnter() {
    this.subscription = new Subscription();
    this.loadData();
  }

  async loadData(){

    const loading = await this.loadingCtrl.create({
      message:this.translate.instant('label.loading')
    });

    await loading.present();

    this.store.dispatch(new GetCategories());
    const sub = this.categories$.subscribe({
      next:()=>{
        this.categories = this.store.selectSnapshot(CategoriesState.categories);
        loading.dismiss();
        console.log(this.categories);
      },
      error:err=>{
        loading.dismiss();
        console.error(err);
        
      },
      complete:()=>{
      }
    });
    this.subscription.add(sub);

  }

  public goToProducts(category:Category){
    this.navParams.data['idCategory'] = category._id;
    this.navCtrl.navigateForward('list-products');
  }

  refreshCategories(event){
    this.store.dispatch(new GetCategories());
    event.target.complete();
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

}
