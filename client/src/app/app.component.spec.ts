/* tslint:disable:no-unused-variable */

import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {BlogService} from "./blog.service";
import {FormsModule } from '@angular/forms';
import {Http} from '@angular/http';

describe('App: MEAN2', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [
        AppComponent
      ],
      providers:[ {provide: BlogService}, {provide: [Http]}],
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title Wellcome to chat app'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Wellcome to chat app');
  }));

  it('Check login', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.componentInstance.isLoggedIn;
    expect(app).toEqual(false);
  }));


  it('Check login 2', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.submitLogin();
    fixture.detectChanges();

    expect(fixture.componentInstance.isLoggedIn).toEqual(true);
  }));

  it('get Room', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let count = fixture.componentInstance.chatRooms.length;
    expect(count).toEqual(3);
  }));

});