import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { EmployeeMasterPage } from '../employee-master/employee-master'
import { HomePage } from '../home/home'

@Component({
    selector: 'page-popover',
    template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button ion-item (click)="close()">Learn Ionic</button>
      <button ion-item (click)="close()">Documentation</button>
      <button ion-item (click)="close()">Showcase</button>
      <button ion-item (click)="close()">GitHub Repo</button>
    </ion-list>
  `
})
export class PopoverPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PopoverPage');
    }

    close() {
        this.viewCtrl.dismiss();
        this.navCtrl.parent = HomePage;
        this.navCtrl.setRoot(EmployeeMasterPage);
        // this.navCtrl.getPrevious().setRoot(EmployeeMasterPage);
        // this.navCtrl.setRoot(EmployeeMasterPage);
    }

}
