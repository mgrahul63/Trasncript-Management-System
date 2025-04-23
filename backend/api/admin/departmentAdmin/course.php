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
    case 'GET':
        // Get data from query string
        $session_id = $_GET['sessionId'] ?? null;
        $semester_id = $_GET['semesterId'] ?? null;
        $department_id = $_GET['departmentId'] ?? null;
        $table = isset($_GET['departmentId']) ? 'course_' . strtolower($_GET['departmentId']) : null;

    
        if ($department_id && $session_id && $semester_id && $table) {
            try {
                // Query to fetch sessions
                $sql = "SELECT * FROM $table WHERE department_id = :department_id AND semester_id = :semester_id AND session_id = :session_id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':department_id', $department_id);
                $stmt->bindParam(':semester_id', $semester_id);
                $stmt->bindParam(':session_id', $session_id);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                if ($result) { 
                    // Return JSON response
                    echo json_encode([
                        "status" => 1,
                        "message" => "Session data found and course table ensured.",
                        "data" => $result,
                    ]);
                } else {
                    echo json_encode([
                        "status" => 0,
                        "data" => [],
                        "message" => "No Course Added"
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

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
    
        $action = $data->action ?? null;
        $session_id = $data->session_id ?? null;
        $semester_id = $data->semester ?? null;
        $department_id = $data->department_id ?? null;
        $department_name = $data->deptName ?? null;
    
        $table = 'course_' . strtolower($department_id);
    
        if (strtolower($action) === 'insert') {
            $courses = $data->courses ?? [];
    
            if (!$department_id || !$session_id || !$semester_id || empty($courses)) {
                echo json_encode([
                    "status" => 0,
                    "message" => "Missing required fields or empty courses array."
                ]);
                break;
            }
    
            try {
                $conn->beginTransaction();
    
                foreach ($courses as $course) {
                    if (!isset($course->course_code, $course->course_title, $course->credit)) {
                        throw new Exception("Missing required course fields.");
                    }
    
                    $sql = "INSERT INTO $table (course_code, course_title, credit, department_id, session_id, semester_id, department_name) 
                            VALUES (:course_code, :course_title, :credit, :department_id, :session_id, :semester_id, :department_name)";
    
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':course_code', $course->course_code);
                    $stmt->bindParam(':course_title', $course->course_title);
                    $stmt->bindParam(':credit', $course->credit);
                    $stmt->bindParam(':department_id', $department_id);
                    $stmt->bindParam(':session_id', $session_id);
                    $stmt->bindParam(':semester_id', $semester_id);
                    $stmt->bindParam(':department_name', $department_name);
    
                    $stmt->execute();
                }
    
                $conn->commit();
    
                echo json_encode([
                    "status" => 1,
                    "message" => "Courses added successfully!",
                ]);
            } catch (Exception $e) {
                $conn->rollBack();
                echo json_encode([
                    "status" => 0,
                    "message" => "Error: " . $e->getMessage()
                ]);
            }
        } elseif (strtolower($action) === 'update') {
            $updatedCourse = $data->updatedCourse ?? null;
    
            if (
                !$updatedCourse ||
                !$department_id || !$session_id || !$semester_id ||
                !isset($updatedCourse->course_code, $updatedCourse->course_title, $updatedCourse->credit)
            ) {
                echo json_encode([
                    "status" => 0,
                    "message" => "Missing required fields for update."
                ]);
                break;
            }
    
            try {
                $sql = "UPDATE $table 
                        SET course_title = :course_title, credit = :credit 
                        WHERE course_code = :course_code 
                          AND department_id = :department_id 
                          AND session_id = :session_id 
                          AND semester_id = :semester_id";
    
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':course_code', $updatedCourse->course_code);
                $stmt->bindParam(':course_title', $updatedCourse->course_title);
                $stmt->bindParam(':credit', $updatedCourse->credit);
                $stmt->bindParam(':department_id', $department_id);
                $stmt->bindParam(':session_id', $session_id);
                $stmt->bindParam(':semester_id', $semester_id);
    
                $stmt->execute();
    
                echo json_encode([
                    "status" => 1,
                    "message" => "Course updated successfully!",
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    "status" => 0,
                    "message" => "Error: " . $e->getMessage()
                ]);
            }
        } elseif (strtolower($action) === 'delete') {
            $course_code = $data->course_code ?? null;
            $id = $data->id ?? null;
        
            if (!$department_id || !$session_id || !$semester_id || !$course_code || !$id) {
                echo json_encode([
                    "status" => 0,
                    "message" => "Missing required fields for delete."
                ]);
                break;
            }
        
            try {
                $sql = "DELETE FROM $table 
                        WHERE id = :id 
                          AND course_code = :course_code 
                          AND department_id = :department_id 
                          AND session_id = :session_id 
                          AND semester_id = :semester_id";
        
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $id);
                $stmt->bindParam(':course_code', $course_code);
                $stmt->bindParam(':department_id', $department_id);
                $stmt->bindParam(':session_id', $session_id);
                $stmt->bindParam(':semester_id', $semester_id);
        
                $stmt->execute();
        
                echo json_encode([
                    "status" => 1,
                    "message" => "Course deleted successfully!",
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    "status" => 0,
                    "message" => "Error: " . $e->getMessage()
                ]);
            }
        }else {
            echo json_encode([
                "status" => 0,
                "message" => "Invalid action specified."
            ]);
        }
    break;
    
    
    
    
}