import { TestBed } from '@angular/core/testing';

import { BestSellers } from './best-sellers';

describe('BestSellers', () => {
  let service: BestSellers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BestSellers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
