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
            $sql = "
            select
            l.id shippingtype_id,
            l.shippingtype_name,
            lts.price
            from shippingtype l
            left join (
                select 
                ls.shippingtype_id,  
                sum( price ) price 
                from shippingtype_terms ls  
                group by ls.shippingtype_id
            ) lts on l.id =  lts.shippingtype_id
            where 1 = 1 and l.status = 'Y'";
            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response_result = $res;
            $sql = "select * from shippingtype_terms where shippingtype_id = :id"; 
            foreach( $response_result as $ind => $val){
                $stmt = $conn->prepare($sql); 
                if (!$stmt->execute([ 'id' => $val["shippingtype_id"] ])){
                    $error = $conn->errorInfo(); 
                    http_response_code(404);
                    throw new PDOException("Geting data error => $error");
                }
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC); 
    
                $res[$ind]['shipping_terms'] = $result;
            } 
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