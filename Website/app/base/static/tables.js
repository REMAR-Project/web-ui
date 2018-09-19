$(document).ready(function() {

    console.log("tables")

    //totalDataTable.column(18).bSearchable = false;

    $('#allVersBtn').click(showAll);

    $("#shortVBtn").click(function() {
        $.fn.dataTable.ext.search.pop(); // pop first to get rid of any filters
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                return (data[1] === "Short");
            });
        totalDataTable.draw();
        var toHide = [ 1, 7, 8, 9, 10, 11, 14, 15, 17];
        totalDataTable.columns().visible(true);
        for(ind of toHide)
        {
            totalDataTable.column(ind).visible(false);
        }
        $("#alldataTableLBL").html("SHORT");
    });

    $("#longVBtn").click(function() {
        $.fn.dataTable.ext.search.pop(); // pop first to get rid of filters
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                return (data[1] === 'Long');
            });
        totalDataTable.draw();
        totalDataTable.columns().visible(true);
        totalDataTable.column(1).visible(false);
        $("#alldataTableLBL").html("LONG");


    });
      
})

function showAll(){
    totalDataTable.columns().visible(true); // show all columns
    $.fn.dataTable.ext.search.pop();
    totalDataTable.draw();
    $("#alldataTableLBL").html("ALL");
}