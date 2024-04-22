<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");
include '../conn.php';

$strSQL  = "UPDATE user SET ";
$strSQL .= "firstname='{$_POST["firstname"]}',lastname='{$_POST["lastname"]}',";
$strSQL .= "type='{$_POST["type"]}', tel='{$_POST["tel"]}',email='{$_POST["email"]}', status='{$_POST["statususer"]}'";
$strSQL .= "WHERE code='{$_POST["code"]}'";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไข ' . $_POST["username"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
