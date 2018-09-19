$(document).ready(function() {
    
    console.log("graphs");

    if ($('#bothChart').length )
    { 
      var ctx = document.getElementById("bothChart");
      bothChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [{
            label: '# of Short Entries',
            backgroundColor: "#26B99A",
            data: [51, 30, 40, 28, 92, 50, 45]
          }, {
            label: '# of Long Entries',
            backgroundColor: "#03586A",
            data: [41, 56, 25, 48, 72, 34, 12]
          }]
        },

        options: {
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{
                stacked: true,
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }


    if($('#carChart').length ){ 
      
      var ctx = document.getElementById("carChart");
      carChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [{
            label: '# of Short Entries',
            backgroundColor: "#26B99A",
            data: [51, 30, 40, 28, 92, 50, 45]
          }, {
            label: '# of Long Entries',
            backgroundColor: "#03586A",
            data: [41, 56, 25, 48, 72, 34, 12]
          }]
        },

          options: {
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{
                  stacked: true,
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
        
      }

      if ($('#ucChart').length ){ 
			  
        var ctx = document.getElementById("ucChart");
        ucChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
              label: '# of Short Entries',
              backgroundColor: "#26B99A",
              data: [51, 30, 40, 28, 92, 50, 45]
            }, {
              label: '# of Long Entries',
              backgroundColor: "#03586A",
              data: [41, 56, 25, 48, 72, 34, 12]
            }]
          },

          options: {
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{
                  stacked: true,
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });        
      }
    
    // pie charts
    if ($('#professionpieChart').length ){
				  
      var ctx = document.getElementById("professionpieChart");
      var data = {
      datasets: [{
        data: [120, 50, 140, 180, 100],
        backgroundColor: [
        "#455C73",
        "#9B59B6",
        "#BDC3C7",
        "#26B99A",
        "#3498DB"
        ],
        label: 'My dataset' // for legend
      }],
      labels: [
        "Dark Gray",
        "Purple",
        "Gray",
        "Green",
        "Blue"
      ]
      };

      var professionpieChart = new Chart(ctx, {
      data: data,
      type: 'pie',
      otpions: {
        legend: false
      }
      });
      
    }

    $('#allVersBtn').click();

    $("#shortVBtn").click(function() {
     
    });

    $("#longVBtn").click(function() {

    });

    var prof

    // get dates from records
    records.forEach((entries,index) => {
      dates[index] = moment(entries.submission, "YYYY-MM-DD");

      
      // get profession + species

    });

    init_piepicker();

})

var mybarChart;
var dates = {};

var pickboy;
var daysBetween;
function getDaterange(picker, flag)
{
    // flag sets both or either species
    if (flag == -1)
    {
      mybarChart = bothChart;
    }
    else if (flag == 0)
    {
      mybarChart = ucChart;
    }
    else if (flag == 1)
    {
      mybarChart = carChart;
    }
    
    // get start and end date, work out best way of splitting data.
    console.log("hello ", picker.startDate.format('MMMM D, YYYY'), flag);
    pickboy = picker;
    daysBetween = Math.round(Math.abs(picker.endDate - picker.startDate)/(24*60*60*1000));

    var timeInterval = "";
    var intervalFormat = "";

    // if more than 30, split into months.
    if (daysBetween < 32)
    {
      timeInterval = "day"
      intervalFormat = "DD-MMMM"
    }
    else
    {
      timeInterval = "month"
      intervalFormat = "MMMM-YY"
    }

    var intervalLabel = [];
    
    var graphRaw = {};

    var tempDate = moment(picker.startDate); // copy startDate
    tempDate.subtract(1, timeInterval); // to include start date
    
    // get all months in selection
    do
    {
        tempDate.add(1, timeInterval).endOf(timeInterval);
        var monthName = tempDate.format(intervalFormat);
        intervalLabel.push(monthName);
        graphRaw[monthName] = []; // add an empty list for data
    }
    while( tempDate < picker.endDate )

    //console.log(months);

    for (date in dates)
    {
      var speciesCheck;
      if (flag == -1) // don't check for species so make check = flag
      {
        speciesCheck = flag;
      }
      else
      {
        speciesCheck = records[date].species;
      }

      if (dates[date].isBetween(picker.startDate, picker.endDate, 'days', '[]') && speciesCheck == flag){
        console.log(dates[date].format('MMMM-YY'), " is WITHIN time");
        graphRaw[dates[date].format(intervalFormat)].push(records[date].type);
      }
      
    }

    var graphShortData = [];
    var graphLongData = [];

    // change bar chart data
    for (mon of intervalLabel)
    {
      console.log(mon);
      // for each type within month dict, check for 0 and 1 and add to list
      var short = 0;
      var long = 0;
      // sum types 
      for (type of graphRaw[mon])
      {
        if (type == 0){
          short++;
          //console.log("short boy");
          }
          else{
          //console.log("long boy");
          long++;
          }
      }

      // add to graph data vars
      graphShortData.push(short);
      graphLongData.push(long);
    }

    // update graph
    mybarChart.data.labels = intervalLabel;
    mybarChart.data.datasets[0].data = graphShortData;
    mybarChart.data.datasets[1].data = graphLongData;
    mybarChart.update();

}


function init_piepicker() {
  console.log("pie picker");
  if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
  if( $('#piepicker').length === 0){ return; }
  console.log('init_piepicker');

  var cb = function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
    $('#piepicker span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  };

  var optionSet1 = {
      startDate: '11/16/2017',
      endDate: moment(),
      minDate: '11/16/2017',
      maxDate: '12/31/2100',
      dateLimit: {
      days: 720
      },
      showDropdowns: true,
      showWeekNumbers: true,
      timePicker: false,
      timePickerIncrement: 1,
      timePicker12Hour: true,
      ranges: {
      'All Time': ['11/16/2017', moment()],
      'This Season': [moment().startOf('year').subtract(2, 'month').add(1, 'year'), moment().startOf('year').add(3, 'month').add(1, 'year').endOf('month')],
      'Last Season': [moment().startOf('year').subtract(2, 'month').subtract(1, 'year'), moment().startOf('year').add(3, 'month').endOf('month')],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'This Year' : [moment().startOf('year'), moment()],
      'Last Year' : [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
      },
      opens: 'left',
      buttonClasses: ['btn btn-default'],
      applyClass: 'btn-small btn-primary',
      cancelClass: 'btn-small',
      format: 'DD/MM/YYYY',
      separator: ' to ',
      locale: {
      applyLabel: 'Submit',
      cancelLabel: 'Clear',
      fromLabel: 'From',
      toLabel: 'To',
      customRangeLabel: 'Custom',
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstDay: 1
      }
  };

  $('#piepicker').daterangepicker(optionSet1, cb);

  getDatePie($('#piepicker').data('daterangepicker'), -1);

  $('#piepicker span').html($('#piepicker').data('daterangepicker').startDate.format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

  $('#piepicker').on('show.daterangepicker', function() {
    console.log("show event fired");
  });
  $('#piepicker').on('hide.daterangepicker', function() {
    console.log("hide event fired");
  });
  $('#piepicker').on('apply.daterangepicker', function(ev, picker) {
      console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
      // fire graph re-draw here. 
      getDatePie(picker, -1);
      // array for date values between 	[gd(2012, 1, 1), 17], year mn day
  });
  $('#piepicker').on('cancel.daterangepicker', function(ev, picker) {
    console.log("cancel event fired");
  });

  $('#destroy').click(function() {
    $('#piepicker').data('daterangepicker').remove();
  });

}

function getDatePie(picker, flag)
{
  // get start and end date, work out best way of splitting data.
  console.log("hello ", picker.startDate.format('MMMM D, YYYY'), flag);
  pickboy = picker;
  daysBetween = Math.round(Math.abs(picker.endDate - picker.startDate)/(24*60*60*1000));


  // list of numbers by profession
  var profSelect = {};
  for (date in dates)
  {
    if (dates[date].isBetween(picker.startDate, picker.endDate, 'days', '[]')){
      console.log(dates[date].format('MMMM-YY'), " is WITHIN time");
      profSelect[dates[date]].push(records[date].prof);
     // graphRaw[dates[date].format(intervalFormat)].push(records[date].type);
    }
  }

}

