import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantCompareComponent } from './grant-compare.component';

describe('GrantCompareComponent', () => {
  let component: GrantCompareComponent;
  let fixture: ComponentFixture<GrantCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrantCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
