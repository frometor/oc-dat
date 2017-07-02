import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultVisualiationsComponent } from './result-visualiations.component';

describe('ResultVisualiationsComponent', () => {
  let component: ResultVisualiationsComponent;
  let fixture: ComponentFixture<ResultVisualiationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultVisualiationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultVisualiationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
