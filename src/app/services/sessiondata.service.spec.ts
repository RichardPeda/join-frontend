import { TestBed } from '@angular/core/testing';

import { SessiondataService } from './sessiondata.service';

describe('SessiondataService', () => {
  let service: SessiondataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessiondataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
