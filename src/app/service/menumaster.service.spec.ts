import { TestBed } from '@angular/core/testing';

import { MenumasterService } from './menumaster.service';

describe('MenumasterService', () => {
  let service: MenumasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenumasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
