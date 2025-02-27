import { Component } from '@angular/core';
@Component({
  selector: 'app-navbar',
  template: '',
  standalone: true,
})
class MockNavbarComponent {}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent, MockNavbarComponent, TranslateModule.forRoot()],
    })
    .overrideComponent(SettingsComponent, {
      set: { imports: [MockNavbarComponent, TranslatePipe ] }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
