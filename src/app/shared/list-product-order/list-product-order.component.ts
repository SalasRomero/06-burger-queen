import { Component } from '@angular/core';
import { UserOrderService } from 'src/app/services/user-order.service';

@Component({
  selector: 'shared-list-products-order',
  templateUrl: './list-product-order.component.html',
  styleUrls: ['./list-product-order.component.scss'],
})
export class ListProductsOrderComponent {

  constructor(
    public userOrderService:UserOrderService
  ) { }



}
