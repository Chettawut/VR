<?php 
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
include_once(dirname(__FILE__, 2)."/common/fnc-code.php");
include_once(dirname(__FILE__)."/fnc-query.php");

$db = new DbConnect;
$conn = $db->connect();
$conn->beginTransaction();
http_response_code(400); 
try {
    $action_date = date("Y-m-d H:i:s"); 
    $action_user = $token->userid;

    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true); 
        extract($_POST, EXTR_OVERWRITE, "_"); 
        
        $sql = sql__quotations(); 
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 

        $head = (object)$head;
        $stmt->bindParam(":quotcode", $head->quotcode, PDO::PARAM_STR);
        $stmt->bindParam(":quotdate", $head->quotdate, PDO::PARAM_STR);
        $stmt->bindParam(":cuscode",  $head->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":cusname",  $head->cusname, PDO::PARAM_STR);
        $stmt->bindParam(":contact",  $head->contact, PDO::PARAM_STR);
        $stmt->bindParam(":address",  $head->address, PDO::PARAM_STR);
        $stmt->bindParam(":tel", $head->tel, PDO::PARAM_STR);
        $stmt->bindParam(":email", $head->email, PDO::PARAM_STR);
        $stmt->bindParam(":valid_price_until", $head->valid_price_until, PDO::PARAM_STR);
        $stmt->bindParam(":dated_price_until", $head->dated_price_until, PDO::PARAM_STR);
        $stmt->bindParam(":payment_condition", $head->payment_condition, PDO::PARAM_STR);
        $stmt->bindParam(":price_terms", $head->price_terms, PDO::PARAM_STR);
        $stmt->bindParam(":currency", $head->currency, PDO::PARAM_STR);
        $stmt->bindParam(":rate", $head->rate, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $head->remark, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $head->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":vat", $head->vat, PDO::PARAM_STR);
        $stmt->bindParam(":grand_total_price", $head->grand_total_price, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        // var_dump($master); exit; 
        exec_insert_detail( $conn, $head, $detail, $bank );

        update_quotcode($conn);
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("id" => $code)));

    } else  if($_SERVER["REQUEST_METHOD"] == "PUT"){
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true); 
        extract($_PUT, EXTR_OVERWRITE, "_");

        // var_dump($_POST);
        $sql = sql__quotations_update();

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 

        $head = (object)$head;
        $stmt->bindParam(":quotcode", $head->quotcode, PDO::PARAM_STR);
        $stmt->bindParam(":quotdate", $head->quotdate, PDO::PARAM_STR);
        $stmt->bindParam(":cuscode",  $head->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":cusname",  $head->cusname, PDO::PARAM_STR);
        $stmt->bindParam(":contact",  $head->contact, PDO::PARAM_STR);
        $stmt->bindParam(":address",  $head->address, PDO::PARAM_STR);
        $stmt->bindParam(":tel", $head->tel, PDO::PARAM_STR);
        $stmt->bindParam(":email", $head->email, PDO::PARAM_STR);
        $stmt->bindParam(":valid_price_until", $head->valid_price_until, PDO::PARAM_STR);
        $stmt->bindParam(":dated_price_until", $head->dated_price_until, PDO::PARAM_STR);
        $stmt->bindParam(":payment_condition", $head->payment_condition, PDO::PARAM_STR);
        $stmt->bindParam(":price_terms", $head->price_terms, PDO::PARAM_STR);
        $stmt->bindParam(":currency", $head->currency, PDO::PARAM_STR);
        $stmt->bindParam(":rate", $head->rate, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $head->remark, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $head->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":vat", $head->vat, PDO::PARAM_STR);
        $stmt->bindParam(":grand_total_price", $head->grand_total_price, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }
        exec_deleted_detail($conn, $head->quotcode);
        exec_insert_detail( $conn, $head, $detail, $bank );
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> "success") );
    } else  if($_SERVER["REQUEST_METHOD"] == "DELETE"){
        // $code = $_DELETE["code"];
        $code = $_GET["code"];
        
        $sql = "update quotations set status = 'N' where quotcode = :id";
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'id' => $code ]))  throw new PDOException("Remove data error => {$conn->errorInfo()}"); 
        
        // $sql = "delete from quotations where quotcode = :id";
        // $stmt = $conn->prepare($sql);
        // if (!$stmt->execute([ 'id'=> $code ])) throw new PDOException("Remove data error => {$conn->errorInfo()}"); 
        // exec_deleted_detail($conn, $code);

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("status"=> 1));
    } else  if($_SERVER["REQUEST_METHOD"] == "GET"){
        $code = $_GET["code"];

        $sql = sql__quotations_get(); 
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'quotcode' => $code ])) throw new PDOException("Geting data error => {$conn->errorInfo()}");
        $head = $stmt->fetch(PDO::FETCH_ASSOC); 


        $sql = sql__quotations_detail_get();
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'quotcode' => $code ])) throw new PDOException("Geting data error => {$conn->errorInfo()}"); 
        $detail = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $sql = sql__quotations_list_get();
        $stmt = $conn->prepare($sql); 
        foreach( $detail as $ind => $val){  
            if (!$stmt->execute([ 'quotcode' => $code, 'detailid' => (int)$val['id'] ])) throw new PDOException("Geting data error => {$conn->errorInfo()}"); 
            $list = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $detail[$ind]["quotations_list"] = $list;
        }

        $sql = sql__quotations_bank_get();
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'quotcode' => $code ])) throw new PDOException("Geting data error => {$conn->errorInfo()}"); 
        $bank = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // $sql = sql__quotations_ship_get();
        // $stmt = $conn->prepare($sql); 
        // if (!$stmt->execute([ 'quotcode' => $code ])) throw new PDOException("Geting data error => {$conn->errorInfo()}"); 
        // $ship = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $response_result = $detail;

        $sql = "select * from quotations_shipping_terms where shippingtype_id = :id and detailid = :detailid"; 
        $stmt = $conn->prepare($sql);
        foreach( $response_result as $ind => $val){
            if (!$stmt->execute([ 'id' => $val["shippingtype_id"], 'detailid' => $val["id"] ])){
                $error = $conn->errorInfo(); 
                http_response_code(404);
                throw new PDOException("Geting data error => $error");
            }
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC); 

            $detail[$ind]['shipping_terms'] = $result;
        } 

        $response = array( "head" => $head, "detail" => $detail, "bank" => $bank, "ship" => $ship );
        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => 1, 'data' => $response));
    }

} catch (PDOException $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} catch (Exception $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} finally{
    $conn = null;
}  
ob_end_flush(); 
exit;