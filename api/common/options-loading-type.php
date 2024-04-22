<?php 
ob_start();
include_once(dirname(__FILE__, 2)."/onload.php");
$db = new DbConnect;
$conn = $db->connect(); 
http_response_code(400);
if ($_SERVER["REQUEST_METHOD"] == "GET"){
    extract($_GET, EXTR_OVERWRITE, "_"); 
    try { 
        $p = $p ?? "";
        $res = null;
        if($p == 'shipping-type-name') {
            $sql = "select distinct value from (select shippingtype_name value from shippingtype where 1 = 1 and status = 'Y' order by created_date desc) a;";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        }else if($p == 'shipping-expense-name') {
            $sql = "select distinct value from (select expense_name value from shippingtype_terms where 1 = 1 order by created_date desc) a;";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        } else if($p == 'packing-set') {
            $packingsetid =  !empty($pkset) ? "and pl.packingsetid = $pkset" : "";
            $sql = "select pl.*
            from packingset_loadingtype pl
            where 1 = 1 $packingsetid";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        }  else {
            $packingsetid =  !empty($pkset) ? "and pl.packingsetid = $pkset" : "";
            $sql = "select pl.id loaddingtype_id, pl.qty loadingtype_qty, pl.loadingtype_name
            from packingset_loadingtype pl
            where 1 = 1 $packingsetid";
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