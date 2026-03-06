import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDailogComponent } from './org-dailog.component';

describe('OrgDailogComponent', () => {
  let component: OrgDailogComponent;
  let fixture: ComponentFixture<OrgDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgDailogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
