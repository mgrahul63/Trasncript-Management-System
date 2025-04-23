<?php 
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json"); 

// Include the database connection file
include '../config/databse.php';
$objDb = new DbConnect();
$conn = $objDb->connect();

// Check if the connection is successful
if (!$conn) {
    echo json_encode(["error" => "Failed to connect to the database."]);
    exit; // Stop further execution if the connection fails
}
 
// Determine the request method
$method = $_SERVER['REQUEST_METHOD']; 
// Switch statement to handle different HTTP methods
switch ($method) {

    case 'POST':
        $inputValue = json_decode(file_get_contents('php://input'));
    
        if ($inputValue->password !== $inputValue->confirmPassword) {
            http_response_code(400);
            echo json_encode(["message" => "Passwords do not match."]);
            exit;
        }
    
        $middleName = $inputValue->middleName ?? "";
        $studentId = $inputValue->studentId ?? null;
        $registerId = $inputValue->registerId ?? null;
        $email = $inputValue->email ?? null;
    
        // Check duplicates in student_info
        $checkStmt = $conn->prepare("SELECT * FROM student_info WHERE studentId = :studentId OR registerId = :registerId");
        $checkStmt->execute([':studentId' => $studentId, ':registerId' => $registerId]);
        if ($checkStmt->fetch(PDO::FETCH_ASSOC)) {
            http_response_code(400);
            echo json_encode(["message" => "Student ID or Register ID already exists."]);
            exit;
        }
    
        // Check email uniqueness
        $emailCheckStmt = $conn->prepare("SELECT * FROM student_account WHERE email = :email");
        $emailCheckStmt->execute([':email' => $email]);
        if ($emailCheckStmt->fetch(PDO::FETCH_ASSOC)) {
            http_response_code(400);
            echo json_encode(["message" => "Email already exists."]);
            exit;
        }
    
        // Check duplicates in student_account
        $accountCheckStmt = $conn->prepare("SELECT * FROM student_account WHERE studentId = :studentId OR registerId = :registerId");
        $accountCheckStmt->execute([':studentId' => $studentId, ':registerId' => $registerId]);
        if ($accountCheckStmt->fetch(PDO::FETCH_ASSOC)) {
            http_response_code(400);
            echo json_encode(["message" => "Student ID or Register ID already exists in account."]);
            exit;
        }
    
        $hashedPassword = password_hash($inputValue->password, PASSWORD_DEFAULT);
    
        try {
            $conn->beginTransaction();
    
            // Insert student_info
            $stmt1 = $conn->prepare("INSERT INTO student_info 
                (studentId, registerId, session_id, firstName, middleName, lastName, facultyName, departmentName, gender, dob, studentContact, address, fatherName, motherName, parentContact, parentAddress)
                VALUES 
                (:studentId, :registerId, :session_id, :firstName, :middleName, :lastName, :facultyName, :departmentName, :gender, :dob, :studentContact, :address, :fatherName, :motherName, :parentContact, :parentAddress)");
            $stmt1->execute([
                ':studentId' => $inputValue->studentId,
                ':registerId' => $inputValue->registerId,
                ':session_id' => $inputValue->session_id,
                ':firstName' => $inputValue->firstName,
                ':middleName' => $inputValue->middleName,
                ':lastName' => $inputValue->lastName,
                ':facultyName' => $inputValue->facultyName,
                ':departmentName' => $inputValue->departmentName,
                ':gender' => $inputValue->gender,
                ':dob' => $inputValue->dob,
                ':studentContact' => $inputValue->studentContact,
                ':address' => $inputValue->address,
                ':fatherName' => $inputValue->fatherName,
                ':motherName' => $inputValue->motherName,
                ':parentContact' => $inputValue->parentContact,
                ':parentAddress' => $inputValue->parentAddress
            ]);
    
            // Insert student_account
            $stmt2 = $conn->prepare("INSERT INTO student_account 
                (studentId, registerId, facultyName, departmentName, email, password)
                VALUES 
                (:studentId, :registerId, :facultyName, :departmentName, :email, :password)");
            $stmt2->execute([
                ':studentId' => $inputValue->studentId,
                ':registerId' => $inputValue->registerId,
                ':facultyName' => $inputValue->facultyName,
                ':departmentName' => $inputValue->departmentName,
                ':email' => $inputValue->email,
                ':password' => $hashedPassword
            ]);
    
            $conn->commit();
            http_response_code(200);
            echo json_encode([
                'status' => 1,
                'message' => 'Student registered successfully! When your account is approved, you will be notified via email. You can then log in with your email and password.'
            ]);
        } catch (PDOException $e) {
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(['status' => 0, 'message' => 'Registration failed: ' . $e->getMessage()]);
        }
    break;
    
    

    case 'GET':
        // Prepare the SQL select query
        $query = "SELECT * FROM faculties";
        $stmt = $conn->prepare($query);
        $stmt->execute();

        // Fetch all records and return as JSON
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($records);
    break;

    // Optionally, you can handle the OPTIONS method
    case 'OPTIONS':
        // No response body required for OPTIONS requests
        http_response_code(200);
        break;

    default:
        // Handle unsupported methods
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}
?>
