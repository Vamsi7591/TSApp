import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { Chart } from 'chart.js';

import { AuthService } from '../../providers/auth-service';
import * as moment from 'moment';

@Component({
  selector: 'page-monthly',
  templateUrl: 'monthly.html'
})
export class MonthlyPage {

  month: any;
  year: any;
  _monthName: string = '';

  public monthList: any = [
    {
      month: 'January',
      id: '1'
    }, {
      month: 'February',
      id: '2'
    }, {
      month: 'March',
      id: '3'
    }, {
      month: 'April',
      id: '4'
    }, {
      month: 'May',
      id: '5'
    }, {
      month: 'June',
      id: '6'
    }, {
      month: 'July',
      id: '7'
    }, {
      month: 'August',
      id: '8'
    }, {
      month: 'September',
      id: '9'
    }, {
      month: 'October',
      id: '10'
    }, {
      month: 'November',
      id: '11'
    }, {
      month: 'December',
      id: '12'
    }
  ];
  public yearList: any;

  // // PolarArea
  public polarAreaChartLabels: string[] = ['TimeSheet', 'Lunch', 'Tea Break', 'IONIC 2', 'VRI', 'Salesforce'];
  public polarAreaChartData: number[] = [12, 3, 1, 14, 19, 25];
  public polarAreaLegend: boolean = true;
  public polarAreaChartType: string = 'doughnut';


  // lineChart
  public lineChartData: Array<any> = [
    [65.30, 59.50, 80.10, 81.25, 56.32, 55.15, 40.12],
    [28.25, 48.56, 40.24, 19.48, 86.12, 27.45, 90.52]
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartType: string = 'line';


  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;
  public weeksRespLabelArray: Array<any>;
  public weeksRespDataSetsArray: Array<any>;
  public weeksColorArray: Array<any>;

  public monthDetails: any;
  public _width: any;
  public _height: any;

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public platform: Platform,
    public navParams: NavParams) {

    console.log('constructor');

    // platform.ready().then((readySource) => {
    //   this._width = platform.width() * 3;
    //   this._height = ( platform.height() -212 ) * 3;
    //
    //   console.log('Width: ' + platform.width());
    //   console.log('Height: ' + platform.height());
    // });

    this.year = moment().year();
    let m_no = moment().month();
    console.log('year : ', this.year);
    console.log('month : ', m_no);
    console.log('month name: ', this.monthList[m_no].month);
    this.month = this.monthList[m_no].month;


    this.auth.loadMonthReport()
      .then(data => {
        this.monthDetails = data;
      });
  }

  changeMonth() {
    console.log('changeMonth : ', this.month);
  }

  loadMonthly() {
    this.ngAfterViewInit();
  }

  loadMonthReport() {
    this.auth.loadMonthReport()
      .then(data => {
        this.monthDetails = data;
      });
  }

  ngAfterViewInit() {

    // this._width = this.platform.width() * 3;
    // this._height = (this.platform.height() - 212) * 3;
    // // window.innerWidth
    // // window.innerHeight
    // console.log('Width: ' + this.platform.width() + ' : ' + this._width);
    // console.log('Height: ' + this.platform.height() + ' : ' + this._height);

    console.log('monthDetails : ', this.monthDetails);

    this.weeksColorArray = [
      {
        color: "Blue",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "DimGrey",
        backgroundColor: "rgba(119, 113, 128,0.4)",
        borderColor: "rgba(119, 113, 128,1)",
        pointBorderColor: "rgba(119, 113, 128,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(119, 113, 128,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "Chocolate",
        backgroundColor: "rgba(255, 128, 0,0.4)",
        borderColor: "rgba(255, 128, 0,1)",
        pointBorderColor: "rgba(255, 128, 0,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(255, 128, 0,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "Purple",
        backgroundColor: "rgba(74, 35, 90,0.4)",
        borderColor: "rgba(74, 35, 90,1)",
        pointBorderColor: "rgba(74, 35, 90,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(74, 35, 90,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "Green Copper",
        backgroundColor: "rgba(133,99,99,0.4)",
        borderColor: "rgba(133,99,99,1)",
        pointBorderColor: "rgba(133,99,99,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(133,99,99,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "bronze",
        backgroundColor: "rgba(140,120,83,0.4)",
        borderColor: "rgba(140,120,83,1)",
        pointBorderColor: "rgba(140,120,83,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(140,120,83,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "Steel Blue",
        backgroundColor: "rgba(35, 107, 142,0.4)",
        borderColor: "rgba(35, 107, 142,1)",
        pointBorderColor: "rgba(35, 107, 142,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(35, 107, 142,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "Dark Turquoise",
        backgroundColor: "rgba(112,147,219,0.4)",
        borderColor: "rgba(112,147,219,1)",
        pointBorderColor: "rgba(112,147,219,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(112,147,219,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "Aquamarine",
        backgroundColor: "rgba(127,255,212,0.4)",
        borderColor: "rgba(127,255,212,1)",
        pointBorderColor: "rgba(127,255,212,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(127,255,212,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "Green Yellow",
        backgroundColor: "rgba(209,146,117,0.4)",
        borderColor: "rgba(209,146,117,1)",
        pointBorderColor: "rgba(209,146,117,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(209,146,117,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "LightCoral",
        backgroundColor: "rgba(240,128,128,0.4)",
        borderColor: "rgba(240,128,128,1)",
        pointBorderColor: "rgba(240,128,128,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(240,128,128,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "MediumPurple",
        backgroundColor: "rgba(147,112,219,0.4)",
        borderColor: "rgba(147,112,219,1)",
        pointBorderColor: "rgba(147,112,219,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(147,112,219,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      },
      {
        color: "Quartz",
        backgroundColor: "rgba(217,217,243,0.4)",
        borderColor: "rgba(217,217,243,1)",
        pointBorderColor: "rgba(217,217,243,1)",
        pointBackgroundColor: "#fff",
        pointHoverBackgroundColor: "rgba(217,217,243,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        lineTension: 0.1,
        borderDashOffset: 0.0,
        borderCapStyle: 'butt',
        borderJoinStyle: 'miter',
        spanGaps: false
      }
    ];

    // Add values from service
    // this.weeksRespLabelArray = ["Week 1", "Week 2", "Week 3", "Week 4"];
    // this.weeksRespDataSetsArray = [
    //     {
    //         label: "TimeSheet",
    //         // fill: false,
    //         // lineTension: 0.1,
    //         backgroundColor: "rgba(75,192,192,0.4)",
    //         borderColor: "rgba(75,192,192,1)",
    //         // borderCapStyle: 'butt',
    //         // borderDash: [],
    //         // borderDashOffset: 0.0,
    //         // borderJoinStyle: 'miter',
    //         pointBorderColor: "rgba(75,192,192,1)",
    //         pointBackgroundColor: "#fff",
    //         // pointBorderWidth: 1,
    //         // pointHoverRadius: 5,
    //         pointHoverBackgroundColor: "rgba(75,192,192,1)",
    //         pointHoverBorderColor: "rgba(220,220,220,1)",
    //         // pointHoverBorderWidth: 2,
    //         // pointRadius: 1,
    //         // pointHitRadius: 10,
    //         data: [65, 59, 80, 81]
    //         // spanGaps: false,
    //     },
    //     {
    //         label: "DineConnect",
    //         // fill: false,
    //         // lineTension: 0.1,
    //         backgroundColor: "rgba(119, 113, 128,0.4)",
    //         borderColor: "rgba(119, 113, 128,1)",
    //         // borderCapStyle: 'butt',
    //         // borderDash: [],
    //         // borderDashOffset: 0.0,
    //         // borderJoinStyle: 'miter',
    //         pointBorderColor: "rgba(119, 113, 128,1)",
    //         pointBackgroundColor: "#fff",
    //         // pointBorderWidth: 1,
    //         // pointHoverRadius: 5,
    //         pointHoverBackgroundColor: "rgba(119, 113, 128,1)",
    //         pointHoverBorderColor: "rgba(220,220,220,1)",
    //         // pointHoverBorderWidth: 2,
    //         // pointRadius: 1,
    //         // pointHitRadius: 10,
    //         data: [18, 48, 77, 9]
    //         // spanGaps: false,
    //     },
    //     {
    //         label: "VRI",
    //         // fill: false,
    //         // lineTension: 0.1,
    //         backgroundColor: "rgba(255, 128, 0,0.4)",
    //         borderColor: "rgba(255, 128, 0,1)",
    //         // borderCapStyle: 'butt',
    //         // borderDash: [],
    //         // borderDashOffset: 0.0,
    //         // borderJoinStyle: 'miter',
    //         pointBorderColor: "rgba(255, 128, 0,1)",
    //         pointBackgroundColor: "#fff",
    //         // pointBorderWidth: 1,
    //         // pointHoverRadius: 5,
    //         pointHoverBackgroundColor: "rgba(255, 128, 0,1)",
    //         pointHoverBorderColor: "rgba(220,220,220,1)",
    //         // pointHoverBorderWidth: 2,
    //         // pointRadius: 1,
    //         // pointHitRadius: 10,
    //         data: [28, 48, 40, 19]
    //         // spanGaps: false,
    //     }
    // ];

    this.auth.loadMonthReport()
      .then(data => {
        this.monthDetails = data;

        this.weeksRespDataSetsArray = [];
        this.weeksRespLabelArray = [];

        this.weeksRespLabelArray = this.monthDetails.weeks;

        for (let k = 0; k < this.monthDetails.projects.length; k++) {

          let weekData = {
            label: this.monthDetails.projects[k].projectName,

            backgroundColor: this.weeksColorArray[k].backgroundColor,
            borderColor: this.weeksColorArray[k].borderColor,
            pointBorderColor: this.weeksColorArray[k].pointBorderColor,
            pointBackgroundColor: this.weeksColorArray[k].pointBackgroundColor,
            pointHoverBackgroundColor: this.weeksColorArray[k].pointHoverBackgroundColor,
            pointHoverBorderColor: this.weeksColorArray[k].pointHoverBorderColor,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            lineTension: 0.1,
            borderDashOffset: 0.0,
            borderCapStyle: 'butt',
            borderJoinStyle: 'miter',
            spanGaps: false,

            data: this.monthDetails.projects[k].duration
          };

          this.weeksRespDataSetsArray.push(weekData);
        }

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: this.weeksRespLabelArray,
            datasets: this.weeksRespDataSetsArray
          }
        });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MonthlyPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter MonthlyPage');
    this.ionViewDidLoad();
  }

  // // events
  // public chartClicked(e: any): void {
  //   console.log(e);
  // }
  //
  // public chartHovered(e: any): void {
  //   console.log(e);
  // }

}
