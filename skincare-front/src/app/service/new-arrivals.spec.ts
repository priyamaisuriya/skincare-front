import { TestBed } from '@angular/core/testing';

import { NewArrivals } from './new-arrivals';

describe('NewArrivals', () => {
  let service: NewArrivals;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewArrivals);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
