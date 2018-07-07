$(document).ready(function() {

    console.log("graphs")

    $('#allVersBtn').click(showAll);

    $("#shortVBtn").click(function() {
        $.fn.dataTable.ext.search.pop(); // pop first to get rid of any filters
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                return (data[1] == '0');
            });
        coolTable.draw();
        var toHide = [ 1, 9, 10, 11, 12, 13, 14, 15, 16]
        coolTable.columns().visible(true);
        for(ind of toHide)
        {
            coolTable.column(ind).visible(false);
        }
    });

    $("#longVBtn").click(function() {
        $.fn.dataTable.ext.search.pop(); // pop first to get rid of filters
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex ) {
                return (data[1] == '1');
            });
        coolTable.draw();
        coolTable.columns().visible(true);
        coolTable.column(1).visible(false);
    });
      
})

function getDaterange(picker){
    coolTable.columns().visible(true); // show all columns
    $.fn.dataTable.ext.search.pop();
    coolTable.draw();
}

