import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenumasterComponent } from './menumaster.component';

describe('MenumasterComponent', () => {
  let component: MenumasterComponent;
  let fixture: ComponentFixture<MenumasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenumasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenumasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
