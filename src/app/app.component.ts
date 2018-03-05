import { Component } from '@angular/core';
import {LivetrackerService} from './livetracker.service' ;
import {Chart} from 'chart.js';
import { OnInit } from '@angular/core';
import {Competitor} from './competitor.model';
import {Departure} from './departure.model';
import { ChangeDetectorRef } from '@angular/core';
import { CurrentData } from './currentdata.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {
  chart;
  data: any;
  chartData: any;
  detailChart = [];
  config: any;
  depDates: any[] = [];
  showDetailChart = false;
  interval;
  public compArray: Competitor[] = [];
  constructor(private _liveTracker: LivetrackerService) {}
  ngOnInit() {
   this.redrawGraphs();
    this.interval = setInterval(() => {
        this.redrawGraphs();
    }, 5000);
  }

  loadData(res) {
    this.data = res;
    let comp: Competitor;
    let departure: Departure;
    let depInfo = [];
    this.data.forEach(element => {
        comp = new Competitor();
        const depArray: Departure[] = [];
        if ( element.compName !== '' && element.compName !== null && element.compName !== 'undefined') {
            comp.name = element.compName;
            comp.backgroundColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            comp.borderColor = comp.backgroundColor;
            depInfo = element.data;
            depInfo.forEach(ele => {
            departure = new Departure();
            departure.avgPrice = ele.avgprice;
            departure.date = ele.date;
            departure.origin = ele.origin;
            departure.dest = ele.destination;
            departure.current = ele.info;
            depArray.push(departure);
            if (this.depDates && this.depDates.indexOf(ele.date) > -1) {

            } else {
                this.depDates.push(ele.date);
            }
            });
            comp.departures = depArray;
            this.compArray.push(comp);
        }
    });
  }

  createFareIndetailChartForDep(clickEvt, activeElems) {
    const xLabel = this.chart.scales['x-axis-0'].getValueForPixel(clickEvt.x);
    const clickedDate = this.chart.scales['x-axis-0'].ticks[xLabel-1];
    const compNames = [];
    const datasets = [];
    let dataset = {};
    let depArray: Departure[] = [];
    const timeFormat = 'DD/MM/YYYY HH:mm';
    const labels = [];
    this.compArray.forEach(competitor => {
        depArray = competitor.departures;
        let detailPrices: CurrentData[] = [];
        const values = [];
        depArray.forEach(departure => {
            if ( clickedDate === departure.date ) {
                detailPrices = departure.current;
                detailPrices.forEach(price => {
                    if (labels && labels.indexOf(price.departure_time) > -1) {

                    } else {
                        labels.push(price.departure_time);
                    }
                    values.push(price.ticket_price);
                });
                dataset = {
                    label: competitor.name,
                    backgroundColor: competitor.backgroundColor,
                    borderColor: competitor.borderColor,
                    fill: false,
                    borderCapStyle: 'square',
                    pointRadius: 10,
                    pointHoverRadius: 15,
                    pointStyle: 'star',
                    showLine: false,
                    data: values
                };
                datasets.push(dataset);
            }
            });
        });


    const detailChartData = {
        labels: labels,
        datasets: datasets
    };

    this.detailChart = new Chart('detailcanvas', {
        type: 'line',
        data: detailChartData,
        options: {
            responsive: true,
          scales: {
            xAxes: [
                {
                scaleLabel: {
                    display: true,
                    labelString: 'Dep Time'
                }}
            ],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Price'
                }
            }]
          },
          legend: {
            display: true,
            position: 'right',
            padding: 50,
            labels: {
                fontColor: 'green'
            }
        }
        }
      });


  }

  createChart(compArray) {
    const compNames = [];
    const datasets = [];
    let dataset = {};
    let depArray: Departure[] = [];
    const timeFormat = 'DD/MM/YYYY';
    this.config = {
        type: 'line',
        data: this.chartData
    };
    const color = Chart.helpers.color;
    compArray.forEach(competitor => {
        depArray = competitor.departures;
        const avgPrices = [];
        depArray.forEach(departure => {
                avgPrices.push(departure.avgPrice);
            });
            dataset = {
                label: competitor.name,
                backgroundColor: competitor.backgroundColor,
                borderColor: competitor.borderColor,
                fill: false,
                borderCapStyle: 'square',
                data: avgPrices
            };
            datasets.push(dataset);
        });

    this.chartData = {
        labels: this.depDates,
        datasets: datasets
    };

    this.chart = new Chart('canvas', {
        type: 'line',
        data: this.chartData,
        options: {
            title: {
            display: true,
            text: 'Competitors Average Price',
            fontSize: 20
            },
            responsive: true,
            onClick: (clickEvt, activeElems) => this.createFareIndetailChartForDep(clickEvt, activeElems),
          scales: {
            xAxes: [
                {
                position: 'top',
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }}
            ],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Avg Price'
                }
            }]
          },
          legend: {
            display: true,
            position: 'right',
            padding: 50,
            labels: {
                fontColor: 'green'
            }
        }
        }
      });
  }

  redrawGraphs()  {
      console.log('Live Tracking data............');
      this.compArray = [];
    this._liveTracker.getAllDatesLiveData()
    .subscribe(res => {
         this.loadData(res);
         this.createChart(this.compArray);
       });
  }
}
