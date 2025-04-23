<?php 
error_reporting(E_ALL);
ini_set('display_error', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json"); 

include '../config/databse.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
 
// Check if the request method is POST
switch ($method) {
    case 'POST': // Corrected from 'PSOT' to 'POST'
        $input = json_decode(file_get_contents('php://input')); 
        
        // Validate input
        if (empty($input->studentId) || empty($input->registerId) || empty($input->facultyName) || empty($input->departmentName) || empty($input->email) || empty($input->password) || empty($input->confirmPassword)) {
            http_response_code(400);
            echo json_encode(["message" => "All fields are required."]);
            exit;
        }

        // Check if password and confirm password match
        if ($input->password !== $input->confirmPassword) {
            http_response_code(400);
            echo json_encode(["message" => "Passwords do not match."]);
            exit;
        }

        // Hash the password
        $hashedPassword = password_hash($input->password, PASSWORD_DEFAULT);

        // Check if studentId already exists
        $checkQuery = "SELECT COUNT(*) FROM student_account WHERE studentId = :studentId";
        $stmt = $conn->prepare($checkQuery);
        $stmt->bindParam(':studentId', $input->studentId);
        $stmt->execute();
        
        // If studentId already exists, return an error message
        if ($stmt->fetchColumn() > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Student ID already exists."]);
            exit;
        }

        // Check if studentId already exists
        $checkQuery = "SELECT COUNT(*) FROM student_account WHERE registerId = :registerId";
        $stmt = $conn->prepare($checkQuery);
        $stmt->bindParam(':registerId', $input->registerId);
        $stmt->execute();
        
        // If studentId already exists, return an error message
        if ($stmt->fetchColumn() > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Register ID already exists."]);
            exit;
        }

          // Check if email already exists
          $checkEmailQuery = "SELECT COUNT(*) FROM student_account WHERE email = :email";
          $stmt = $conn->prepare($checkEmailQuery);
          $stmt->bindParam(':email', $input->email);
          $stmt->execute();
          
          if ($stmt->fetchColumn() > 0) {
              http_response_code(400);
              echo json_encode(["message" => "Email already exists."]);
              exit;
          }

          
         // Prepare SQL query
            $query = "INSERT INTO student_account (studentId, registerId, facultyName, departmentName, email, password) 
            VALUES (:studentId, :registerId, :facultyName, :departmentName, :email, :password)";

            $stmt = $conn->prepare($query);

            // Bind the parameters
            $stmt->bindParam(':studentId', $input->studentId);
            $stmt->bindParam(':registerId', $input->registerId);
            $stmt->bindParam(':facultyName', $input->facultyName);
            $stmt->bindParam(':departmentName', $input->departmentName);
            $stmt->bindParam(':email', $input->email);
            $stmt->bindParam(':password', $hashedPassword);

            // Execute the query and check for errors
            if ($stmt->execute()) {
            echo json_encode(["status" => 1, "message" => "Student account created successfully!"]);
            } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create account."]);
            }
        break;
}
?>
