import { TestBed } from '@angular/core/testing';

import { PocketMoneyService } from './pocket-money.service';

describe('PocketMoneyService', () => {
  let service: PocketMoneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PocketMoneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
