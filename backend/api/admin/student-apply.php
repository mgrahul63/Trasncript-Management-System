<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");
 
include '../../config//databse.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $type = isset($_GET['type']) ? $_GET['type'] : '';
        try {
            if ($type === 'applyData') {

                $department_id = $_GET['department_id'] ?? '';
                $faculty_id = $_GET['faculty_id'] ?? '';
                $searchQuery = $_GET['searchQuery'] ?? '';
                $department = $_GET['department'] ?? '';
            
                // First, get the departmentName
                $query1 = $conn->prepare("SELECT name FROM departments WHERE department_id = :department_id AND faculty_id = :faculty_id");
                $query1->bindParam(':department_id', $department_id, PDO::PARAM_STR);
                $query1->bindParam(':faculty_id', $faculty_id, PDO::PARAM_STR);
                $query1->execute();
            
                $departName = $query1->fetch(PDO::FETCH_ASSOC);
            
                if ($departName) {
                    $departmentName = $departName['name'];
            
                    // Build base query
                    $sql = "SELECT * FROM applications WHERE status = 'Pending' AND departmentName = :departmentName";
            
                    // Add search filters
                    if (!empty($searchQuery)) {
                        $sql .= " AND (studentId LIKE :searchQuery OR registerId LIKE :searchQuery)";
                    } elseif (!empty($department)) {
                        $sql .= " AND departmentName LIKE :department";
                    }
            
                    $query = $conn->prepare($sql);
            
                    // Bind base parameter
                    $query->bindParam(':departmentName', $departmentName, PDO::PARAM_STR);
            
                    // Bind search filters if present
                    if (!empty($searchQuery)) {
                        $searchTerm = '%' . $searchQuery . '%';
                        $query->bindParam(':searchQuery', $searchTerm, PDO::PARAM_STR);
                    } elseif (!empty($department)) {
                        $searchDept = '%' . $department . '%';
                        $query->bindParam(':department', $searchDept, PDO::PARAM_STR);
                    }
            
                    $query->execute();
                    $students = $query->fetchAll(PDO::FETCH_ASSOC);
            
                    if ($students) {
                        $response = [];
            
                        foreach ($students as $result) {
                            $application = [];
            
                            foreach ($result as $key => $value) {
                                if ($key === 'image_file' || $key === 'previous_transcript_image') {
                                    $application[$key] = !empty($value)
                                        ? 'data:image/jpeg;base64,' . base64_encode($value)
                                        : null;
                                } else {
                                    $application[$key] = $value;
                                }
                            }
            
                            $response[] = $application;
                        }
            
                        echo json_encode(['status' => 1, 'data' => $response]);
                    } else {
                        echo json_encode(['status' => 0, 'message' => 'No applications found']);
                    }
                } else {
                    echo json_encode(['status' => 0, 'error' => 'Department not found']);
                }
            }
            else if ($type === 'completeData') {

                $department_id = $_GET['department_id'] ?? '';
                $faculty_id = $_GET['faculty_id'] ?? '';
                $searchQuery = $_GET['searchQuery'] ?? '';
                $department = $_GET['department'] ?? '';
            
                // First, get the departmentName
                $query1 = $conn->prepare("SELECT name FROM departments WHERE department_id = :department_id AND faculty_id = :faculty_id");
                $query1->bindParam(':department_id', $department_id, PDO::PARAM_STR);
                $query1->bindParam(':faculty_id', $faculty_id, PDO::PARAM_STR);
                $query1->execute();
            
                $departName = $query1->fetch(PDO::FETCH_ASSOC);
            
                if ($departName) {
                    $departmentName = $departName['name'];
            
                    // Build base query
                    $sql = "SELECT * FROM applications WHERE status = 'Approved' AND departmentName = :departmentName";
            
                    // Add search filters
                    if (!empty($searchQuery)) {
                        $sql .= " AND (studentId LIKE :searchQuery OR registerId LIKE :searchQuery)";
                    } elseif (!empty($department)) {
                        $sql .= " AND departmentName LIKE :department";
                    }
            
                    $query = $conn->prepare($sql);
            
                    // Bind base parameter
                    $query->bindParam(':departmentName', $departmentName, PDO::PARAM_STR);
            
                    // Bind search filters if present
                    if (!empty($searchQuery)) {
                        $searchTerm = '%' . $searchQuery . '%';
                        $query->bindParam(':searchQuery', $searchTerm, PDO::PARAM_STR);
                    } elseif (!empty($department)) {
                        $searchDept = '%' . $department . '%';
                        $query->bindParam(':department', $searchDept, PDO::PARAM_STR);
                    }
            
                    $query->execute();
                    $students = $query->fetchAll(PDO::FETCH_ASSOC);
            
                    if ($students) {
                        $response = [];
            
                        foreach ($students as $result) {
                            $application = [];
            
                            foreach ($result as $key => $value) {
                                if ($key === 'image_file' || $key === 'previous_transcript_image') {
                                    $application[$key] = !empty($value)
                                        ? 'data:image/jpeg;base64,' . base64_encode($value)
                                        : null;
                                } else {
                                    $application[$key] = $value;
                                }
                            }
            
                            $response[] = $application;
                        }
            
                        echo json_encode(['status' => 1, 'data' => $response]);
                    } else {
                        echo json_encode(['status' => 0, 'message' => 'No applications found']);
                    }
                } else {
                    echo json_encode(['status' => 0, 'error' => 'Department not found']);
                }
            }
            else if ($type === 'newpaymentData') {
                // Fetch approved applications
                $query = $conn->prepare("SELECT * FROM applications WHERE status = 'Approved'");
                $query->execute();
                $students = $query->fetchAll(PDO::FETCH_ASSOC);
            
                if ($students) {
                    $response = [];
            
                    foreach ($students as $result) {
                        $application = [];
            
                        // Process each field
                        foreach ($result as $key => $value) {
                            if ($key == 'image_file' || $key == 'previous_transcript_image') {
                                $application[$key] = !empty($value) ? 'data:image/jpeg;base64,' . base64_encode($value) : null;
                            } else {
                                $application[$key] = $value;
                            }
                        }
            
                        $response[] = $application;
                    }
            
                    if (count($response) > 0) {
                        $studentsData = [];
            
                        foreach ($response as $result) {
                            $studentId = $result['studentId'] ?? '';
                            $registerId = $result['registerId'] ?? '';
                            $semesterId = $result['semester_id'] ?? '';
                            $applyType = $result['apply_type'] ?? '';
            
                            // Build SQL for payments with proper condition
                            $sql = "SELECT * FROM payments WHERE studentId = :studentId AND registerId = :registerId AND status = 'Pending'";
            
                            if (!empty($semesterId)) {
                                $sql .= " AND semester_id = :semesterId";
                            }
                            if (!empty($applyType)) {
                                $sql .= " AND apply_type = :applyType";
                            }
            
                            $stmt = $conn->prepare($sql);
                            $stmt->bindParam(':studentId', $studentId);
                            $stmt->bindParam(':registerId', $registerId);
            
                            if (!empty($semesterId)) {
                                $stmt->bindParam(':semesterId', $semesterId);
                            }
                            if (!empty($applyType)) {
                                $stmt->bindParam(':applyType', $applyType);
                            }
            
                            if ($stmt->execute()) {
                                $payments = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
            
                                // Only store application if there is at least one payment
                                if (count($payments) > 0) {
                                    foreach ($payments as &$payment) {
                                        if (!empty($payment['image_file'])) {
                                            $payment['image_file'] = 'data:image/jpeg;base64,' . base64_encode($payment['image_file']);
                                        }
                                    }
            
                                    $studentsData[] = [
                                        "applicationData" => $result,
                                        "payments" => $payments
                                    ];
                                }
                            } else {
                                echo json_encode(["status" => 0, "message" => "Failed to retrieve payment records."]);
                                exit;
                            }
                        }
            
                        // Final response
                        if (count($studentsData) > 0) {
                            echo json_encode(['status' => 1, 'data' => $studentsData]);
                        } else {
                            echo json_encode(['status' => 0, 'message' => 'No applications with pending payments found.']);
                        }
            
                    } else {
                        echo json_encode(['status' => 0,"message" => "No applications found"]);
                    }
                } else {
                    echo json_encode([ 'status' => 0,'error' => 'No applications found']);
                }
            }
            else if ($type === 'completepaymentData') {
                // Prepare the SQL query for the join
                $sql = "
                    SELECT 
                        app.studentId,
                        app.registerId,
                        app.semester_id,
                        app.apply_type
                    FROM 
                        applications app
                    INNER JOIN 
                        payments pay ON app.studentId = pay.studentId 
                                    AND app.registerId = pay.registerId
                                    AND app.semester_id = pay.semester_id
                                    AND app.apply_type = pay.apply_type
                    WHERE 
                        app.status = 'approved'
                        AND pay.status = 'approved'
                ";
            
                // Execute the query
                $query = $conn->prepare($sql);
                $query->execute();
            
                // Fetch the result
                $oldData = $query->fetchAll(PDO::FETCH_ASSOC);
            
                // Now loop through the oldData and query the applications and payments tables
                $applicationsDetails = [];
            
                foreach ($oldData as $data) {
                    // Use the studentId, registerId, and other fields to query the applications table again
                    $studentId = $data['studentId'];
                    $registerId = $data['registerId'];
                    $semester_id = $data['semester_id'];
                    $apply_type = $data['apply_type'];
            
                    // Query the applications table
                    $sqlDetails = "
                        SELECT * 
                        FROM applications 
                        WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id AND apply_type = :apply_type
                    ";
            
                    $stmt = $conn->prepare($sqlDetails);
                    $stmt->bindParam(':studentId', $studentId);
                    $stmt->bindParam(':semester_id', $semester_id);
                    $stmt->bindParam(':registerId', $registerId);
                    $stmt->bindParam(':apply_type', $apply_type);
                    $stmt->execute();
                    $details = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
                    // Loop through the application details and encode image fields
                    foreach ($details as &$appData) {
                        // Check if the 'image_file' field exists and is not empty
                        if (!empty($appData['image_file'])) {
                            $appData['image_file'] = 'data:image/jpeg;base64,' . base64_encode($appData['image_file']);
                        }
            
                        // Check if 'previous_transcript_image' exists and is not empty
                        if (!empty($appData['previous_transcript_image'])) {
                            $appData['previous_transcript_image'] = 'data:image/jpeg;base64,' . base64_encode($appData['previous_transcript_image']);
                        }
                    }
            
                    // Query the payments table
                    $sqlPayments = "
                        SELECT * 
                        FROM payments 
                        WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id AND apply_type = :apply_type
                    ";
            
                    $stmtPayments = $conn->prepare($sqlPayments);
                    $stmtPayments->bindParam(':studentId', $studentId);
                    $stmtPayments->bindParam(':semester_id', $semester_id);
                    $stmtPayments->bindParam(':registerId', $registerId);
                    $stmtPayments->bindParam(':apply_type', $apply_type);
                    $stmtPayments->execute();
                    $payments = $stmtPayments->fetchAll(PDO::FETCH_ASSOC);
            
                    // Loop through the payment details and encode image fields
                    foreach ($payments as &$payData) {
                        // Check if the 'image_file' field exists and is not empty
                        if (!empty($payData['image_file'])) {
                            $payData['image_file'] = 'data:image/jpeg;base64,' . base64_encode($payData['image_file']);
                        }
                    }
            
                    // Store the application and payment details along with the oldData
                    $applicationsDetails[] = [ 
                        'applicationDetails' => $details[0],
                        'paymentsDetails' => $payments[0]
                    ];
                }
            
                // Return the data as JSON
                if($applicationsDetails){
                    echo json_encode(["status" => 1, "data" => $applicationsDetails]);
                } else {
                    echo json_encode(["status" => 1, "data" => []]);
                }
            }
            else {
                echo json_encode(["status" => 0, "message" => "No Registrations found."]);
                exit();
            }
        } catch (Exception $e) {
            echo json_encode(["error" => "Database query failed.", "message" => $e->getMessage()]);
        }
    break;
    
    case 'POST':
            // Assuming you're receiving a JSON payload with the studentId (or registerId)
            $data = json_decode(file_get_contents("php://input"), true);
            $type = $data['type'] ?? '';
            $studentId = $data['studentId'] ?? ''; 
            $registerId = $data['registerId'] ?? ''; 
            $semester_id = $data['semesterId'] ?? ''; 

        if ($type === 'applyApproveEdit') {

            // Check if all required fields are provided
            if (empty($studentId) || empty($registerId) || empty($semester_id)) {
                echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
                break;
            }
    
            // Prepare the SQL query to check if the record exists
            $sql = "SELECT * FROM applications WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
            $stmt = $conn->prepare($sql);
    
            // Bind parameters
            $stmt->bindParam(':studentId', $studentId);
            $stmt->bindParam(':registerId', $registerId);
            $stmt->bindParam(':semester_id', $semester_id);
    
            // Execute the query
            $stmt->execute();
    
            // Fetch the result
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Check if the record exists
            if (count($results) > 0) {
                // If the record exists, update the status to 'approve'
                $updateSql = "UPDATE applications SET status = 'approved' WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
                $updateStmt = $conn->prepare($updateSql);
    
                // Bind parameters for the update query
                $updateStmt->bindParam(':studentId', $studentId);
                $updateStmt->bindParam(':registerId', $registerId);
                $updateStmt->bindParam(':semester_id', $semester_id);
    
                // Execute the update query
                $updateStmt->execute();
    
                // Check if the update was successful
                if ($updateStmt->rowCount() > 0) {
                    echo json_encode(['status' => 1, 'message' => 'Application approved']);
                } else {
                    echo json_encode(['status' => 0, 'message' => 'Failed to update application status']);
                }
            } else {
                echo json_encode(['status' => 0, 'message' => 'No matching application found']);
            }
    
        } 
        else if ($type === 'paymentApproveEdit') {
            if (empty($studentId) || empty($registerId) || empty($semester_id)) {
                echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
                break;
            }
        
            $sql = "SELECT * FROM payments WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':studentId', $studentId);
            $stmt->bindParam(':registerId', $registerId);
            $stmt->bindParam(':semester_id', $semester_id);
            $stmt->execute();
            $paymentData = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if ($paymentData) {
                $updateSql = "UPDATE payments SET status = 'Approved' WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
                $updateStmt = $conn->prepare($updateSql);
                $updateStmt->bindParam(':studentId', $studentId);
                $updateStmt->bindParam(':registerId', $registerId);
                $updateStmt->bindParam(':semester_id', $semester_id);
                $updateStmt->execute();
        
                if ($updateStmt->rowCount() > 0) {
                    $studentInfoQuery = $conn->prepare("
                        SELECT firstName, middleName, lastName 
                        FROM student_info 
                        WHERE studentId = :studentId AND registerId = :registerId
                    ");
                    $studentInfoQuery->bindParam(':studentId', $studentId);
                    $studentInfoQuery->bindParam(':registerId', $registerId);
                    $studentInfoQuery->execute();
                    $studentInfo = $studentInfoQuery->fetch(PDO::FETCH_ASSOC);
        
                    $appQuery = $conn->prepare("
                        SELECT application_date, departmentName 
                        FROM applications 
                        WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id
                    ");
                    $appQuery->bindParam(':studentId', $studentId);
                    $appQuery->bindParam(':registerId', $registerId);
                    $appQuery->bindParam(':semester_id', $semester_id);
                    $appQuery->execute();
                    $applicationData = $appQuery->fetch(PDO::FETCH_ASSOC);
        
                    $processing_date = date('Y-m-d H:i:s');
        
                    $insertQuery = $conn->prepare("
                        INSERT INTO transcript (
                            name, studentId, registerId, semester_id, departmentName,
                            application_date, payment_date, processing_date
                        ) VALUES (
                            :name, :studentId, :registerId, :semester_id, :departmentName,
                            :application_date, :payment_date, :processing_date
                        )
                    ");
                    $fullName = $studentInfo['firstName'] . ' ' . $studentInfo['middleName'] . ' ' . $studentInfo['lastName'];
                    $insertQuery->bindParam(':name', $fullName);
                    $insertQuery->bindParam(':studentId', $studentId);
                    $insertQuery->bindParam(':registerId', $registerId);
                    $insertQuery->bindParam(':semester_id', $semester_id);
                    $insertQuery->bindParam(':departmentName', $applicationData['departmentName']);
                    $insertQuery->bindParam(':application_date', $applicationData['application_date']);
                    $insertQuery->bindParam(':payment_date', $paymentData['payment_date']);
                    $insertQuery->bindParam(':processing_date', $processing_date);
        
                    $insertQuery->execute();
        
                    if ($insertQuery->rowCount() > 0) {
                        echo json_encode(['status' => 'success', 'message' => 'Payment approved and transcript created']);
                    } else {
                        echo json_encode(['status' => 'error', 'message' => 'Failed to create transcript']);
                    }
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Failed to update Payment status']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No matching application found']);
            }
        }
        
        else if($type === 'applyRejectEdit') {
            $reason = $data['reason'] ?? null;
        
            if (empty($studentId) || empty($registerId) || empty($semester_id) || empty($reason)) {
                echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
                break;
            }
        
            $sql = "SELECT rejection_reasons FROM applications WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':studentId', $studentId);
            $stmt->bindParam(':registerId', $registerId);
            $stmt->bindParam(':semester_id', $semester_id);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if ($result) {
                // Decode existing rejection reasons
                $existingReasons = !empty($result['rejection_reasons']) ? json_decode($result['rejection_reasons'], true) : [];
        
                // Add the new reason with current timestamp
                $timestamp = date("Y-m-d H:i:s");
                $existingReasons[] = [$reason, $timestamp];
        
                // Encode back to JSON
                $updatedReasonsJson = json_encode($existingReasons);
        
                // Update the application status and rejection reasons
                $updateSql = "UPDATE applications 
                              SET status = 'Rejected', rejection_reasons = :rejection_reasons 
                              WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
                $updateStmt = $conn->prepare($updateSql);
                $updateStmt->bindParam(':rejection_reasons', $updatedReasonsJson);
                $updateStmt->bindParam(':studentId', $studentId);
                $updateStmt->bindParam(':registerId', $registerId);
                $updateStmt->bindParam(':semester_id', $semester_id);
                $updateStmt->execute();
        
                if ($updateStmt->rowCount() > 0) {

                    echo json_encode(['status' => 1, 'message' => 'Application Rejected with reason']);
                } else {
                    echo json_encode(['status' => 0, 'message' => 'Failed to update application']);
                }
            } else {
                echo json_encode(['status' => 0, 'message' => 'No matching application found']);
            }
        }
        else if ($type ==='paymentRejectEdit') {
            $reason = $data['reason'] ?? null;
        
            if (empty($studentId) || empty($registerId) || empty($semester_id) || empty($reason)) {
                echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
                break;
            }
        
            $sql = "SELECT transaction_id, reason FROM payments WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':studentId', $studentId);
            $stmt->bindParam(':registerId', $registerId);
            $stmt->bindParam(':semester_id', $semester_id);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if ($result) {
                // Decode existing rejection reasons
                $existingReasons = !empty($result['reason']) ? json_decode($result['reason'], true) : [];
                $transaction_id = $result['transaction_id'];
                // Add the new reason with current timestamp
                $timestamp = date("Y-m-d H:i:s");
                $existingReasons[] = [$transaction_id, $reason, $timestamp];
        
                // Encode back to JSON
                $updatedReasonsJson = json_encode($existingReasons);

                 // Update the application status and rejection reasons
                 $updateSql = "UPDATE payments 
                            SET status = 'Rejected', reason = :reason 
                            WHERE studentId = :studentId AND registerId = :registerId AND semester_id = :semester_id";
                $updateStmt = $conn->prepare($updateSql);
                $updateStmt->bindParam(':reason', $updatedReasonsJson);
                $updateStmt->bindParam(':studentId', $studentId);
                $updateStmt->bindParam(':registerId', $registerId);
                $updateStmt->bindParam(':semester_id', $semester_id);
                $updateStmt->execute();

                if ($updateStmt->rowCount() > 0) {
                    echo json_encode(['status' => 'success', 'message' => 'Application Rejected with reason']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Failed to update application']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No matching application found']);
            }
        } 
        else {
            echo json_encode(['status' => 'error', 'message' => 'No matching Payment found']);
        }    
    break;
    
    default:
        echo json_encode(["error" => "Invalid request method"]);
    break;

}
?>

 