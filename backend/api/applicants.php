<?php 
error_reporting(E_ALL);
ini_set('display_error', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include '../config/databse.php';
include '../vendor/autoload.php';  // Include Composer's autoload file
include './Token.php';

use \Firebase\JWT\JWT;


$objDb = new DbConnect;
$conn = $objDb->connect();

// Check if the connection is successful
if (!$conn) {
    echo json_encode(["error" => "Failed to connect to the database."]);
    exit; // Stop further execution if the connection fails
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'POST':
        // Collect form data
        $studentId = trim($_POST['studentId'] ?? '');
        $session_id = trim($_POST['session_id'] ?? '');
        $registerId = trim($_POST['registerId'] ?? '');
        $facultyName = trim($_POST['facultyName'] ?? '');
        $departmentName = trim($_POST['departmentName'] ?? '');
        $apply_type = trim($_POST['apply_type'] ?? '');
        $semester_id = trim($_POST['semester_id'] ?? '');
        $amount = trim($_POST['amount'] ?? '');
        $payment_type = trim($_POST['payment_type'] ?? '');
        $action = $_POST['action'] ?? null;
        $id = $_POST['id'] ?? null;
    
        // Validate main image file
        $image_file = null;
        $allowedTypes = ['image/jpeg', 'image/png'];
        if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
            if (!in_array($_FILES['image_file']['type'], $allowedTypes)) {
                echo json_encode(["status" => false, "message" => "Only JPG or PNG images are allowed."]);
                exit();
            }
            $image_file = file_get_contents($_FILES['image_file']['tmp_name']);
        } else {
            echo json_encode(["status" => false, "message" => "Image file is required and must be uploaded successfully."]);
            exit();
        }
    
        // Validate previous transcript image if required
        $previous_transcript_image = null;
        if ($apply_type === 'Transcript') {
            if (isset($_FILES['previous_transcript_image']) && $_FILES['previous_transcript_image']['error'] === UPLOAD_ERR_OK) {
                if (!in_array($_FILES['previous_transcript_image']['type'], $allowedTypes)) {
                    echo json_encode(["status" => false, "message" => "Only JPG or PNG images are allowed for previous transcript."]);
                    exit();
                }
                $previous_transcript_image = file_get_contents($_FILES['previous_transcript_image']['tmp_name']);
            } else {
                echo json_encode(["status" => false, "message" => "Previous transcript image is required and must be uploaded successfully."]);
                exit();
            }
        }
        
        try {
            if ($action === 'newApply') {
                // Validate text fields
                if (
                    empty($studentId) || empty($session_id) || empty($registerId) || empty($facultyName) ||
                    empty($departmentName) || empty($apply_type) || empty($semester_id) ||
                    empty($amount) || empty($payment_type)
                ) {
                    echo json_encode(["status" => false, "message" => "All text fields are required."]);
                    exit();
                }
        
                if (!is_numeric($amount)) {
                    echo json_encode(["status" => false, "message" => "Amount must be a valid number."]);
                    exit();
                }
        
                // Check for duplicate applications
                $checkQuery = "SELECT COUNT(*) FROM applications WHERE studentId = :studentId AND semester_id = :semester_id AND registerId = :registerId";
                $checkStmt = $conn->prepare($checkQuery);
                $checkStmt->bindParam(':studentId', $studentId);
                $checkStmt->bindParam(':semester_id', $semester_id);
                $checkStmt->bindParam(':registerId', $registerId);
                $checkStmt->execute();
                $existingCount = $checkStmt->fetchColumn();
        
                if ($existingCount > 0) {
                    echo json_encode(["status" => false, "message" => "You have already applied for this " . $semester_id . "."]);
                    exit();
                }
        
                // Insert new application
                $sql = "INSERT INTO applications (
                    studentId,
                    registerId,
                    facultyName,
                    departmentName,
                    session_id,
                    apply_type,
                    semester_id,
                    amount,
                    payment_type,
                    previous_transcript_image,
                    image_file
                ) VALUES (
                    :studentId,
                    :registerId,
                    :facultyName,
                    :departmentName,
                    :session_id,
                    :apply_type,
                    :semester_id,
                    :amount,
                    :payment_type,
                    :previous_transcript_image,
                    :image_file
                )";
        
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':studentId', $studentId);
                $stmt->bindParam(':registerId', $registerId);
                $stmt->bindParam(':facultyName', $facultyName);
                $stmt->bindParam(':departmentName', $departmentName);
                $stmt->bindParam(':session_id', $session_id);
                $stmt->bindParam(':apply_type', $apply_type);
                $stmt->bindParam(':semester_id', $semester_id);
                $stmt->bindParam(':amount', $amount);
                $stmt->bindParam(':payment_type', $payment_type);
                $stmt->bindParam(':previous_transcript_image', $previous_transcript_image, PDO::PARAM_LOB);
                $stmt->bindParam(':image_file', $image_file, PDO::PARAM_LOB);
        
                if ($stmt->execute()) {
                    echo json_encode(["status" => true, "message" => "Application submitted successfully."]);
                } else {
                    echo json_encode([
                        "status" => false,
                        "message" => "Failed to insert data.",
                        "error" => $stmt->errorInfo()
                    ]);
                }
                exit();
            }
        
            else if ($action === 'editApply') {
                if (empty($id)) {
                    echo json_encode(["status" => false, "message" => "Application ID is required for update."]);
                    exit();
                }
        
                if (!is_numeric($amount)) {
                    echo json_encode(["status" => false, "message" => "Amount must be a valid number."]);
                    exit();
                }
        
                $sql = "UPDATE applications SET 
                    apply_type = :apply_type,
                    semester_id = :semester_id,
                    amount = :amount,
                    status = 'Pending'";
        
                // Conditionally include image updates
                if ($previous_transcript_image !== null) {
                    $sql .= ", previous_transcript_image = :previous_transcript_image";
                }
                if ($image_file !== null) {
                    $sql .= ", image_file = :image_file";
                }
        
                $sql .= " WHERE id = :id AND studentId = :studentId AND registerId = :registerId";
        
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':apply_type', $apply_type);
                $stmt->bindParam(':semester_id', $semester_id);
                $stmt->bindParam(':amount', $amount);
        
                if ($previous_transcript_image !== null) {
                    $stmt->bindParam(':previous_transcript_image', $previous_transcript_image, PDO::PARAM_LOB);
                }
                if ($image_file !== null) {
                    $stmt->bindParam(':image_file', $image_file, PDO::PARAM_LOB);
                }
        
                $stmt->bindParam(':id', $id);
                $stmt->bindParam(':studentId', $studentId);
                $stmt->bindParam(':registerId', $registerId);
        
                if ($stmt->execute()) {
                    $affectedRows = $stmt->rowCount();
                    if ($affectedRows > 0) {
                        echo json_encode(["status" => true, "message" => "Application updated successfully."]);
                    } else {
                        // Check if record exists
                        $checkSql = "SELECT id FROM applications WHERE id = :id AND studentId = :studentId AND registerId = :registerId";
                        $checkStmt = $conn->prepare($checkSql);
                        $checkStmt->bindParam(':id', $id);
                        $checkStmt->bindParam(':studentId', $studentId);
                        $checkStmt->bindParam(':registerId', $registerId);
                        $checkStmt->execute();
        
                        if ($checkStmt->fetch()) {
                            echo json_encode([
                                "status" => false,
                                "message" => "No changes were made to the application.",
                                "debug" => "Record exists but no changes detected"
                            ]);
                        } else {
                            echo json_encode([
                                "status" => false,
                                "message" => "No matching application found to update.",
                                "debug" => "No record found with provided ID and student credentials"
                            ]);
                        }
                    }
                } else {
                    echo json_encode([
                        "status" => false,
                        "message" => "Update failed.",
                        "error" => $stmt->errorInfo()
                    ]);
                }
                exit();
            }
            else {
                echo json_encode(['message'=> 'Somthing went wrong!']);
            }
        
        } catch (\Throwable $th) {
            echo json_encode([
                "status" => false,
                "message" => "An error occurred while processing your request.",
                "error" => $th->getMessage() // Optional: Remove this in production
            ]);
            exit();
        }
        
        
        break;
    
    
    
    
    case 'GET':
            $studentId = $_GET['studentId'] ?? '';
            $registerId = $_GET['registerId'] ?? '';
        
            // Retrieve data from applications table
            $sql = "SELECT * FROM applications WHERE studentId = :studentId AND registerId = :registerId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':studentId', $studentId);
            $stmt->bindParam(':registerId', $registerId);
            $stmt->execute();
        
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch all matching records
        
            if ($results) {
                $response = [];
        
                foreach ($results as $result) {
                    $application = [];
        
                    // Loop through all columns dynamically
                    foreach ($result as $key => $value) {
                        // Check if the column is an image and base64 encode it
                        if ($key == 'image_file' || $key == 'previous_transcript_image') {
                            // Ensure the value is not empty before base64 encoding
                            if (!empty($value)) {
                                $application[$key] = 'data:image/jpeg;base64,' . base64_encode($value);
                            } else {
                                $application[$key] = null; // or handle as needed
                            }
                        } else {
                            // For all other columns, just store the value as-is
                            $application[$key] = $value;
                        }
                    }
        
                    // Add the application data to the response array
                    $response[] = $application;
                }
        
                  // Return JSON response
                echo json_encode(["status" => 1, "data" => $response]);
                // echo json_encode($response); // Return all applications as an array of JSON objects
            } else {
                echo json_encode(["status" => 1, 'data' => []]);
            }
        
    break;
        
        
    
    default:
        # code...
    break;



}
 
    
