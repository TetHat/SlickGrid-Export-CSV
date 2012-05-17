<?php
/*
 * Make sure you link this file up to the table-to-csv.js file with the proper file path.
 * This is what gets called on to create the Excel file after the JS gets the data.
 */
    header("Content-type: application/vnd.ms-excel; name='excel'");
    header("Content-Disposition: filename=export.csv");
    header("Pragma: no-cache");
    header("Expires: 0");

    print $_REQUEST['exportdata'];

?>
