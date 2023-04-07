import { Component,OnInit , ViewChild, ElementRef } from '@angular/core';
//import * as Plotly from 'plotly.js';
//import * as CanvasJS from 'canvasjs';
import { ActivatedRoute ,Router } from '@angular/router';
import * as Papa from 'papaparse';
import { HttpClient } from '@angular/common/http';
import {Chart} from 'chart.js/auto';
import { LineController, LinearScale, PointElement, Title } from 'chart.js';
Chart.register(LineController, LinearScale, PointElement, Title);
import { FileService } from '../file.service';
import { UserServiceService } from '../user-service.service';
//import { registerables } from 'chart.js';
interface MyData {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}
@Component({
  selector: 'app-my-c',
  templateUrl: './my-c.component.html',
  styleUrls: ['./my-c.component.css'],
})

// 05386b  RGB (5, 56, 107)						 
// 379683  RGB (55, 150, 131)						 
// 5cdb95  RGB (92, 219, 149)						 

export class MyCComponent implements OnInit {
  //csvData: any[] =[] ;


  Data: any[] =[] ;
  Act: any[] =[] ;
  csvData: string = '';
  data: any;
  act: any;
  x: any;
  y: any;
  lowerBound: any[]=[];
  upperBound: any[]=[];
  //chart!: Chart;
  chartOptions:any={};
  chartOptions3:any={};
  chart: any;

  chartOptions2 = {
		animationEnabled: true,
		title: {
		  text: "Sales by Department"
		},
		data: [{
		  type: "pie",
		  startAngle: 360,
		  indexLabel: "{name}: {y}",
		  yValueFormatString: "#,###.##'%'",
		  dataPoints: [
			{ y: 75, name: "Accuracy",color:"#05386b" },
			{ y: 100-75, name: "Not Accurate",color:"#379683" },
		  ]
		}]
	}

  
	
	


  
  constructor(private http: HttpClient , private userServise:UserServiceService, private router: Router) {

    if(this.userServise.userId==null){
      this.router.navigate(['']);
    }
    
  }

  @ViewChild('mychart') mychart: any;

  ngOnInit(): void {

    var url :string = "http://localhost:4000/public/"+this.userServise.userId+"/output_data.csv";
    var url2 :string= "http://localhost:4000/public/"+this.userServise.userId+"/data.csv";
    console.log(url);
    this.http.get(url, { responseType: 'text' }).subscribe(
      (data) => {
        this.csvData = data;
        //console.log('CSV data:', this.csvData);
        this.parseCSV();
        this.http.get(url2, { responseType: 'text' }).subscribe(
          (data) => {
            this.csvData = data;
            //console.log('CSV data:', this.csvData);
            this.parseCSV2();
            this.loadCSV();
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    

    
      
  }

  loadCSV() {
    this.chartOptions = {
      theme: "light2",
      animationEnabled: true,
      zoomEnabled: true,
      exportEnabled: true,
      title: {
        text: "Sales Forcast Graph"
      },
      toolTip:{
			shared:true
		}, 
      axisX:{
        valueFormatString: "MMM-YYYY",
        crosshair: {
          enabled: true,
          snapToDataPoint: true
        }
      },
      axisY: {
        title: "Sales Percentage",
        crosshair: {
          enabled: true
        }
      },
      data: [{
        name:"Pridicted",
        showInLegend: true,
        type: "spline",
        color:"#379663",
        lineDashType: "dash",
        markerType: "circle",
        xValueFormatString: "DD MMM, YYYY",
        yValueFormatString: "###.##'%'",
        dataPoints: this.Data
      },
      {
        name:"Actual",
        showInLegend: true,
        type: "spline",
        color:"#05386b",
        xValueFormatString: "YYYY",
        yValueFormatString: "###.##'%'",
        dataPoints: this.Act
      }
    ]
    }	

    this.chartOptions3 = {
      animationEnabled: true, 
      zoomEnabled: true,
      exportEnabled: true, 
      title: {
        text: "Annual Expenses"
      },
      axisY: {
        prefix: "$",
  
        
      },
      toolTip: {
        shared: true,
        content: "{name}:{y}"
      },
      legend: {
        fontSize: 13
      },
      data: [
        {        
        type: "splineArea", 
        showInLegend: true,
        name: "Lowerbound",
        markerSize: 0,
        yValueFormatString: "##.##'%'",
  
        color: "rgba(92, 219, 149,.9)",
        dataPoints: this.upperBound
        },
        {        
          type: "splineArea", 
          showInLegend: true,
          name: "Average",
          markerSize: 0,
          yValueFormatString: "##.##'%'",
    
          color: "rgba(55, 150, 131,.9)",
          dataPoints: this.Data
          }
        ,{        
        type: "splineArea", 
        showInLegend: true,
        name: "Upperbound",
        markerSize: 0,
        yValueFormatString: "##.##'%'",
  
        color: "rgba(5, 56, 107,.9)",        
        dataPoints: this.lowerBound
        }
      ]
    }	

    //console.log(d);

 
  }

  async parseCSV() {
    this.data = Papa.parse(this.csvData, { header: true }).data as MyData[];
    //console.log('Parsed data:', data);
    // Use the parsed data here
    this.x = this.data.map((row: MyData) => new Date(row.ds));
    this.y = this.data.map((row: MyData) => row.yhat);
    this.Data = this.data.map((row: MyData) => ({ x: new Date(row.ds), y: parseFloat(String(row.yhat)) }));
    this.lowerBound = this.data.map((row: MyData) => ({ x: new Date(row.ds), y: parseFloat(String(row.yhat_lower)) }));
    this.upperBound = this.data.map((row: MyData) => ({ x: new Date(row.ds), y: parseFloat(String(row.yhat_upper)) }));
    // console.log(this.x);
    // console.log(this.y);
    console.log(this.Data);
    console.log("LowerBound: ",this.lowerBound);
    console.log("UpperBound: ",this.upperBound);
    
    
  }
  async parseCSV2() {
    this.act = Papa.parse(this.csvData, { header: true }).data as MyData[];
    //console.log('Parsed data:', data);
    // Use the parsed data here
    this.x = this.act.map((row: MyData) => new Date(row.ds));
    this.y = this.act.map((row: MyData) => row.yhat);
    this.Act = this.act.map((row: MyData) => ({ x: new Date(row.ds), y: parseFloat(String(row.yhat)) }));
  
    
    
  }

  backFun(){

    this.router.navigate(['/drop-box']);

  }

  ngAfterViewInit(){

 
   }
  
}
