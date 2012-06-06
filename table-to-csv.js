// JavaScript Document
// http://www.kunalbabre.com/projects/table2CSV.php
jQuery.fn.table2CSV = function(options) {
    var options = jQuery.extend({
        separator: ',',
        header: [],
        delivery: 'popup' // popup, value
    },
    options);

    var csvData = [];
    var headerArr = [];
    var el = this;

    //header
    var numCols = options.header.length;
    var headerRow = []; // construct header avalible array
	var numArray = [];
	var count = 0;
    if (numCols > 0) {
        for (var i = 0; i < numCols; i++) {
            headerRow[headerRow.length] = options.header[i];
        }
    } else {
		// This goes through the columns that are created from SlickGrid
		// Remember to change the variable accordingly to how you have named it!
		// The grid.getColumns is only needed if you want this to adjust when you show/hide certain columns on the page.
		var tmpColumns = grid.getColumns();
		for (var key in tmpColumns) {    
			var obj = tmpColumns[key];  
			// This goes through each property of the columns (id, name, width, etc.)  
			for (var prop in obj) {       
				//alert(prop + " = " + obj[prop]);
				// This is choosing the Name property from each column. obj[prop] returns the value of that property.
				if (prop == "name") {
					// This is what places the returned values into the headerRow array.
					headerRow[headerRow.length] = obj[prop];
				}
				if (prop == "id") {
					// This is choosing the ID property from each column. Then assigning them the value of what column it will be in.
					numArray[obj[prop]] = count++;
					//alert(numArray);	
				}
			}
			
		}
        /*
		THIS IS ONLY IF IT IS AN HTML CODED TABLE, NOT FOR DYNAMIC TABLES
		
		$(el).filter(':visible').find('th').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });*/
    }
	// This implements the row2CSV funciton on the headerRow, placing each returned value from headerRow into an Excel Cell.
    row2CSV(headerRow);
    
	// This goes through the variable that contains the values in each cell of the SlickGrid table.
	// loader.data[key] contains the values of each entire row (not separate cells).
	// Make sure you change loader.data to the proper variable you are using to store all of your data.
	for (var key in loader.data) {    
		var row = loader.data[key];
		var tmpRow = [];
		// This goes through each Name value from the columns, and matches it with the correct keys in the loader.data variable.
		for ( var name in numArray ) {
			// numArray = ['name': 'value' ]
			// This picks out the keys that match up with the column names, and places them in the tmpRow array.
			// This way any excess keys in the loader.data variable don't get put into the file, only necessary values.
			tmpRow[numArray[name]] = row[name];
		}
		// This implements the row2CSV funciton on the tmpRow array, placing each returned value from tmpRow into an Excel Cell.
		row2CSV(tmpRow);
	}
    /*
	THIS IS ONLY IF IT IS AN HTML CODED TABLE, NOT FOR DYNAMIC TABLES
	
	$(el).find('tr').each(function() {
        var tmpRow = [];
        $(this).filter(':visible').find('td').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });
        row2CSV(tmpRow);
    });*/
    if (options.delivery == 'popup') {
        var mydata = csvData.join('\n');
        return popup(mydata);
    } else {
        var mydata = csvData.join('\n');
        return mydata;
    }

    function row2CSV(tmpRow) {
        var tmp = tmpRow.join('') // to remove any blank rows
        // alert(tmp);
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            csvData[csvData.length] = mystr;
        }
    }
    /*
	This is also only needed for HTML coded tabls, not for dynamic
	function formatData(input) {
        // replace " with â€œ
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, "â€œ");
        //HTML
        var regexp = new RegExp(/\<[^\<]+\>/g);
        var output = output.replace(regexp, "");
        if (output == "") return '';
        return '"' + output + '"';
    }*/
	
	// This is the function that creates the Excel file. Make sure you link this up to the proper path of the included export.php file, otherwise it will not create the Excel file.
    function popup(data) {
       $("body").append('<form id="exportform" action="export.php" method="post"><input type="hidden" id="exportdata" name="exportdata" /></form>');
    $("#exportdata").val(data);
    $("#exportform").submit().remove();
    return true;
    }
};