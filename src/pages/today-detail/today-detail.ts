import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import * as moment from 'moment';
import _ from 'lodash';

@Component({
    selector: 'page-today-detail',
    templateUrl: 'today-detail.html'
})
export class TodayDetailPage {

    todayDetails: any;
    _date: any;
    _totalHours: number = 0;
    mins: any;
    seconds: number = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        console.log('navParams : ', this.navParams.data);
        this._date = this.navParams.data[0].date;


        this.todayDetails = _.sortBy(this.navParams.data, 'startTime');
        console.log('sortBy : ', this.todayDetails);
        this._totalHours = 0;


        for (let k = 0; k < this.todayDetails.length; k++) {

            this._totalHours = this.navParams.data[k].totalHours;

            let ss = (new Date('1970-01-01T' + this._totalHours + 'Z').getTime() / 1000);
            this.seconds = this.seconds + ss;

        }

        console.log('seconds : ', this.seconds);

        if (3600 > this.seconds) {
            this.mins = '00:' + (this.seconds / 60);
        } else {
            this.mins = moment().startOf('day').add(this.seconds, 'seconds').format('hh:mm');
        }
        console.log('totalHours : ', this.mins);
    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad TodayDetailPage');
    }

}
