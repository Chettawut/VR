<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT cuscode,cusname,idno,road,subdistrict,district,province,zipcode,tel,fax,taxnumber,email,status as statuscus FROM `customer` ";
$sql .= " where cuscode = '".$_POST['idcode']."'";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);