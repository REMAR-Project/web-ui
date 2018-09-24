
$(document).ready(function() {

    console.log("tables")

    //totalDataTable.column(18).bSearchable = false

       // Setup - add a text input to each footer cell
    $('#datatable-buttons thead th').each( function () {
        var title = $(this).text();
        if (title !== ""){
        var oldhtml = $(this).html();
        $(this).html( oldhtml + '<input type="text" placeholder="Search '+title+'" />' );
        }
    } );
      
})

function changeSelector()
{

    var selectedValue = selectVers.options[selectVers.selectedIndex].value;
    console.log("changed", selectedValue);

    if (selectedValue == "allVersBtn")
    {
        showAll();
    }
    else if (selectedValue == "shortVBtn")
    {
        showShort();
    }
    else if (selectedValue == "longVBtn")
    {
        showLong();
    }
}


function showAll(){
    totalDataTable.columns().visible(true); // show all columns
    $.fn.dataTable.ext.search.pop();
    totalDataTable.draw();
    $("#alldataTableLBL").html("ALL");
}

function showShort()
{
    $.fn.dataTable.ext.search.pop(); // pop first to get rid of any filters
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            return (data[2] === "Short");
        });
    totalDataTable.draw();
    var toHide = [ 1, 7, 8, 9, 10, 11, 14, 15, 17];
    totalDataTable.columns().visible(true);
    for(ind of toHide)
    {
        totalDataTable.column(ind).visible(false);
    }
    $("#alldataTableLBL").html("SHORT");
}

function showLong()
{
    
    $.fn.dataTable.ext.search.pop(); // pop first to get rid of filters
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            return (data[2] === 'Long');
        });
    totalDataTable.draw();
    totalDataTable.columns().visible(true);
    totalDataTable.column(1).visible(false);
    $("#alldataTableLBL").html("LONG");

}