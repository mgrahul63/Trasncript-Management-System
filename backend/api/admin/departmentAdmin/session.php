<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");
 
include '../../../config/databse.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

// If connection fails, return JSON error and stop execution
if (!$conn) {
    echo json_encode(["status" => 0, "message" => "Database connection failed."]);
    exit(); // Stop further execution
}

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
    
        $department_id = $data->department_id ?? null;
        $faculty_id = $data->faculty_id ?? null;
    
        if ($department_id && $faculty_id) {
            try {
                // Query to fetch sessions
                $sql = "SELECT * FROM sessions WHERE department_id = :department_id AND faculty_id = :faculty_id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':department_id', $department_id);
                $stmt->bindParam(':faculty_id', $faculty_id);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
                // Query to fetch department name
                $sql1 = "SELECT name FROM departments WHERE department_id = :department_id AND faculty_id = :faculty_id";
                $stmt1 = $conn->prepare($sql1);
                $stmt1->bindParam(':department_id', $department_id);
                $stmt1->bindParam(':faculty_id', $faculty_id);
                $stmt1->execute();
                $result1 = $stmt1->fetch(PDO::FETCH_ASSOC); // Assuming only one department name should be returned
                
                // Check if department data exists
                if ($result && $result1) {
                    // Dynamically create a table named "course_<department_id>"
                    $tableName = "course_" . preg_replace('/[^A-Za-z0-9_]/', '', $result[0]['department_id']); // sanitize safely
                
                    // SQL to create table if it doesn't exist
                    $createTableSQL = "CREATE TABLE IF NOT EXISTS `$tableName` (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        course_code VARCHAR(50) NOT NULL,
                        course_title VARCHAR(255) NOT NULL,
                        credit DECIMAL(3,1) NOT NULL,
                        session_id VARCHAR(255) NOT NULL,
                        semester_id VARCHAR(255) NOT NULL, 
                        department_id VARCHAR(20) NOT NULL,
                        department_name VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
                
                    // Execute table creation
                    $conn->exec($createTableSQL);
                
                    // Return JSON response
                    echo json_encode([
                        "status" => 1,
                        "message" => "Session data found and course table ensured.",
                        "data" => $result,
                        "department" => $result1
                    ]);
                } else {
                    echo json_encode([
                        "status" => 0,
                        "data" => [],
                        "message" => "Data not found."
                    ]);
                }
            } catch (Exception $e) {
                echo json_encode([
                    "status" => 0,
                    "data" => [],
                    "message" => "Error: " . $e->getMessage()
                ]);
            }
        } else {
            echo json_encode([
                "status" => 0,
                "data" => [],
                "message" => "Missing department_id or faculty_id"
            ]);
        }
        
    break;

    default:
        echo json_encode(["error" => "Invalid request method"]);
    break;
}
?>  