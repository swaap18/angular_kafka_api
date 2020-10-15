import { TestBed } from '@angular/core/testing';

import { KafkaserviceService } from './kafkaservice.service';

describe('KafkaserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KafkaserviceService = TestBed.get(KafkaserviceService);
    expect(service).toBeTruthy();
  });
});
