import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { TokenUser } from '../models/token-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(email:string,password:string){
    return CapacitorHttp.post({
      url:`${environment.urlApi}auth/login`,
      data:{
        email,
        password
      },
      params:{},
      headers:{
        'Content-Type': 'application/json'
      }
    }).then((response:HttpResponse)=>{
      if(response.status == 201){
        const data = response.data as TokenUser;
        return data;
      }
      return null;
    }).catch(err =>{
      console.log(err);
      return null;
    });
  }
}
