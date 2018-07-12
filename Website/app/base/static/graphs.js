$(document).ready(function() {
    
    console.log("graphs")

    if ($('#mybarChart').length ){ 
			  
        var ctx = document.getElementById("mybarChart");
        mybarChart = new Chart(ctx, {
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
function getDaterange(picker){
    // get start and end date, work out best way of splitting data.
    console.log("hello ", picker.startDate.format('MMMM D, YYYY'));
    pickboy = picker;
    daysBetween = Math.round(Math.abs(picker.endDate - picker.startDate)/(24*60*60*1000));

    // if more than 30, split into months.
    if (daysBetween < 30)
    {
        return;
    }

    var months = [];
    
    var graphRaw = {};

    //endDate.subtract(1, "month"); //Substract one month to exclude endDate itself

    var month = moment(picker.startDate); // copy startDate
    month.subtract(1, "month"); // to include start date
    
    // get all months in selection
    while( month < picker.endDate )
    {
        month.add(1, "month");
        var monthName = month.format('MMMM-YY');
        months.push(monthName);
        graphRaw[monthName] = []; // add an empty list for data
    }

    console.log(months);

    for (date in dates)
    {
      if (dates[date].isBetween(picker.startDate, picker.endDate, 'days', '[]') ){
        console.log(dates[date].format('MMMM-YY'), " is WITHIN time");
        graphRaw[dates[date].format('MMMM-YY')].push(records[date].type);
      }
    }

    var graphShortData = [];
    var graphLongData = [];

    // change bar chart data
    for (mon of months)
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
    mybarChart.data.labels = months;
    mybarChart.data.datasets[0].data = graphShortData;
    mybarChart.data.datasets[1].data = graphLongData;
    mybarChart.update();

}

