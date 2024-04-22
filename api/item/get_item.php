<?php
	error_reporting(E_ERROR | E_PARSE);
	ini_set('display_errors', 1);
	// header("Access-Control-Allow-Origin: *");
	// header("Access-Control-Allow-Headers: *");
	// header("Access-Control-Allow-Methods: *");
	
	include '../conn.php';

	extract($_POST, EXTR_OVERWRITE, "_");  
    $stcode = !empty($stcode) ? "and a.stcode like '%$stcode%'" : "";
	$stname = !empty($stname) ? "and a.stname like '%$stname%'" : "";
	$stnameEN = !empty($stnameEN) ? "and a.stnameEN like '%$stnameEN%'" : "";
	$express_code = !empty($express_code) ? "and a.express_code like '%$express_code%'" : "";
	$halal = !empty($halal) ? "and a.halal = '$halal'" : "";
    // $created_date_cdt = "";
    // if( !empty($created_form) && !empty($created_to) ) {
    //     $created_date_cdt = "and date_format( a.created_date, '%Y-%m-%d' ) >= '$created_form' and date_format( a.created_date, '%Y-%m-%d' ) <= '$created_to' ";
    // } 
    // $created_by_cdt = !empty($created_by) ? "and sub.created_name like '%$created_by%'" : ""; 
    // $delivery_date_cdt = "";
    // if( !empty($dndate_form) && !empty($dndate_to) ) {
    //     $delivery_date_cdt = "and date_format( d.dndate, '%Y-%m-%d' ) >= '$dndate_form' and date_format( d.dndate, '%Y-%m-%d' ) <= '$dndate_to' ";
    // } 

    try {   
        $sql = "
        SELECT 
            a.id, 
            a.stcode,
            a.express_code,
            a.stnameEN,
            a.stname, 
            a.price,
            b.typename,
            a.status as statusitem,
            ac.str file_attach
        FROM `items` as a
        join `type` as b on (a.typecode=b.typecode)
        left join (
            select aa.refcode, group_concat(  aa.id SEPARATOR ',' ) str
            from attachments_control aa where lower(aa.ref) = 'items'
            group by aa.refcode
        ) ac on a.stcode = ac.refcode    
        where 1 = 1
            $stcode
			$stname
			$stnameEN
			$halal
            $express_code
		order by a.created_date desc;"; 
        $stmt = $conn->prepare($sql); 
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  

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
        $conn = null;
        
    }    
	
?>