<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);  // Fixed 'display_error' typo
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include '../config/databse.php';



$objDb = new DbConnect;
$conn = $objDb->connect();

// Check if the connection is successful
if (!$conn) {
    echo json_encode(["error" => "Failed to connect to the database."]);
    exit; 
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'POST':
        $studentId = $_POST['studentId'] ?? ''; 
        $registerId = $_POST['registerId'] ?? ''; 
        $apply_type = $_POST['apply_type'] ?? ''; 
        $payment_type = $_POST['payment_type'] ?? "";
        $payment_method = $_POST['payment_method'] ?? "";
        $transaction_id = $_POST['transaction_id'] ?? '';
        $semester_id = $_POST['semester_id'] ?? '';
        $amount = $_POST['amount'] ?? '';
    
        if (empty($studentId) || empty($registerId) || empty($apply_type) || empty($amount) || empty($payment_type) || empty($payment_method) || empty($transaction_id)) {
            echo json_encode(["status" => false, "message" => "All fields are required."]);
            exit();
        }
    
        // Validate and get file data
        $image_file = null;
        if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
            $image_file = file_get_contents($_FILES['image_file']['tmp_name']); // Get binary data
        } else {
            echo json_encode(["status" => false, "message" => "Image file is required and should be uploaded successfully."]);
            exit();
        }
    
        // Check if the record already exists
        $checkSql = "SELECT * FROM payments WHERE studentId = :studentId AND registerId = :registerId AND apply_type = :apply_type AND semester_id = :semester_id";
        $stmt = $conn->prepare($checkSql);
        $stmt->bindParam(':studentId', $studentId);
        $stmt->bindParam(':registerId', $registerId);
        $stmt->bindParam(':apply_type', $apply_type);
        $stmt->bindParam(':semester_id', $semester_id);
        $stmt->execute();
        $existingData = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($existingData) {
           // Update the existing record and set status to 'Pending'
            $sql = "UPDATE payments 
                SET payment_type = :payment_type, payment_method = :payment_method, transaction_id = :transaction_id, 
                    amount = :amount, image_file = :image_file, status = 'Pending' 
                WHERE studentId = :studentId AND registerId = :registerId AND apply_type = :apply_type AND semester_id = :semester_id";
            } else {
                // Insert new record
                $sql = "INSERT INTO payments (studentId, registerId, apply_type, payment_type, payment_method, transaction_id, semester_id, amount, image_file) 
                    VALUES (:studentId, :registerId, :apply_type, :payment_type, :payment_method, :transaction_id, :semester_id, :amount, :image_file)";
            }
    
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':studentId', $studentId);
        $stmt->bindParam(':registerId', $registerId);
        $stmt->bindParam(':apply_type', $apply_type);
        $stmt->bindParam(':payment_type', $payment_type);
        $stmt->bindParam(':payment_method', $payment_method);
        $stmt->bindParam(':transaction_id', $transaction_id);
        $stmt->bindParam(':semester_id', $semester_id);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':image_file', $image_file, PDO::PARAM_LOB);
    
        if ($stmt->execute()) {
            if ($existingData) {
                echo json_encode(["status" => true, "message" => "Payment record updated successfully."]);
            } else {
                echo json_encode(["status" => true, "message" => "Payment record successfully created."]);
            }
        } else {
            echo json_encode(["status" => false, "message" => "Failed to process payment record."]);
        }
    break;
    
    
    case "GET":
            // Get parameters from the query string
            $studentId = $_GET['studentId'] ?? '';
            $registerId = $_GET['registerId'] ?? '';
            $semesterId = $_GET['semester_id'] ?? '';
            $applyType = $_GET['apply_type'] ?? '';
        
            // Check if required parameters (studentId and registerId) are provided
            if (empty($studentId) || empty($registerId)) {
                echo json_encode(["status" => false, "message" => "Both studentId and registerId are required."]);
                exit();
            }
        
            // Start building the SQL query
            $sql = "SELECT apply_type, payment_type, payment_method, transaction_id, amount, image_file, payment_date, status
                    FROM payments 
                    WHERE studentId = :studentId AND registerId = :registerId";
        
            // Add semester_id condition if it's provided
            if (!empty($semesterId)) {
                $sql .= " AND semester_id = :semesterId";
            }
        
            // Add apply_type condition if it's provided
            if (!empty($applyType)) {
                $sql .= " AND apply_type = :applyType";
            }
        
            // Prepare the statement
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':studentId', $studentId);
            $stmt->bindParam(':registerId', $registerId);
        
            // Bind semester_id and apply_type parameters if provided
            if (!empty($semesterId)) {
                $stmt->bindParam(':semesterId', $semesterId);
            }
            if (!empty($applyType)) {
                $stmt->bindParam(':applyType', $applyType);
            }
        
            // Execute the query
            if ($stmt->execute()) {
                $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
                // If there are payments, process them
                if (count($payments) > 0) { 
                    // Loop through payments and encode image as base64 if present
                    foreach ($payments as &$payment) {
                        if (!empty($payment['image_file'])) {
                            $payment['image_file'] = 'data:image/jpeg;base64,' . base64_encode($payment['image_file']); // Base64 encode
                        }
                    }
        
                    $paymentDetails = $payments[0];
                        echo json_encode(["status" => true, "data" => $paymentDetails]);
                } else {
                    echo json_encode(["status" => false, "message" => "No payment records found for the given studentId and registerId."]);
                }
                
            } else {
                echo json_encode(["status" => false, "message" => "Failed to retrieve payment records."]);
            }
        
    break;


    default:
        http_response_code(405);
        echo json_encode(["status" => false, "message" => "Method not allowed."]);
    break;
}
?>
