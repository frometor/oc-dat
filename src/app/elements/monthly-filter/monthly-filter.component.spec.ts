import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFilterComponent } from './monthly-filter.component';

describe('MonthlyFilterComponent', () => {
  let component: MonthlyFilterComponent;
  let fixture: ComponentFixture<MonthlyFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
