import { TestBed } from '@angular/core/testing';

import { SingleProduct } from './single-product';

describe('SingleProduct', () => {
  let service: SingleProduct;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleProduct);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
