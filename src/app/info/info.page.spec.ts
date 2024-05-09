import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { InfoPage } from './info.page';
import { AuthenticationService } from '../services/authentication.service';
import { NavController } from '@ionic/angular';

describe('InfoPage', () => {
    let component: InfoPage;
    let fixture: ComponentFixture<InfoPage>;

    const authenticationServiceMock = {
        getFullName: jasmine.createSpy('getFullName').and.returnValue('John Doe'),
        getUsername: jasmine.createSpy('getUsername').and.returnValue('johndoe'),
        getGivenName: jasmine.createSpy('getGivenName').and.returnValue('John'),
        getFamilyName: jasmine.createSpy('getFamilyName').and.returnValue('Doe'),
        getEmail: jasmine.createSpy('getEmail').and.returnValue('john.doe@example.com'),
      };
    /*const navCtrlMock = {
    navigateRoot: jasmine.createSpy('navigateRoot')
    };*/

beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      //declarations: [InfoPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        //{ provide: NavController, useValue: navCtrlMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

})