<?php 
class DbConnect {
    private $server = 'localhost'; // Check if MySQL uses a different port
    private $dbname = 'university'; // Ensure database exists
    private $user = 'root'; 
    private $pass = ''; // Ensure root has no password in XAMPP

    public function connect() {
        try {
            $conn = new PDO(
                "mysql:host={$this->server};dbname={$this->dbname};charset=utf8", 
                $this->user, 
                $this->pass
            );
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (PDOException $e) {
            // Stop execution and return JSON response
            die(json_encode(["status" => 0, "message" => "Database connection failed. Please try again later.", "error" => $e->getMessage()]));
        }
    }
}
?>
