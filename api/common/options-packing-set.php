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
        if($p == 'group') {
            $sql = "
			select i.* , concat(u.firstname, ' ', u.lastname) created_name, concat(u1.firstname, ' ', u1.lastname) updated_name
            from packingset_group i
            left join user u on i.created_by  = u.code
            left join user u1 on i.updated_by  = u1.code
            where 1 = 1";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        } elseif($p == 'loading-type') {
            $sql = "select distinct( loadingtype_name ) value from packingset_loadingtype pl order by 1; ";
            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  
        } else {
            $sql = "
			select p.*, pg.packingset_group, concat(u.firstname, ' ', u.lastname) updated_name
            from packingset p
            left join packingset_group pg on p.packingset_groupid = pg.id
            left join user u on p.updated_by  = u.code
            where 1 = 1
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