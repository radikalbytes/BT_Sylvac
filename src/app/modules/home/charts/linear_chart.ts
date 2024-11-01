import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexMarkers, ApexTitleSubtitle, ApexFill, ApexYAxis, ApexXAxis, ApexTooltip, ChartType } from "ng-apexcharts";

export const linear_chart: {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
} = {
  series: [{
    name: '',
    data: [],
  }],
    chart: {
    type: 'area',
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true
    },
    toolbar: {
      autoSelected: 'zoom'
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 0,
  },
  title: {
    text: 'Captura mediciones',
    align: 'left'
  },
  fill: {
    type: 'gradient' as ChartType,
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100]
    },
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return (val).toFixed(3);
      },
    },
    title: {
      text: 'mm'
    },
  },
  xaxis: {
    type: 'datetime',
    title: {
      text: 'Time'
    },
    labels:{
      formatter: function (val) {
        const date = new Date(val);
        const month = date.getMonth().toString().padStart(2,'0');
        const day = date.getDay().toString().padStart(2,'0');
        const hours = date.getHours().toString().padStart(2,'0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
        return `${day}/${month} ${hours}:${minutes}:${seconds}.${milliseconds}`;
      }
    }
  },
  tooltip: {
    shared: false,
    x: {
      format: "dd/MM/yy hh:MM:sss.SSS"
    },
    y: {
      formatter: function (val: number) {
        return (val).toFixed(3)
      }
    }
  }
  }