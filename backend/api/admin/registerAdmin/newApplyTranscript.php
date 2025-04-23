<?php
ob_start(); // 🧼 Start cleaning output early
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");
 
include '../../../config//databse.php';
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
        // Get the "type" parameter from the request
        $type = $_GET['type'] ?? null;
        
    
        if (strtolower($type) === 'pending') {
            $searchQuery = $_GET['searchQuery'] ?? '';
            $department = $_GET['department'] ?? '';
            
            try {
                // Base query
                $sql = "SELECT id, name, studentId, registerId, departmentName, semester_id, 
                        application_date, payment_date, processing_date, processing_status, 
                        delivered_date, reason 
                        FROM transcript 
                        WHERE processing_status = :processing_status";
                
                // Add search conditions if provided
                $params = [':processing_status' => 'Pending'];
                
                if (!empty($searchQuery)) {
                    $sql .= " AND (name LIKE :searchQuery OR studentId LIKE :searchQuery OR registerId LIKE :searchQuery)";
                    $params[':searchQuery'] = "%$searchQuery%";
                }
                
                if (!empty($department)) {
                    $sql .= " AND departmentName = :department";
                    $params[':department'] = $department;
                }
                
                $query = $conn->prepare($sql);
                
                foreach ($params as $key => &$val) {
                    $query->bindParam($key, $val);
                }
                
                $query->execute();
                $students = $query->fetchAll(PDO::FETCH_ASSOC);
        
                if (empty($students)) {
                    echo json_encode(["status" => 1, "data" => []]);
                    return;
                }
        
                foreach ($students as &$student) {
                    // Fetch student info
                    $query1 = $conn->prepare("SELECT session_id FROM student_info WHERE studentId = :studentId AND registerId = :registerId");
                    $query1->bindParam(':studentId', $student['studentId']);
                    $query1->bindParam(':registerId', $student['registerId']);
                    $query1->execute();
                    $result = $query1->fetch(PDO::FETCH_ASSOC);
        
                    if ($result) {
                        $student = array_merge($student, $result);
                    }
                }
        
                echo json_encode(["status" => 1, "data" => $students]);
            } catch (Exception $e) {
                echo json_encode(["status" => 0, "message" => $e->getMessage()]);
            }
        }

        else if (strtolower($type) === 'addddd') {
            try {
                // Step 1: Get approved applications and payments
                $query = $conn->prepare("
                    SELECT 
                        a.studentId, 
                        a.registerId, 
                        a.semester_id, 
                        a.departmentName,
                        a.application_date,
                        p.payment_date
                    FROM 
                        applications a
                    INNER JOIN 
                        payments p ON a.studentId = p.studentId 
                            AND a.registerId = p.registerId 
                            AND a.semester_id = p.semester_id
                    WHERE 
                        a.status = 'approved' 
                        AND p.status = 'approved';
                ");
                
                $query->execute();
                $results = $query->fetchAll(PDO::FETCH_ASSOC);
        
                if (empty($results)) {
                    echo json_encode(["status" => 1, "message" => "No eligible records found.", "data" => []]);
                    return;
                }
        
                $processing_date = date('Y-m-d H:i:s');
        
                // Step 2: Prepare required queries
                $checkQuery = $conn->prepare("
                    SELECT id FROM transcript 
                    WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id
                ");
        
                $studentInfoQuery = $conn->prepare("
                    SELECT firstName, middleName, lastName 
                    FROM student_info 
                    WHERE studentId = :studentId AND registerId = :registerId
                ");
        
                $insertQuery = $conn->prepare("
                    INSERT INTO transcript (
                        name, studentId, registerId, semester_id, departmentName,
                        application_date, payment_date, processing_date
                    ) VALUES (
                        :name, :studentId, :registerId, :semester_id, :departmentName,
                        :application_date, :payment_date, :processing_date
                    )
                ");
        
                $conn->beginTransaction();
                $insertedCount = 0;
        
                foreach ($results as $row) {
                    // Check if already in transcript
                    $checkQuery->execute([
                        ':studentId' => $row['studentId'],
                        ':registerId' => $row['registerId'],
                        ':semester_id' => $row['semester_id']
                    ]);
        
                    if ($checkQuery->rowCount() === 0) {
                        // Get full name
                        $studentInfoQuery->execute([
                            ':studentId' => $row['studentId'],
                            ':registerId' => $row['registerId']
                        ]);
        
                        $student = $studentInfoQuery->fetch(PDO::FETCH_ASSOC);
        
                        if ($student && !empty($student['firstName'])) {
                            $fullName = trim(
                                $student['firstName'] . ' ' .
                                ($student['middleName'] ?? '') . ' ' .
                                $student['lastName']
                            );
        
                            $insertQuery->execute([
                                ':name' => $fullName,
                                ':studentId' => $row['studentId'],
                                ':registerId' => $row['registerId'],
                                ':semester_id' => $row['semester_id'],
                                ':departmentName' => $row['departmentName'],
                                ':application_date' => $row['application_date'],
                                ':payment_date' => $row['payment_date'],
                                ':processing_date' => $processing_date
                            ]);
        
                            $insertedCount++;
                        }
                    }
                }
        
                $conn->commit();
        
                echo json_encode([
                    "status" => 1,
                    "insertedCount" => $insertedCount,
                    "message" => "$insertedCount transcript(s) added successfully.",
                    "data" =>  $results
                ]);
        
            } catch (PDOException $e) {
                if ($conn->inTransaction()) {
                    $conn->rollBack();
                }
                echo json_encode([
                    "status" => 0,
                    "error" => "Database error occurred.",
                    "message" => $e->getMessage()
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    "status" => 0,
                    "error" => "General error occurred.",
                    "message" => $e->getMessage()
                ]);
            }
        }

        elseif (strtolower($type) === 'approved') {
            $searchQuery = $_GET['searchQuery'] ?? '';
            $department = $_GET['department'] ?? '';
            
            try {
                // Base query for approved transcripts
                $sql = "SELECT t.*, si.session_id 
                        FROM transcript t
                        LEFT JOIN student_info si ON t.studentId = si.studentId AND t.registerId = si.registerId
                        WHERE (t.transcript_file IS NOT NULL OR t.reason IS NOT NULL)";
                
                $params = [];
                
                // Add search conditions if provided
                if (!empty($searchQuery)) {
                    $sql .= " AND (t.name LIKE :searchQuery OR t.studentId LIKE :searchQuery OR t.registerId LIKE :searchQuery)";
                    $params[':searchQuery'] = "%$searchQuery%";
                }
                
                // Add department filter if provided
                if (!empty($department)) {
                    $sql .= " AND t.departmentName = :department";
                    $params[':department'] = $department;
                }
                
                $stmt = $conn->prepare($sql);
                
                // Bind parameters
                foreach ($params as $key => $value) {
                    $stmt->bindValue($key, $value);
                }
                
                $stmt->execute();
                $transcripts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
                // Process each record
                foreach ($transcripts as &$transcript) {
                    if (!empty($transcript['transcript_file'])) {
                        $transcript['transcript_file'] = base64_encode($transcript['transcript_file']);
                    }
                    
                    // Ensure session_id exists in the result
                    if (!isset($transcript['session_id'])) {
                        $transcript['session_id'] = null;
                    }
                }
        
                echo json_encode([
                    'status' => 1,
                    'data' => $transcripts
                ]);
                
            } catch (PDOException $e) {
                echo json_encode([
                    'status' => 0,
                    'message' => 'Database error: ' . $e->getMessage()
                ]);
            }
        }

        else if (strtolower($type) === 'imagedata') {
            $studentId = $_GET['studentId'] ?? null;
            $registerId = $_GET['registerId'] ?? null;
            $semester_id = $_GET['semester_id'] ?? null;
        
            if (!$studentId || !$registerId || !$semester_id) {
                echo json_encode([
                    'status' => 0,
                    'message' => 'Missing required parameters.'
                ]);
                exit;
            }
        
            try {
                // Fetch applications image data
                $sql = "SELECT previous_transcript_image, image_file FROM applications  
                        WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id AND status = 'Approved'";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':studentId', $studentId);
                $stmt->bindParam(':registerId', $registerId);
                $stmt->bindParam(':semester_id', $semester_id);
                $stmt->execute();
                $applicationData = $stmt->fetch(PDO::FETCH_ASSOC);
        
                if (!empty($applicationData['previous_transcript_image'])) {
                    $applicationData['previous_transcript_image'] = base64_encode($applicationData['previous_transcript_image']);
                } else {
                    $applicationData['previous_transcript_image'] = null;
                }
        
                if (!empty($applicationData['image_file'])) {
                    $applicationData['image_file'] = base64_encode($applicationData['image_file']);
                } else {
                    $applicationData['image_file'] = null;
                }
        
                // Fetch payment image data
                $sql = "SELECT image_file FROM payments 
                        WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id AND status = 'Approved'";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':studentId', $studentId);
                $stmt->bindParam(':registerId', $registerId);
                $stmt->bindParam(':semester_id', $semester_id);
                $stmt->execute();
                $paymentData = $stmt->fetch(PDO::FETCH_ASSOC);
        
                if (!empty($paymentData['image_file'])) {
                    $paymentData['payment_image_file'] = base64_encode($paymentData['image_file']);
                } else {
                    $paymentData['payment_image_file'] = null;
                }
                unset($paymentData['image_file']);
        
                // Merge both sets of data
                $finalData = array_merge($applicationData, $paymentData);
        
                echo json_encode([
                    'status' => 1,
                    'data' => $finalData
                ]);
        
            } catch (PDOException $e) {
                echo json_encode([
                    'status' => 0,
                    'message' => 'Database error: ' . $e->getMessage()
                ]);
            }
        }
        
 
      
    break;
    
    case "POST":
        $studentId = $_POST['studentId'] ?? null;
        $registerId = $_POST['registerId'] ?? null;
        $semester_id = $_POST['semester_id'] ?? null;
        $id = $_POST['id'] ?? null;
        $reason = $_POST['reason'] ?? null;
    
        // ✅ 1. If a file is uploaded, update with file
        if (isset($_FILES['transcript_file']) && $_FILES['transcript_file']['error'] === 0) {
            $fileTmpPath = $_FILES['transcript_file']['tmp_name'];
            $fileData = file_get_contents($fileTmpPath);
    
            try {
                $query = $conn->prepare("
                    UPDATE transcript 
                    SET 
                        transcript_file = :file, 
                        processing_status = 'Completed', 
                        receive_status = 'Received',
                        receive_date = NOW()
                    WHERE studentId = :studentId 
                        AND registerId = :registerId 
                        AND semester_id = :semester_id 
                        AND id = :id
                ");
    
                $query->bindParam(':file', $fileData, PDO::PARAM_LOB);
                $query->bindParam(':studentId', $studentId);
                $query->bindParam(':registerId', $registerId);
                $query->bindParam(':semester_id', $semester_id);
                $query->bindParam(':id', $id);
    
                $query->execute();
    
                echo json_encode(["status" => 1, "message" => "PDF stored successfully."]);
            } catch (PDOException $e) {
                echo json_encode(["status" => 0, "message" => $e->getMessage()]);
            }
            exit();
        }
    
        // ✅ 2. If no file, but reason is provided
        if ($reason !== null && $reason !== "") {
            try {
                $query = $conn->prepare("
                    UPDATE transcript 
                    SET 
                        reason = :reason,  
                        processing_status = 'Rejected',  
                        receive_status = 'Not Received',
                        receive_date = NULL
                    WHERE studentId = :studentId 
                    AND registerId = :registerId 
                    AND semester_id = :semester_id 
                    AND id = :id
                ");
    
                $query->bindParam(':reason', $reason);
                $query->bindParam(':studentId', $studentId);
                $query->bindParam(':registerId', $registerId);
                $query->bindParam(':semester_id', $semester_id);
                $query->bindParam(':id', $id);
    
                $query->execute();
    
                echo json_encode(["status" => 1, "message" => "Reason updated successfully."]);
            } catch (PDOException $e) {
                echo json_encode(["status" => 0, "message" => $e->getMessage()]);
            }
            exit();
        }
    
        echo json_encode(["status" => 0, "message" => "No file or reason provided."]);
    break;

    case "PUT":
        // Only use when student hardcopy received
        $data = json_decode(file_get_contents("php://input"));
        $id = $data->id ?? null;
        $studentId = $data->studentId ?? null;
        $registerId = $data->registerId ?? null;
        $semester_id = $data->semester_id ?? null;
    
        if ($id && $studentId && $registerId && $semester_id) {
            try {
                // First check if delivered_date is already set
                $checkQuery = $conn->prepare("
                    SELECT delivered_date 
                    FROM transcript 
                    WHERE id = :id 
                      AND studentId = :studentId 
                      AND registerId = :registerId 
                      AND semester_id = :semester_id
                    LIMIT 1
                ");
    
                $checkQuery->bindParam(':id', $id);
                $checkQuery->bindParam(':studentId', $studentId);
                $checkQuery->bindParam(':registerId', $registerId);
                $checkQuery->bindParam(':semester_id', $semester_id);
                $checkQuery->execute();
    
                $row = $checkQuery->fetch(PDO::FETCH_ASSOC);
    
                if ($row && $row['delivered_date'] !== null && $row['delivered_date'] !== '0000-00-00 00:00:00') {
                    echo json_encode([
                        "status" => 0,
                        "message" => "Delivered date already set on: " . $row['delivered_date']
                    ]);
                    exit;
                }
    
                // If not set, update it
                $updateQuery = $conn->prepare("
                    UPDATE transcript 
                    SET delivered_date = NOW(), delivered_status = 'Delivered'
                    WHERE id = :id 
                      AND studentId = :studentId 
                      AND registerId = :registerId 
                      AND semester_id = :semester_id
                ");
    
                $updateQuery->bindParam(':id', $id);
                $updateQuery->bindParam(':studentId', $studentId);
                $updateQuery->bindParam(':registerId', $registerId);
                $updateQuery->bindParam(':semester_id', $semester_id);
                $updateQuery->execute();
    
                echo json_encode([
                    "status" => 1,
                    "message" => "Delivered date updated successfully."
                ]);
            } catch (PDOException $e) {
                echo json_encode([
                    "status" => 0,
                    "message" => "Database error: " . $e->getMessage()
                ]);
            }
        } else {
            echo json_encode([
                "status" => 0,
                "message" => "Missing required fields."
            ]);
        }
        exit;
    break;
    
    default:
        echo json_encode(["error" => "Invalid request method"]);
    break;

    }    

?>