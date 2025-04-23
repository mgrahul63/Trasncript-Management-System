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
use Firebase\JWT\Key;

$objDb = new DbConnect;
$conn = $objDb->connect();

 

// Check if the connection is successful
if (!$conn) {
    echo json_encode(["error" => "Failed to connect to the database."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Handle preflight request (CORS)
    http_response_code(200);
    exit;
}

// Get POST data from request
$data = json_decode(file_get_contents("php://input"), true);
$token = $data['jwt'];  // Make sure the frontend is sending the token under the correct key

// Validate token existence
if (empty($token)) {
    http_response_code(400);
    echo json_encode(['error' => 'No token provided.']);
    exit();
}

$sec_key = '9d9d9d9d9d';  // Secret key for decoding the JWT
// var_dump($token);
 
try {
    // Call the Verify method
    $payload = Token::Verify($token, $sec_key);
    // var_dump($payload);
    $email = $payload['email'] ?? 'default_role';
    $role = $payload['role'] ?? 'default_role';
    
    if ($role === 'admin' && in_array($email, ['cse@example.com', 'eee@example.com','stat@example.com','facultyadmin1@example.com', 'register@example.com', 'accounter@example.com']))
    {
        $query = $conn->prepare("SELECT * FROM admin WHERE email = :email ");
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->execute();

        // Get the result
        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) === 1) {
            $user = $result[0];
            // Return user info
            echo json_encode([
                'status' => 'success',
                'role' => 'admin',
                'data' =>  $user
            ]);
        } else {
          // User not found
          echo json_encode([
            'status' => 'error',
            'message' => 'User not found. Please check your student ID and register ID.'
        ]);
        }

    } else {
        // Access the decoded data
        $studentId = $payload['data']->studentId ?? 'default_Id';
        $registerId = $payload['data']->registerId ?? 'default_reg';

        // Fetch user info from the database
        $userQuery = $conn->prepare("SELECT * FROM student_info WHERE studentId = :studentId AND registerId = :registerId");
        $userQuery->bindParam(':studentId', $studentId, PDO::PARAM_STR);
        $userQuery->bindParam(':registerId', $registerId, PDO::PARAM_STR);
        $userQuery->execute();

        $userResult = $userQuery->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($userResult)) {
            $user = $userResult[0];

            // Return user info
            echo json_encode([
                'status' => 'success',
                'role' => 'user',
                'data' => $user
            ]);
        } else {
            // User not found
            echo json_encode([
                'status' => 'error',
                'message' => 'User not found. Please check your student ID and register ID.'
            ]);
        }

    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token.', 'message' => $e->getMessage()]);
}


?>
