import { TestBed } from '@angular/core/testing';

import { QuestionnairsService } from './questionnairs.service';

describe('QuestionnairsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionnairsService = TestBed.get(QuestionnairsService);
    expect(service).toBeTruthy();
  });
});
