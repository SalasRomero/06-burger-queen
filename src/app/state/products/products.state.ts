import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { GetProductsByCategories,GetProductById } from './products.actions';
import { ProductsService } from './products.service';
import { Product } from 'src/app/models/product';

export class ProductsStateModel {
  public products: Product[];
  public product: Product;
}

const defaults = {
  products: [],
  product: null
};

@State<ProductsStateModel>({
  name: 'products',
  defaults
})
@Injectable()
export class ProductsState {

  @Selector()
  static products(state:ProductsStateModel){
    return state.products;
  }

  @Selector()
  static product(state:ProductsStateModel){
    return state.product;
  }

  constructor(
    private productsService:ProductsService
  ){}

  @Action(GetProductsByCategories)
  getProductsByCategories({ getState, setState }: StateContext<ProductsStateModel>, 
    { payload }: GetProductsByCategories) {
      return this.productsService.getProductByCategoriy(payload.idCategory)
      .then(((products:Product[]) =>{
        const state = getState();
        setState({
          ...state,
          products
        });
      }));

  }


  @Action(GetProductById)
  getProductById({ getState, setState }: StateContext<ProductsStateModel>, 
    { payload }: GetProductById) {
      return this.productsService.getProductById(payload.id)
      .then((product:Product)=>{
        const state = getState();
        setState({
          ...state,
          product
        });
      });
  }

}
