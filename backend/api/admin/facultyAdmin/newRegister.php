<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");
 
include '../../../config//databse.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

// If connection fails, return JSON error and stop execution
if (!$conn) {
    echo json_encode(["status" => 0, "message" => "Database connection failed."]);
    exit(); // Stop further execution
}

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {

    case 'GET':
        
    }


?>