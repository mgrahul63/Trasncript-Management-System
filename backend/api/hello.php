<?php
// Including the database connection
include '../config/databse.php';

    // Creating a new instance of the DbConnect class
    $objDb = new DbConnect();
    $conn = $objDb->connect();
 
    // Displaying a simple message
    echo "Database connection successful!";
?>
