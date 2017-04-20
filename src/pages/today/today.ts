import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController } from 'ionic-angular';
// import { PopoverController } from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';

import { AuthService } from '../../providers/auth-service';

// import { PopoverPage } from '../popover/popover'

import { TodayInputPage } from '../today-input/today-input';
import { TodayDetailPage } from '../today-detail/today-detail';

import _ from 'lodash';

@Component({
  selector: 'page-today',
  templateUrl: 'today.html',
  providers: [LocalNotifications]
})
export class TodayPage {

  public todayRep: any;
  public todayAllRep: any;
  public todayDivisions: any;
  queryText: string = '';
  refresherTimeOut: any = 500;
  _flag: boolean = false;
  isAdmin: boolean = false;
  localStorage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public loadingController: LoadingController,
    // public popoverCtrl: PopoverController,
    public auth: AuthService) {

    this.platform.ready().then(() => {
      this.localStorage = window.localStorage;
      if (this.localStorage.getItem('role') != null) {
        if (this.localStorage.getItem('role') === "admin") {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      } else {
        this.isAdmin = false;
      }
    });

    LocalNotifications.on('click', (notification, state) => {
      this.navCtrl.parent.select(0);
      // if (!this._flag)
      // this.addInput();
    });
    this.todayRep = null;
  }

  // presentPopover(myEvent) {
  //     let popover = this.popoverCtrl.create(PopoverPage);
  //     popover.present({
  //       ev: myEvent
  //     });
  //   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodayPage');
    this.loadToday(false);

  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter TodayPage');
    this.queryText = '';
    if (this._flag) {
      this._flag = false;
      this.loadToday(true);
    }

  }

  loadToday(flag) {

    let loader = this.loadingController.create({
      content: 'Loading Timesheet...'
    });

    this.auth.loadTodayReport(flag)
      .then(data => {

        loader.present();

        this.todayAllRep = _.sortBy(data, 'date').reverse();
        this.todayDivisions =
          _.chain(this.todayAllRep)
            .groupBy('date')
            .toPairs()
            .map(item => _.zipObject(['divisionName', 'divisionData'], item))
            .value();

        this.todayRep = this.todayDivisions;
        // console.log('division data', this.todayRep);
        loader.dismiss();
      });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadToday(true);
      refresher.complete();
    }, this.refresherTimeOut);
  }

  updateTimeSheet() {
    let queryTextLower = this.queryText.toLowerCase();
    let filteredTeams = [];
    _.forEach(this.todayDivisions, td => {
      let teams = _.filter(td.divisionData, t => (<any>t).projectName.toLowerCase().includes(queryTextLower));
      if (teams.length) {
        filteredTeams.push({ divisionName: td.divisionName, divisionData: teams });
      }
    });

    this.todayRep = filteredTeams;
  }

  public addInput() {
    this._flag = true;
    this.navCtrl.push(TodayInputPage);
  }

  openView($event, item) {
    this._flag = true;
    this.navCtrl.push(TodayInputPage, item);
  }

  openViewHeader($event, division) {
    this.navCtrl.push(TodayDetailPage, division);
    console.log(' Division : ', division);
  }

}
