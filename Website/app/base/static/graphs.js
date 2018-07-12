$(document).ready(function() {

    console.log("graphs")

    if ($('#mybarChart').length ){ 
			  
        var ctx = document.getElementById("mybarChart");
        var mybarChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
              label: '# of Votes',
              backgroundColor: "#26B99A",
              data: [51, 30, 40, 28, 92, 50, 45]
            }, {
              label: '# of Votes',
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
      
})

var pickboy;
var daysBetween;
function getDaterange(picker){
    // get start and end date, work out best way of splitting data.
    console.log("hello ", picker.startDate.format('MMMM D, YYYY'));
    pickboy = picker;
    daysBetween = Math.round(Math.abs(picker.endDate - picker.startDate)/(24*60*60*1000));

    // if more than 30, split into months.
    if (daysBetween > 30)
    {
        
    }

    var months = [];
    //endDate.subtract(1, "month"); //Substract one month to exclude endDate itself

    var month = moment(picker.startDate); // copy startDate
    month.subtract(1, "month"); // to include start date
    while( month < picker.endDate ) {
        month.add(1, "month");
        months.push(month.format('MMMM-YY'));
    }

console.log(months);

    var dates = [];

    for (entries of records)
    {
        dates.push(moment(Date.parse(entries.submission)));
    }

    console.log(dates);
    
}

