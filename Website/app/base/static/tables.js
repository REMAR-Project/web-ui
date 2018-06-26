$(document).ready(function() {

    console.log("tables")

    $('#settingsBtn').click(buttonDude);
})

function buttonDude(){
	coolTable.column(1).visible(false);
}

