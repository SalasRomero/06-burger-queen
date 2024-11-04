import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import config from 'capacitor.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public load:boolean = false;

  constructor(
    private platform:Platform,
    private translate:TranslateService
  ) {

    this.translate.setDefaultLang('es');
    this.initApp();

  }

   initApp(){
    this,this.platform.ready().then(async ()=>{
      
      const language = await Device.getLanguageCode();

      if(language.value){
        this.translate.use(language.value.slice(0,2));
      }

      config.plugins.CapacitorHttp.enabled = true;

      this.load = true;


    });
  }
}
