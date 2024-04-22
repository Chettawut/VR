<?php
ob_start();
include_once(dirname(__FILE__, 2)."/onload.php");
$db = new DbConnect;
$conn = $db->connect(); 

if ($_SERVER["REQUEST_METHOD"] == "GET"){
    extract($_GET, EXTR_OVERWRITE, "_"); 
    try { 
        $p = $p ?? "";
        $key = $key ?? "";
        $res = null;
        if ($p == 'shelf_life') {
            $sql = "select distinct value from ( SELECT shelf_life `value` FROM `spmaster` WHERE (shelf_life is not null) and (shelf_life <> '')  order by created_date desc limit 10) a"; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  

        } else if ($p == 'storage_conditions') {
            $sql = "select distinct value from ( SELECT storage_conditions `value` FROM `spmaster` WHERE (storage_conditions is not null) and (storage_conditions <> '')  order by created_date desc limit 10) a"; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);   
        } else if ($p == 'allergen_standards') {
            $sql = "select distinct value from ( SELECT allergen_standards `value` FROM `spmaster` WHERE (allergen_standards is not null) and (allergen_standards <> '')  order by created_date desc limit 10) a"; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);   

        } else if ($p == 'approve-status') {
            $sql = "select distinct value from ( SELECT allergen_standards `value` FROM `spmaster` WHERE (allergen_standards is not null) and (allergen_standards <> '')  order by created_date desc limit 10) a"; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  

        }

        http_response_code(200);
        echo json_encode(array("data"=>$res));
    } catch (mysqli_sql_exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally{
        // Ignore
        
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush(); 
exit;
?>