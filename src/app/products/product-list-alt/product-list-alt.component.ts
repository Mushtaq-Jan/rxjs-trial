import { ProductService } from './../product.service';
import { ChangeDetectionStrategy, Component} from '@angular/core';
import { Product } from '../product';
import { catchError, EMPTY, combineLatest, map, Subject } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent{
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable(); 

  products$ = this.productService.productWithCategory$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  selectedProduct$ = this.productService.selectedProduct$;

   vm$ = combineLatest([
     this.products$,
     this.selectedProduct$
   ]) 
   .pipe(
     map(([products,product]) => 
     ({ products, productId: product? product.id : 0}))
   );

  constructor(private productService: ProductService) { }


  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
