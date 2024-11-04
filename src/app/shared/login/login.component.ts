import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { User } from 'src/app/models/user';
import { ToastService } from 'src/app/services/toast.service';
import { Login } from 'src/app/state/auth/auth.actions';
import { AuthState } from 'src/app/state/auth/auth.state';
import { GetUser } from 'src/app/state/users/users.actions';

@Component({
  selector: 'shared-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  @Input() showBack:boolean = true;

  @Output() newAccount:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() back:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() doLogin:EventEmitter<boolean> = new EventEmitter<boolean>();

  public user:User = new User();

  constructor(
    private store:Store,
    private toastService:ToastService,
    private translate:TranslateService
  ) { }

  login(){
    this.store.dispatch(new Login({
      email: this.user.email,
      password: this.user.password
    })).subscribe({
      next:()=>{
        const success = this.store.selectSnapshot(AuthState.success);
        if(success){
          this.toastService.showToast(
            this.translate.instant('label.login.success')
          );
          this.store.dispatch(new GetUser({email:this.user.email}))
          this.doLogin.emit(true);
        }else{
          this.toastService.showToast(
            this.translate.instant('label.login.error')
          );
        }
      },
      error:(err)=>{
        this.toastService.showToast(
          this.translate.instant('label.login.error')
        );
      }
    });
  }

  exit(){
    this.back.emit(true);
  }

  createNewAccount(){
    this.newAccount.emit(true);
  }
  

}
