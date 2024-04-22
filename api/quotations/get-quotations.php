<?php
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
http_response_code(400);
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");  
    $quotcode = !empty($quotcode) ? "and a.quotcode like '%$quotcode%'" : "";
    $cuscode = !empty($cuscode) ? "and a.cuscode like '%$cuscode%'" : "";
    $cusname = !empty($cusname) ? "and a.cusname like '%$cusname%'" : "";
    // $spcode_cdt = !empty($spcode) ? "and e.spcode like '%$spcode%'" : "";
    // $spname_cdt = !empty($spname) ? "and e.spname like '%$spname%'" : "";
    $created_by = !empty($created_by) ? "and ( u.firstname like '%$created_by%' or u.lastname like '%$created_by%' )" : "";
    $quotdate = "";
    if( !empty($quotdate_form) && !empty($quotdate_to) ) {
        $quotdate = "and date_format( a.quotdate, '%Y-%m-%d' ) >= '$quotdate_form' and date_format( a.quotdate, '%Y-%m-%d' ) <= '$quotdate_to' ";
    } 
    // $spdate_cdt = "";
    // if( !empty($spdate_form) && !empty($spdate_to) ) {
    //     $spdate_cdt = "and date_format( s.spdate, '%Y-%m-%d' ) >= '$spdate_form' and date_format( s.spdate, '%Y-%m-%d' ) <= '$spdate_to' ";
    // } 

    try {   
        $sql = " 
        select 
        a.*,
        concat(u.firstname, ' ', u.lastname) created_name
        from quotations a
        left join user u on a.created_by = u.code
        where 1 = 1 and a.status = 'Y'
        $quotcode
        $cuscode
        $cusname
        $created_by
        $quotdate
        order by a.created_date desc ;";
        // $estimate_code_cdt
        // $spcode_cdt
        // $spname_cdt
        // $created_date_cdt
        // $created_by_cdt
        // $spdate_cdt
        // order by e.created_date desc ;";

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
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush(); 
exit;
?>