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
        if($p == 'type') {
            $sql = "
			select i.*, UUID() `key`, concat(u.firstname, ' ', u.lastname) updated_name
            from pktype i
            left join user u on i.updated_by  = u.code
            where 1 = 1";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        } else {
            $sql = "
			select p.*, pt.pktype, s.supname, un.unit,  concat(u.firstname, ' ', u.lastname) updated_name
            from pkmaster p
            left join pktype pt on p.pktypeid = pt.id and pt.status = 'Y'
            left join supplier s on p.supcode = s.supcode
            left join unit un on p.unitid = un.unitcode
            left join user u on p.updated_by  = u.code
            where 1 = 1 and p.expscode is not null
            order by p.updated_date desc;";
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