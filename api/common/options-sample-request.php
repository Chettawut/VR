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
        if($p == 'srcode-option'){
            $sql = "select distinct srcode `id`,  srcode `text` from srmaster s;";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        } else if($p == 'paraname-option') {
            $ref_key = ($key != "") ? "and i.spcode = '$key'" : "";
            $sql = "
            select distinct i.paraname `id`, i.paraname `text` 
            from spparameter i
            where 1 = 1 
            $ref_key"; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  
        } else if ($p == 'sample-request-master') {
            $sql = "select 
            s.srcode, 
            s.srdate, 
            s.duedate, 
            s.cuscode, 
            c.cusname, 
            s.description,
            sd.spresult_array
            from srmaster s join customer c on s.cuscode = c.cuscode 
            join (
                select
                    ss.srcode,
                    group_concat(  ss.spname SEPARATOR '' ) spcheck,
                    group_concat( concat( '<div><span> - ', ss.spname, '</span></div>') SEPARATOR '' ) spresult,
                    concat('[',group_concat( concat( '\"', ss.spname, '\"') SEPARATOR ',' ), ']') spresult_array
                from srdetail ss
                group by ss.srcode
            ) sd on s.srcode = sd.srcode
            where 1 = 1 and s.srstatus = 'pending' 
            and exists( select 1 from spmaster sp where sp.srcode = s.srcode limit 1 )"; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  
        } else if ($p == 'sample-request-detail') {
            $sql = "
            select 
            s2.id,
            s.srcode, 
            s2.spname, 
            s2.pkcode, 
            s2.pkname, 
            s.srdate, 
            s.duedate, 
            s.cuscode, 
            c.cusname, 
            s.description 
            from srmaster s 
            join srdetail s2 on s.srcode =  s2.srcode  
            join customer c on s.cuscode = c.cuscode 
            where 1 = 1 and srstatus = 'pending' "; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  
        }  else if ($p == 'shelf_life') {
            $sql = "select s.srcode, s.srdate, s.duedate, s.cuscode, c.cusname, s.description from srmaster s join customer c on s.cuscode = c.cuscode where 1 = 1"; 

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