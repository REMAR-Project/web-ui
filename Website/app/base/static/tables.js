$(document).ready(function() {

    console.log("tables")

    $('#allVersBtn').click(showAll);

    $("#shortVBtn").click(function() {
        $.fn.dataTable.ext.search.pop(); // pop first to get rid of any filters
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                return (data[1] === "Short");
            });
        totalDataTable.draw();
        var toHide = [ 1, 9, 10, 11, 12, 13, 14, 15, 16]
        totalDataTable.columns().visible(true);
        for(ind of toHide)
        {
            totalDataTable.column(ind).visible(false);
        }
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
    });
      
})

function showAll(){
    totalDataTable.columns().visible(true); // show all columns
    $.fn.dataTable.ext.search.pop();
    totalDataTable.draw();
}

