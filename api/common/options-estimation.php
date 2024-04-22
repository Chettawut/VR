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
        if($p == 'product-and-packing') {
            $sql = "select 
            e.spcode,
            e.spname,
            ed.id estimation_detailid,
            ed.estcode,
            ed.packingsetid,
            ed.fill_volume,
            ed.declared,
            ed.margin,
            ed.netweight,
            ed.gross_weight_carton,
            ed.unit_cost unit_carton,
            ed.productcost,
            ed.othercost,
            ed.otherweight,
            ed.exworkcost_carton,
            ed.exworksell_price,
            pks.packingset_name,
            pks.dimension 
            from estimation e
            join estimation_detail ed on e.estcode = ed.estcode
            join packingset pks on ed.packingsetid = pks.id";
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