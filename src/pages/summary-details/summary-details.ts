import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-summary-details',
  templateUrl: 'summary-details.html'
})
export class SummaryDetailsPage {

  public employeeDetails: any;
  public projectDetails: any;
  empName: string = 'Vamsi K';
  projName: string = 'TimeSheet';


@ViewChild('barCanvas') barCanvas;
barChart: any;

  constructor(
    public auth: AuthService,
    public navCtrl: NavController,
     public navParams: NavParams) {}

  ionViewDidLoad() {
    this.loadEmployeeDetails();
    this.loadProjectDetails();

    console.log('ionViewDidLoad SummaryDetailsPage');
  }

  loadEmployeeDetails() {
      this.auth.loadEmployeeDetails()
          .then(data => {
              this.employeeDetails = data;
          });
  }

  loadProjectDetails() {
      this.auth.loadProjectDetails()
          .then(data => {
              this.projectDetails = data;
          });
  }

  ngAfterViewInit(){
    this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'bar',
            data: {
                labels: ["Oct","Nov", "Dec", "Jan", "Feb", "March"],
                datasets: [{
                    label: this.projName,
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }

        });
  }

  go(){
    this.ngAfterViewInit();
  }

}
