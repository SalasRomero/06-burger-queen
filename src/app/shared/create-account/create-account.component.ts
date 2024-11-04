import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { User } from 'src/app/models/user';
import { ToastService } from 'src/app/services/toast.service';
import { Login } from 'src/app/state/auth/auth.actions';
import { CreateUser, GetUser } from 'src/app/state/users/users.actions';
import { UsersState } from 'src/app/state/users/users.state';

@Component({
  selector: 'shared-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent {

  @Output() back:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() doCreateAccount:EventEmitter<boolean> = new EventEmitter<boolean>();

  public user:User = new User();



  constructor(
    private store:Store,
    private toastService:ToastService,
    private translate:TranslateService
  ) { }

  createAccount(){
    this.store.dispatch(new CreateUser({user:this.user}))
    .subscribe({
      next:()=>{
        const success = this.store.selectSnapshot(UsersState.success);
        if( success){
          this.toastService.showToast(
            this.translate.instant('alabel.create.account.success')
          );

          this.store.dispatch(new Login({
            email: this.user.email,
            password: this.user.password
          })).subscribe({
            next:()=>{
              this.store.dispatch(new GetUser({email:this.user.email}))
            }
          })

          this.doCreateAccount.emit(true);
        }else{
          this.toastService.showToast(
            this.translate.instant('alabel.create.account.error')
          );
        }
      },
      error:(err)=>{
        this.toastService.showToast(
          this.translate.instant('alabel.create.account.error')
        );
      }
    });
  }

  exit(){
    this.back.emit(true);
  }

}
