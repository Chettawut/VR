<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';

$password = password_hash($_POST['pwd'], PASSWORD_DEFAULT);
$sql = "UPDATE user SET ";
$sql .= " password='".$password."' ";
$sql .= "WHERE code= '" . $_POST["idcode"] . "' ";
$stmt = $conn->prepare($sql);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขรหัสผ่านสำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);