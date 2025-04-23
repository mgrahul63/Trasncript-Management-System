<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include '../config/databse.php';
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
        $type = $_GET['type'] ?? '';
        $department_id = $_GET['department_id'];
        $faculty_id = $_GET['faculty_id'];

         // search query
         $searchQuery = $_GET['searchQuery'] ?? '';
         $department = $_GET['department'] ?? '';
    
        if (empty($type) || empty($department_id) || empty($faculty_id)) {
            echo json_encode(["status" => 0, "error" => "Missing required parameters."]);
            exit();
        }
     
    
        // Set action based on type
        if ($type === 'new') {
            $action = 'pending';
        } elseif ($type === 'old') {
            $action = 'approved';
        } else {
            echo json_encode(["status" => 0, "error" => "Invalid type parameter"]);
            exit();
        }

          // First, get the departmentName
          $query1 = $conn->prepare("SELECT name FROM departments WHERE department_id = :department_id AND faculty_id = :faculty_id");
          $query1->bindParam(':department_id', $department_id, PDO::PARAM_STR);  
          $query1->bindParam(':faculty_id', $faculty_id, PDO::PARAM_STR);
          $query1->execute();
      
          $departName = $query1->fetch(PDO::FETCH_ASSOC);

          if ($departName) {
            $departmentName = $departName['name'];

             // Build base query
             $sql = "SELECT * FROM student_info WHERE action = :action AND departmentName = :departmentName";

             // Add search filters
             if (!empty($searchQuery)) {
                $sql .= " AND (studentId LIKE :searchQuery OR registerId LIKE :searchQuery)";
            } elseif (!empty($department)) {
                $sql .= " AND departmentName LIKE :department";
            }
    
            $query = $conn->prepare($sql);
    
            // Bind base parameter
            $query->bindParam(':departmentName', $departmentName, PDO::PARAM_STR);
            $query->bindParam(':action', $action, PDO::PARAM_STR);
    
            // Bind search filters if present
            if (!empty($searchQuery)) {
                $searchTerm = '%' . $searchQuery . '%';
                $query->bindParam(':searchQuery', $searchTerm, PDO::PARAM_STR);
            } elseif (!empty($department)) {
                $searchDept = '%' . $department . '%';
                $query->bindParam(':department', $searchDept, PDO::PARAM_STR);
            }
    
            $query->execute();
            $students = $query->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(["status" => 1, "data" => $students ?: []]);
          } else {
            echo json_encode(["status" => 0, "error" => "Database query failed.", "message" => $e->getMessage()]);
            }
    break;
    
    case 'POST':
        // Get the "type" parameter from the request (approve/reject)
        $type = isset($_GET['type']) ? $_GET['type'] : '';
    
        // Get JSON payload
        $data = json_decode(file_get_contents("php://input"), true);
    
        // Validate input
        if (!in_array($type, ['approved', 'rejected']) || !isset($data['studentId'], $data['registerId'])) {
            echo json_encode(["status" => 0, "error" => "Invalid request."]);
            exit;
        }
    
        $roll = $data['studentId'];
        $reg = $data['registerId'];
        
        try {
            // Start transaction
            $conn->beginTransaction();
    
            // Prepare the UPDATE query for both tables
            $query = $conn->prepare("UPDATE student_info SET action = :action WHERE studentId = :studentId AND registerId = :registerId");
            $query2 = $conn->prepare("UPDATE student_account SET action = :action WHERE studentId = :studentId AND registerId = :registerId");
    
            // Bind parameters
            foreach ([$query, $query2] as $stmt) {
                $stmt->bindParam(':action', $type, PDO::PARAM_STR);
                $stmt->bindParam(':studentId', $roll, PDO::PARAM_INT);
                $stmt->bindParam(':registerId', $reg, PDO::PARAM_INT);
                $stmt->execute();
            }
    
            // Ensure both queries affected at least one row
            if ($query->rowCount() > 0 && $query2->rowCount() > 0) {
                $conn->commit();
                echo json_encode(["status" => 1, "message" => "Record successfully updated to $type in both tables."]);
            } else {
                $conn->rollBack();
                echo json_encode(["status" => 0, "error" => "Update failed. Ensure both records exist and are updated."]);
            }
        } catch (Exception $e) {
            $conn->rollBack();
            echo json_encode(["status" => 0, "error" => "Database update failed.", "message" => $e->getMessage()]);
        }
    break;
    

    default:
        echo json_encode(["error" => "Invalid request method"]);
    break;
}
?>
