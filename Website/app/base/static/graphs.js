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

      pieplug = {	afterDraw: function(professionpieChart) {
        if (professionpieChart.data.datasets[0].data.length === 0) {

          console.log("NO DATA HERE");
          // No data is present
          var ctx = professionpieChart.chart.ctx;
          var width = professionpieChart.chart.width;
          var height = professionpieChart.chart.height
          professionpieChart.clear();
          
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = "16px normal 'Helvetica Nueue'";
          ctx.fillText('No data to display', width / 2, height / 2);
          ctx.restore();
        }
      }
    };
    
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
        "#E91E63",
        "#D35400",
        "#3498DB",
        "#F4D03F",
        "#E74C3C",
        "#212F3D",
        "#239B56",
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

      professionpieChart = new Chart(ctx, {
      data: data,
      type: 'pie'
      });
      
    }

    $('#allVersBtn').click();

    $("#shortVBtn").click(function() {
     
    });

    $("#longVBtn").click(function() {

    });

    // get dates from records
    records.forEach((entries,index) => {
      dates[index] = moment(entries.submission, "YYYY-MM-DD");

      
      // get profession + species

    });

    init_piepicker();

})

var pieplug;
var professionpieChart;
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

  var profSelect = {};

  // list of numbers by profession

  for (date in dates)
  {
    if (dates[date].isBetween(picker.startDate, picker.endDate, 'days', '[]')){
      console.log(dates[date].format('MMMM-YY'), " is WITHIN time");
      
      // check if it contains other
      var prof = records[date].job;

      var profAnswers = {
        "• I catch crabs and depend on them for my living": "Dependent",
        "• I catch crabs only occasionally for my own consumption": "Own Consumption",
        "• I work with crab meat processing": "Farmer",
        "• I work with crab commercialization": "Trader",
        "• I am a local villager and do not normally catch mangrove crabs": "Local",
        "• I work for ICMBio": "ICMBio",
        "• I work for IBAMA": "IBAMA",
        "• I work in the city hall": "City Hall",
        "• I am a researcher": "Researcher",
        "• I do not want to specify": "Not specified",
        "• Pego caranguejo-uçá ou guaiamum e dependo deste recurso para viver": "Dependent",
        "• Pego caranguejo-uçá ou guaiamum apenas ocasionalmente para consumo": "Own Consumption",
        "• Sou beneficiador de carne de caranguejo-uçá": "Farmer",
        "• Sou comerciante de caranguejo-uçá ou guaiamum": "Trader",
        "• Sou morador local e normalmente não pego caranguejos ou guaiamuns": "Local",
        "• Sou funcionário do ICMBio": "ICMBio",
        "• Sou funcionário do IBAMA": "IBAMA",
        "• Sou servidor da Prefeitura": "City Hall",
        "• Sou pesquisador": "Researcher",
        "• Não quero informar": "Not specified",
      }

      //console.log("job", typeof(prof));
      if (typeof(prof) !== "string")
      {
        console.log("other");
        prof = "Other";
      }
      else
      {
        prof = profAnswers[prof];
      }   

      if (profSelect[prof] === undefined)
      { 
        profSelect[prof] = 1;
      } 
      else
      {
        profSelect[prof] += 1;
      }
    }
  }

  var newLabels = Object.keys(profSelect);
  professionpieChart.data.labels = newLabels;

  var data = newLabels.map((key)=>{return profSelect[key]});

  professionpieChart.data.datasets[0].data = data;
  professionpieChart.data.datasets[0].labels = newLabels;
  professionpieChart.update();

  if (professionpieChart.data.datasets[0].data.length === 0)
  {
    console.log("no data");
    $("#professionpieChart").hide();
    $("#nodata").show();
  }
  else
  {
    $("#professionpieChart").show();
    $("#nodata").hide();
  }


}

