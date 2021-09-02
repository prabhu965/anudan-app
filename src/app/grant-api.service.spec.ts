import { TestBed } from '@angular/core/testing';

import { GrantApiService } from './grant-api.service';

describe('GrantApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrantApiService = TestBed.get(GrantApiService);
    expect(service).toBeTruthy();
  });
});
