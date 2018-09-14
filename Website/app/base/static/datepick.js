var dsetting;
var dcolumns;
var userTableLabels = [];

$(document).ready(function() {

    dcolumns =Object.keys(userdata).map(x => ({ uuid:x, card:userdata[x].card, ucid:userdata[x].ucid}));

    dsetting = {
        dom: "Bfrtip",						
        buttons: [
        {
            extend: "copy",
            className: "btn-sm"
        },
        {
            extend: "csv",
            className: "btn-sm"
        },
        {
            extend: "excel",
            className: "btn-sm"
        },
        {
            extend: "pdfHtml5",
            className: "btn-sm"
        },
        {
            extend: "print",
            className: "btn-sm"
        },
        {
            extend: "colvis",
            className: "btn-sm",
            text: "Column Visibility"
        },
        {
            extend: "colvisGroup",
            className: "btn-sm",
            text: 'Show All Columns',
            show: ':hidden'
        },
        {
            extend: "colvisGroup",
            className: "btn-sm",
            text: 'Hide All Columns',
            hide: ['*']
        }								
        ],
        responsive: true,
        columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: -1 },
            { responsivePriority: 3, targets: -2 }
        ],
        columns: userTableLabels,

    }

    init_daterangepicker_user();
});

function init_data_structures() {

}


function init_daterangepicker_user() {
    console.log("here");
    if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
    if( $('#reportrange_user').length === 0){ return; }
    console.log('init_daterangepicker_user');

    var cb = function(start, end, label) {
      console.log(start.toISOString(), end.toISOString(), label);
      $('#reportrange_user span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
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

    $('#reportrange_user').daterangepicker(optionSet1, cb);

    getDaterange($('#reportrange_user').data('daterangepicker'), 1);

    $('#reportrange_user span').html($('#reportrange_user').data('daterangepicker').startDate.format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

    $('#reportrange_user').on('show.daterangepicker', function() {
      console.log("show event fired");
    });
    $('#reportrange_user').on('hide.daterangepicker', function() {
      console.log("hide event fired");
    });
    $('#reportrange_user').on('apply.daterangepicker', function(ev, picker) {
        console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
        // fire graph re-draw here. 
        getDaterange(picker, 1);
        // array for date values between 	[gd(2012, 1, 1), 17], year mn day
    });
    $('#reportrange_user').on('cancel.daterangepicker', function(ev, picker) {
      console.log("cancel event fired");
    });

    $('#options1').click(function() {
      $('#reportrange_user').data('daterangepicker').setOptions(optionSet1, cb);
    });

    $('#options2').click(function() {
      $('#reportrange_user').data('daterangepicker').setOptions(optionSet2, cb);
    });

    $('#destroy').click(function() {
      $('#reportrange_user').data('daterangepicker').remove();
    });

}

var datelist = [];

function getDaterange(picker, flag)
{
    // get start and end date, work out best way of splitting data.
    console.log("hello ", picker.startDate.format('MMMM D, YYYY'), flag);
    pickboy = picker;
    daysBetween = Math.round(Math.abs(picker.endDate - picker.startDate)/(24*60*60*1000));

    console.log("days", daysBetween);
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
    
    var tableRaw = {};

    console.log("init ", tableRaw);
    var tempDate = moment(picker.startDate); // copy startDate
    tempDate.subtract(1, timeInterval); // to include start date
    
    // get all months in selection
    do
    {
        tempDate.add(1, timeInterval).endOf(timeInterval);
        var monthName = tempDate.format(intervalFormat);
        intervalLabel.push(monthName);
        tableRaw[monthName] = 0; // initialise a count 
    }
    while( tempDate < picker.endDate )

    //console.log(months);

    var newCols = [];

    for (user in userdata)
    {
        //reset graph temp var
        for(lbl in intervalLabel)
        {
            tableRaw[intervalLabel[lbl]] = 0;
            //onsole.log("resetting ", lbl);
        }
        
        console.log("RESET ",  JSON.stringify(tableRaw));

    //   if (flag == -1) // don't check for species so make check = flag
    //   {
    //     speciesCheck = flag;
    //   }
    //   else
    //   {
    //     speciesCheck = records[date].species;
    //   }

    console.log(userdata[user].card);

        // for cards
        for (d in userdata[user].card)
        {

            var dateString = userdata[user].card[d]; // in this format "YYYY-MM-DD HH:mm:ss"

            var dateStr = dateString[5] + dateString[6] + dateString[4] + dateString[8] + dateString[9] + dateString[7] + dateString[0] + dateString[1] + dateString[2] + dateString[3];

            //console.log(dateStr);

            var dateTime = new Date(dateStr);

            var date = moment(dateTime);
            
            //datelist.push(dateTime);
           // moment d =  date;
            if (date.isBetween(picker.startDate, picker.endDate, 'days', '[]')){ //&& speciesCheck == flag){
                console.log(date.format('MMMM-YY'), " is WITHIN time");
                tableRaw[date.format(intervalFormat)]++;
            }
        }
        console.log("data ", user, JSON.stringify(tableRaw));
    //console.log("printing col", columns);

    //dcolumns[user] = graphRaw;

    var totalSel_ = 0;
    var allTime_ = 0;
    for (element in tableRaw)
    {
        totalSel_ += tableRaw[element];
    }

    newCols.push({uuid:user, ...tableRaw, totalSelected:totalSel_, allTime:allTime_});

    
    }

    userTableLabels.push({data:"uuid", title:"User ID"});

    console.log("printing col", newCols);
    // grab headings 
    for (mon of intervalLabel)
    {
        // month and value 
        userTableLabels.push({data:mon, title:mon});
    }

    // add total columns
    userTableLabels.push({data:"totalSelected", title:"Total Submissions Within Selected Time Period"});
    userTableLabels.push({data:"allTime", title:"Total Submissions All Time"});

    // redraw table
    if ($("#useratable-buttons").length)
    {   
        userDataTable =	$("#useratable-buttons").DataTable(dsetting);
    }
    else
    {

    }
    userDataTable.clear().rows.add(newCols);
    userDataTable.draw();

}