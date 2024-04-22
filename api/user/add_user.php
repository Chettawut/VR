<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");
include '../conn.php';

$date = date("Y-m-d H:i:s");
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$strSQL = "INSERT INTO user (`username`, `password`,`firstname`,`lastname`, `type`, `tel`, `email`, `status`,`date`) ";
//  ,`s_date`,`s_time`, s_user) ";
$strSQL .= " VALUES ('{$_POST["username"]}','{$password}','{$_POST["firstname"]}','{$_POST["lastname"]}','{$_POST["type"]}','{$_POST["tel"]}','{$_POST["email"]}','Y','$date' )";	
$stmt = $conn->prepare($strSQL);

if ($stmt->execute()) {
    $response = ['status' => 1, 'message' => 'เพิ่มพนักงาน '.$_POST["firstname"].' '.$_POST["lastname"].' สำเร็จ'];
} else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}
echo json_encode($response);
