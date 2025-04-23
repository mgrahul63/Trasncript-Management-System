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

    case 'GET':
        $studentId = $_GET['studentId'] ?? '';
        $registerId = $_GET['registerId'] ?? '';
        $semester_id = $_GET['semester_id'] ?? '';

        if (empty($studentId) || empty($registerId) || empty($semester_id)) {
            echo json_encode([
                'status' => 0,
                'message' => 'Missing required parameters'
            ]);
            exit;
        }
        
        try {
            // Get GET parameters
            $studentId = $_GET['studentId'] ?? '';
            $registerId = $_GET['registerId'] ?? '';
            $semester_id = $_GET['semester_id'] ?? '';
        
            // Prepare application status query
            $sql = "SELECT status, application_date, rejection_reasons FROM applications WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':studentId', $studentId);
            $stmt->bindParam(':registerId', $registerId);
            $stmt->bindParam(':semester_id', $semester_id);
            $stmt->execute();
            $applicationInfo = $stmt->fetch(PDO::FETCH_ASSOC);
        
            // Prepare payment status query
            $sql = "SELECT status, payment_date, reason FROM payments WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':studentId', $studentId);
            $stmt->bindParam(':registerId', $registerId);
            $stmt->bindParam(':semester_id', $semester_id);
            $stmt->execute();
            $paymentInfo = $stmt->fetch(PDO::FETCH_ASSOC);
        
            // Prepare transcript status query (including transcript file)
            $sql = "SELECT processing_date, processing_status, receive_date, receive_status, delivered_date, delivered_status,  transcript_file, reason, id FROM transcript WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id AND application_date = :application_date";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':studentId', $studentId);
            $stmt->bindParam(':registerId', $registerId);
            $stmt->bindParam(':semester_id', $semester_id);
            $stmt->bindParam(':application_date', $applicationInfo['application_date']);
            $stmt->execute();
            $transcriptInfo = $stmt->fetch(PDO::FETCH_ASSOC);
        
            // Build response with fallback values
            $response = [
                'status' => 1,
                'data'=> [
                    'id' => $transcriptInfo['id'] ?? null,
                    'application_status' => $applicationInfo['status'] ?? 'Not Submitted',
                    'application_date' => $applicationInfo['application_date'] ?? 'N/A',
                    'application_reasons' => $applicationInfo['rejection_reasons'] ?? null,
                    'payment_status' => $paymentInfo['status'] ?? 'Unpaid',
                    'payment_date' => $paymentInfo['payment_date'] ?? 'N/A', 
                    'payment_reason' => $paymentInfo['reason'] ?? null,
                    'processing_status' => $transcriptInfo['processing_status'] ?? 'Pending',
                    'processing_date' => $transcriptInfo['processing_date'] ?? null,
                    'receive_status' => $transcriptInfo['receive_status'] ?? 'Pending',
                    'receive_date' => $transcriptInfo['receive_date'] ?? null,
                    'delivered_date' => $transcriptInfo['delivered_date'] ?? null,
                    'delivered_status' => $transcriptInfo['delivered_status'] ?? 'N/R',
                    'reason'=> $transcriptInfo['reason'] ?? null,
                    'transcript_file' => isset($transcriptInfo['transcript_file']) ? base64_encode($transcriptInfo['transcript_file']) : null
                ]
                 
            ];
        
            echo json_encode($response);
        
        } catch (PDOException $e) {
            echo json_encode([
                'status' => 0,
                'message' => 'Database error: ' . $e->getMessage()
            ]);
        }   
    break;

    case "POST":
        $data = json_decode(file_get_contents("php://input"));

        $studentId = $data->studentId ?? null;
        $registerId = $data->registerId ?? null;
        $semester_id = $data->semester_id ?? null;

        if ($studentId && $registerId && $semester_id) {
            try {
                $query = $conn->prepare("
                    SELECT status 
                    FROM payments 
                    WHERE studentId = :studentId 
                      AND registerId = :registerId 
                      AND semester_id = :semester_id
                    LIMIT 1
                ");
                $query->bindParam(":studentId", $studentId);
                $query->bindParam(":registerId", $registerId);
                $query->bindParam(":semester_id", $semester_id);
                $query->execute();

                $result = $query->fetch(PDO::FETCH_ASSOC);

                if ($result) {
                    echo json_encode([
                        'status' => 1,
                        'data' => $result['status'],
                        'message' => 'Payment status fetched successfully.'
                    ]);
                } else {
                    echo json_encode([
                        'status' => 0,
                        'message' => 'No payment record found.'
                    ]);
                }
            } catch (PDOException $e) {
                echo json_encode([
                    'status' => 0,
                    'message' => 'Database error: ' . $e->getMessage()
                ]);
            }
        } else {
            echo json_encode([
                'status' => 0,
                'message' => 'Missing required fields.'
            ]);
        }
    break;


    default:
        echo json_encode([
            'status' => 0,
            'message' => 'Invalid request method'
        ]);
    break;
    
    
    

}
?>