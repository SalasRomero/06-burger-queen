import { Component, OnInit } from '@angular/core';
import { EventType, Router, RoutesRecognized } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { MenuController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { KEY_TOKEN } from 'src/app/constants/constants';
import { ToastService } from 'src/app/services/toast.service';
import { UserOrderService } from 'src/app/services/user-order.service';

@Component({
  selector: 'shared-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent  implements OnInit {

  public showBack:boolean = false;
  public showInfoUser:boolean = false;
  public showCreateAccount:boolean = false;
  public showOrder:boolean = false;

  constructor(
    private router:Router,
    private navCtrl:NavController,
    public userOrderService:UserOrderService,
    private menuCtrl:MenuController,
    private toastService:ToastService,
    private translate:TranslateService
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter((event)=> event.type == EventType.RoutesRecognized)
    )
    .subscribe((event:RoutesRecognized)=>{
      this.showBack = event.state.root.firstChild.data['showBack'];
    });
  }

  goBack(){
    this.navCtrl.back();
  }

  newAccount(){
    this.showCreateAccount = true;
  }

  async logout(){
    await this.userOrderService.clear();
    await Preferences.remove({key:KEY_TOKEN});
    this.navCtrl.navigateForward('categories');
    this.menuCtrl.close('content');
    this.toastService.showToast(
      this.translate.instant('label.logout.success')
    );
  }

  showPanelInfoUser(){
    this.showInfoUser = true;
  }

  back(){
    this.showInfoUser = false;
    this.showCreateAccount = false;
    this.showOrder = false;
  }

  showLogin(){
    this.showCreateAccount = false;
  }

  goToPay(){
    this.back();
    this.menuCtrl.close('content');
    this.navCtrl.navigateForward('pay');

  }

  seeOrder(){
    this.showOrder = true;
  }

}
