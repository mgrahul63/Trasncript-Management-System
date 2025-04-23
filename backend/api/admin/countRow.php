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
        $department_id = isset($_GET['department_id']) ? $_GET['department_id']: '' ;
        $faculty_id = isset($_GET['faculty_id']) ? $_GET['faculty_id'] : '';


    
        try {
            if ($type === 'newRegister') {

                if ( empty($department_id) || empty($faculty_id)) {
                    echo json_encode(["status" => 0, "error" => "Missing required parameters."]);
                    exit();
                }
            
                // Get department name
                $query = $conn->prepare("SELECT name FROM departments WHERE department_id = :department_id AND faculty_id = :faculty_id");
                $query->bindParam(':department_id', $department_id, PDO::PARAM_STR);  
                $query->bindParam(':faculty_id', $faculty_id, PDO::PARAM_STR);
                $query->execute();
                $department = $query->fetch(PDO::FETCH_ASSOC);
            
                if (!$department) {
                    echo json_encode(["status" => 0, "error" => "Department not found."]);
                    exit();
                }
               
                // Count rows where action = 'pending'
                $countQuery = $conn->prepare("SELECT COUNT(*) AS total FROM student_info WHERE action = :action AND departmentName = :department_name");
                $action = 'pending';
                $countQuery->bindParam(':action', $action, PDO::PARAM_STR);
                $countQuery->bindParam(':department_name', $department['name'], PDO::PARAM_STR);
                $countQuery->execute();
                $countResult = $countQuery->fetch(PDO::FETCH_ASSOC);
                $pendingCount = $countResult['total'];
    
                echo json_encode(["status" => 1, "count" => $pendingCount, 'department' => $department['name']]);

            } 
            else if ($type === 'newAccount') {
                
                // Count rows where action = 'pending'
                $countQuery = $conn->prepare("SELECT COUNT(*) AS total FROM student_account WHERE action = :action");
                $action = 'pending';
                $countQuery->bindParam(':action', $action, PDO::PARAM_STR);
                $countQuery->execute();
                $countResult = $countQuery->fetch(PDO::FETCH_ASSOC);
                $pendingCount = $countResult['total'];
    
                echo json_encode(["status" => 1, "count" => $pendingCount]);
            }
            else if ($type === 'newApply') {

                if ( empty($department_id) || empty($faculty_id)) {
                    echo json_encode(["status" => 0, "error" => "Missing required parameters."]);
                    exit();
                }
            
                // Get department name
                $query = $conn->prepare("SELECT name FROM departments WHERE department_id = :department_id AND faculty_id = :faculty_id");
                $query->bindParam(':department_id', $department_id, PDO::PARAM_STR);  
                $query->bindParam(':faculty_id', $faculty_id, PDO::PARAM_STR);
                $query->execute();
                $department = $query->fetch(PDO::FETCH_ASSOC);
            
                if (!$department) {
                    echo json_encode(["status" => 0, "error" => "Department not found."]);
                    exit();
                }

                // Count only the number of rows where status is 'Pending'
                $query = $conn->prepare("SELECT COUNT(*) as total FROM applications WHERE status = 'Pending' departmentName = :department_name");
                $countQuery->bindParam(':department_name', $department['name'], PDO::PARAM_STR);
                $query->execute();
                $result = $query->fetch(PDO::FETCH_ASSOC);
            
                if ($result && isset($result['total'])) {
                    echo json_encode([
                        "status" => 1,
                        "count" => (int)$result['total']
                    ]);
                } else {
                    echo json_encode([
                        "status" => 0,
                        "count" => 0,
                        "message" => "No pending applications found"
                    ]);
                }
            } 
            else if ($type === 'newpaymentData') {
               
                $sql = "
                    SELECT COUNT(DISTINCT a.id) AS count
                    FROM applications a
                    JOIN payments p
                        ON a.studentId = p.studentId 
                        AND a.registerId = p.registerId
                        AND (a.semester_id IS NULL OR a.semester_id = p.semester_id)
                        AND (a.apply_type IS NULL OR a.apply_type = p.apply_type)
                    WHERE a.status = 'Approved' AND p.status = 'Pending'
                ";
            
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
                echo json_encode([
                    'status' => 1,
                    'count' => (int) $result['count']
                ]);
            }
            else if ($type === 'newTranscriptcount'){
                 // Count only the number of rows where status is 'Pending'
                 $query = $conn->prepare("SELECT COUNT(*) as total FROM transcript WHERE processing_status = 'Pending'");
                 $query->execute();
                 $result = $query->fetch(PDO::FETCH_ASSOC);
             
                 if ($result && isset($result['total'])) {
                     echo json_encode([
                         "status" => 1,
                         "count" => (int)$result['total']
                     ]);
                 } else {
                     echo json_encode([
                         "status" => 0,
                         "count" => 0,
                         "message" => "No pending applications found"
                     ]);
                 }
            }
            else {
                echo json_encode(["error" => "Invalid type parameter"]);
                exit();
            } 
             
            
        } catch (Exception $e) {
            echo json_encode(["error" => "Database query failed.", "message" => $e->getMessage()]);
        }
    break;
    
    

    default:
        echo json_encode(["error" => "Invalid request method"]);
    break;
}
?>
