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
    echo json_encode(["status" => 0, "message" => "Database connection failed. Please try again later."]);
    exit; // Stop further execution if the connection fails
}

$method = $_SERVER['REQUEST_METHOD'];
$sec_key = '9d9d9d9d9d';  // Secret key for encoding the JWT

switch ($method) {
    case 'POST':
        $input = json_decode(file_get_contents('php://input')); 

        // Validate input
        if (empty($input->email) || empty($input->password)) {
            http_response_code(400);
            echo json_encode([ "status" => 0, 'message' => 'Both email and password are required to proceed.']);
            exit();
        }

        $email = $input->email;
        $password = $input->password;

        if(
            $email === 'cse@example.com' && $password === 'admin12345' ||
            $email === 'eee@example.com' && $password === 'admin12345' ||
            $email === 'stat@example.com' && $password === 'admin12345' ||
            $email === 'facultyadmin1@example.com' && $password === 'hashed_password_faculty_1' || 
            $email === 'register@example.com' && $password === 'admin12345' || 
            $email === 'accounter@example.com' && $password === 'admin12345' 
            )
        {
            $issuedAt = time();
            $expirationTime = $issuedAt + 3600;  // jwt valid for 1 hour from the issued time
            
            $query = $conn->prepare("SELECT * FROM admin WHERE email = :email AND password = :password");
            $query->bindParam(':email', $email, PDO::PARAM_STR);
            $query->bindParam(':password', $password, PDO::PARAM_STR);
            $query->execute();

            // Get the result
            $result = $query->fetchAll(PDO::FETCH_ASSOC);

            if (count($result) === 1) {
                $payload = [
                    'email' => $result[0]['email'],
                    'role' => 'admin',
                ];
                // Admin authenticated successfully
                 // Generate token with expiration time (e.g., 1 hour)
                 $token = Token::Sign($payload, $sec_key, 60 * 60); // 1 hour
                echo json_encode([
                    'status' => 'success',
                    'role' => 'admin',
                    'message' => 'Admin authentication successful.',
                    'jwt' => $token,
                    'adminData' => $result[0] // Send back admin data
                ]);
            } else {
                // Admin not found or invalid password
                http_response_code(401);
                echo json_encode(["status" => 0, 'message' => 'Invalid admin credentials.']);
            }

        } else{
                //check status = pendig
                $query = $conn->prepare("SELECT * FROM student_account WHERE email = :email AND action = 'pending'");
                $query->bindParam(':email', $email, PDO::PARAM_STR);
                $query->execute();

                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                if (count($result) === 1) {
                    echo json_encode(["status" => 0, "message" => "Your account is pending approval. Please wait for the admin to approve your account."]);
                    exit();
                }
                //check status = rejected
                $query = $conn->prepare("SELECT * FROM student_account WHERE email = :email AND action = 'rejected'");
                $query->bindParam(':email', $email, PDO::PARAM_STR);
                $query->execute();

                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                if (count($result) === 1) {
                    echo json_encode(["status" => 0, "message" => "Your account has been rejected. Please contact the admin for more information."]);
                    exit();
                }
                //check status = approved
                // Check for student account authentication
                $query = $conn->prepare("SELECT * FROM student_account WHERE email = :email AND action = 'approved'");
                $query->bindParam(':email', $email, PDO::PARAM_STR);
                $query->execute();

                // Get the result
                $result = $query->fetchAll(PDO::FETCH_ASSOC);

                if (count($result) === 1) {
                    $user = $result[0];   
                    if (password_verify($password, $user['password'])) {
                        
                        $issuedAt = time();
                        $expirationTime = $issuedAt + 3600;  // jwt valid for 1 hour from the issued time
                        
                        // Prepare query to check if user info exists
                        $query = $conn->prepare("SELECT * FROM student_info WHERE studentId = :studentId AND registerId = :registerId");
                        $query->bindParam(':studentId', $user['studentId'], PDO::PARAM_INT);
                        $query->bindParam(':registerId', $user['registerId'], PDO::PARAM_INT);
                        $query->execute();

                        // Get the result
                        $userInfo = $query->fetch(PDO::FETCH_ASSOC); 

                        if (!$userInfo) {
                            echo json_encode(["status" => 0, "message" => "User information is not registered. Please complete your registration."]);
                            exit();
                        }

                        // Encode the payload to generate the JWT with the algorithm
                        try {
                            // Define user data for the token payload
                            $payload = [
                                'data' => array(
                                    'studentId' => $user['studentId'],
                                    'registerId' => $user['registerId'],
                                )
                            ];

                            // Generate token with expiration time (e.g., 1 hour)
                            $token = Token::Sign($payload, $sec_key, 60 * 60); // 1 hour

                            // Output the response
                            echo json_encode([
                                'status' => 'success',
                                'message' => 'Authentication successful.',
                                'role' => 'user',
                                'jwt' => $token,
                                'data' => $userInfo
                            ]);
                        } catch (Exception $e) {
                            echo json_encode(["status" => 0, "message" => "message generating authentication token. Please try again later.", "message" => $e->getMessage()]);
                        }
                    } else {
                        // Password is incorrect
                        http_response_code(401);  // Unauthorized for invalid login attempts
                        echo json_encode(["status" => 0, "message" => "Invalid password. Please check your credentials and try again."]);
                    }
                } else {
                    // Email not found
                    http_response_code(404);  // Not Found for invalid email
                    echo json_encode(["status" => 0, "message" => "No account found with the provided email address."]);
                }
        }
        
    break;
}
?>
