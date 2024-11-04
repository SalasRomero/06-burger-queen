import { Injectable } from '@angular/core';
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Product } from 'src/app/models/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  getProductByCategoriy(idCategory:string){
    return CapacitorHttp.get({
      url:`${environment.urlApi}products/category/${idCategory}`,
      params:{},
      headers:{
        'Content-Type': 'application/json'
      }
    }).then((response:HttpResponse)=>{

      if(response.status === 200){
          const data = response.data as Product;
          return data;
      }

      return [];

    });
  }


  getProductById(id:string){
    return CapacitorHttp.get({
      url:`${environment.urlApi}products/${id}`,
      params:{},
      headers:{
        'Content-Type': 'application/json'
      }
    }).then((response:HttpResponse)=>{
      if(response.status === 200){
        const product = response.data as Product;
        return product;
      }
      return null;
    });
  }


}
