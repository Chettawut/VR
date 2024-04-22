<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");

include '../conn.php';


$sql = "INSERT INTO unit (`unit`, `status`,`created_date`) ";
$sql .= " VALUES ('" . $_POST["Addunitname"] . "','Y','" . date("Y-m-d H:i:s")."' ";
$sql .= ")";
$stmt = $conn->prepare($sql);

if ($stmt->execute()) {
    $response = ['status' => 1, 'message' => 'เพิ่ม Unit สำเร็จ'];
} else {
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];
}
echo json_encode($response);
