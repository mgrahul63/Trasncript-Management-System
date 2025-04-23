<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");
 
include '../../config//databse.php';
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
        $type = isset($_GET['type']) ? $_GET['type'] : '';
        try {
            if ($type === 'new') {
                $query = $conn->prepare("SELECT * FROM student_account WHERE action = :action");
                $action = 'pending';
            } elseif ($type === 'old') {
                $query = $conn->prepare("SELECT * FROM student_account WHERE action = :action");
                $action = 'approved';
            } else {
                echo json_encode(["status" => 0, "message" => "Invalid type parameter"]);
                exit();
            }

            $query->bindParam(':action', $action, PDO::PARAM_STR);
            $query->execute();

            $students = $query->fetchAll(PDO::FETCH_ASSOC);

            if (empty($students)) {
                echo json_encode(["status" => 1, "data" => []]);
            } else {
                echo json_encode(["status" => 1, "data" => $students]);
            }
        } catch (Exception $e) {
            echo json_encode(["error" => "Database query failed.", "message" => $e->getMessage()]);
        }
    break; // Add this to prevent falling through to the POST case


    case 'POST':
            // Get the "type" parameter from the request (optional)
            $type = isset($_GET['type']) ? $_GET['type'] : '';
    
            // Assuming you're receiving a JSON payload with the studentId (or registerId)
            $data = json_decode(file_get_contents("php://input"), true);
    
            // Check if type is 'approve' and if studentId and registerId are provided
            if ($type === 'approved' && isset($data['studentId']) && isset($data['registerId'])) {
                $roll = $data['studentId'];
                $reg = $data['registerId'];
    
               
                // Proceed to update the action column to 'approved'
                try {
                    // Prepare the UPDATE query to change the action value
                    $query = $conn->prepare("UPDATE student_account SET action = :action WHERE studentId = :studentId AND registerId = :registerId");
                    $query->bindParam(':action', $action, PDO::PARAM_STR);
                    $query->bindParam(':studentId', $roll, PDO::PARAM_INT);
                    $query->bindParam(':registerId', $reg, PDO::PARAM_INT);
    
                    $action = 'approved'; // Set the action to 'approved'
    
                    // Execute the query
                    $query->execute();
    
                    // Check if the update was successful
                    if ($query->rowCount() > 0) {
                        echo json_encode(["message" => "Record successfully updated to approved."]);
                    } else {
                        echo json_encode(["error" => "No record found to update."]);
                    }
                } catch (Exception $e) {
                    echo json_encode(["error" => "Database update failed.", "message" => $e->getMessage()]);
                }
            } else if ($type === 'rejected' && isset($data['studentId']) && isset($data['registerId'])){
                $roll = $data['studentId'];
                $reg = $data['registerId'];
    
               
                // Proceed to update the action column to 'approved'
                try {
                    // Prepare the UPDATE query to change the action value
                    $query = $conn->prepare("UPDATE student_account SET action = :action WHERE studentId = :studentId AND registerId = :registerId");
                    $query->bindParam(':action', $action, PDO::PARAM_STR);
                    $query->bindParam(':studentId', $roll, PDO::PARAM_INT);
                    $query->bindParam(':registerId', $reg, PDO::PARAM_INT);
    
                    $action = 'rejected'; // Set the action to 'approved'
    
                    // Execute the query
                    $query->execute();
    
                    // Check if the update was successful
                    if ($query->rowCount() > 0) {
                        echo json_encode(["message" => "Record successfully deleted."]);
                    } else {
                        echo json_encode(["error" => "No record found to update."]);
                    }
                } catch (Exception $e) {
                    echo json_encode(["error" => "Database update failed.", "message" => $e->getMessage()]);
                }
            }
            
            else {
                echo json_encode(["error" => "Invalid data or type."]);
            }
    break;


    default:
        echo json_encode(["error" => "Invalid request method"]);
    break;
}
?>
