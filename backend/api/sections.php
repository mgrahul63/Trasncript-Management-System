<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json"); 

include '../config/databse.php';

// Create a new instance of DbConnect class to establish the database connection
$objDb = new DbConnect;
$conn = $objDb->connect();

// Check if the connection is successful
if (!$conn) {
    echo json_encode(["error" => "Failed to connect to the database."]);
    exit; // Stop further execution if the connection fails
}

// Define the HTTP method being used
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    
    case 'GET':
        try {
            // Retrieve latest 4 unique session_id values
            $sql = "SELECT * FROM sessions ";
            
            $stmt = $conn->prepare($sql);
            $stmt->execute();
        
            // Fetch all results
            $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
            // Return JSON response
            echo json_encode(["status" => 1, "data" => $sections]);
        } catch (PDOException $e) {
            echo json_encode(["status" => 0, "message" => "Error fetching data: " . $e->getMessage()]);
        }
    break;        
    
    case 'POST':
        // Insert new section
        // Get the data sent in the request body (assumed to be JSON)
        $data = json_decode(file_get_contents("php://input"));

        // Prepare the SQL query to insert the new section
        $sql = "INSERT INTO sections (section_id, department_id, faculty_id, created_at) 
                VALUES (:section_id, :department_id, :faculty_id, CURRENT_TIMESTAMP)";
        $stmt = $conn->prepare($sql);
        
        // Bind the parameters from the input data
        $stmt->bindParam(':section_id', $data->section_id);
        $stmt->bindParam(':department_id', $data->department_id);
        $stmt->bindParam(':faculty_id', $data->faculty_id);
        
        // Execute the query and check if it was successful
        if ($stmt->execute()) {
            echo json_encode(["message" => "Section added successfully."]);
        } else {
            echo json_encode(["error" => "Failed to insert the section."]);
        }
        break;

    case 'PUT':
        // Update an existing section
        // Get the data sent in the request body (assumed to be JSON)
        $data = json_decode(file_get_contents("php://input"));

        // Prepare the SQL query to update the section
        $sql = "UPDATE sections SET department_id = :department_id, faculty_id = :faculty_id 
                WHERE section_id = :section_id";
        $stmt = $conn->prepare($sql);

        // Bind the parameters from the input data
        $stmt->bindParam(':section_id', $data->section_id);
        $stmt->bindParam(':department_id', $data->department_id);
        $stmt->bindParam(':faculty_id', $data->faculty_id);

        // Execute the query and check if it was successful
        if ($stmt->execute()) {
            echo json_encode(["message" => "Section updated successfully."]);
        } else {
            echo json_encode(["error" => "Failed to update the section."]);
        }
        break;

    case 'DELETE':
        // Delete a section
        // Get the section_id from the query string
        if (isset($_GET['section_id'])) {
            $section_id = $_GET['section_id'];
            
            // Prepare the SQL query to delete the section
            $sql = "DELETE FROM sections WHERE section_id = :section_id";
            $stmt = $conn->prepare($sql);
            
            // Bind the section_id parameter
            $stmt->bindParam(':section_id', $section_id);
            
            // Execute the query and check if it was successful
            if ($stmt->execute()) {
                echo json_encode(["message" => "Section deleted successfully."]);
            } else {
                echo json_encode(["error" => "Failed to delete the section."]);
            }
        } else {
            echo json_encode(["error" => "section_id parameter is required."]);
        }
        break;

    default:
        // Handle unsupported methods
        echo json_encode(["error" => "Method not allowed."]);
        break;
}

