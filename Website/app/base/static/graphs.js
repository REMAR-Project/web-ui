$(document).ready(function() {
    
    console.log("graphs")

    if ($('#bothChart').length ){ 
			  
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

      if ($('#carChart').length ){ 
			  
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
        

    $('#allVersBtn').click();

    $("#shortVBtn").click(function() {
     
    });

    $("#longVBtn").click(function() {

    });

    // get dates from records
    records.forEach((entries,index) => {
      dates[index] = moment(entries.submission, "YYYY-MM-DD");
    });

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

