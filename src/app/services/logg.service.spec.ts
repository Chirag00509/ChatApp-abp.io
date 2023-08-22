import { TestBed } from '@angular/core/testing';

import { LoggService } from './logg.service';

describe('LoggService', () => {
  let service: LoggService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
