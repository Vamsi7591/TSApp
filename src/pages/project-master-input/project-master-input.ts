import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-project-master-input',
  templateUrl: 'project-master-input.html'
})
export class ProjectMasterInputPage {

public viewOrEdit: boolean = false;
public canEdit: boolean = false;
myIcon: string = "";

public projectDetails: any;



  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectMasterInputPage');
  }

}
