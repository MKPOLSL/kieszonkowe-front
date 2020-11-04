import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMockComponent } from './register-mock.component';

describe('RegisterMockComponent', () => {
  let component: RegisterMockComponent;
  let fixture: ComponentFixture<RegisterMockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterMockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
