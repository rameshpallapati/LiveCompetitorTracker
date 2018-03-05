import { TestBed, inject } from '@angular/core/testing';

import { LivetrackerService } from './livetracker.service';

describe('LivetrackerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LivetrackerService]
    });
  });

  it('should be created', inject([LivetrackerService], (service: LivetrackerService) => {
    expect(service).toBeTruthy();
  }));
});
