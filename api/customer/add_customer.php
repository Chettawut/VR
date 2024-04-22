<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");
include '../conn.php';

$sql = "SELECT number as cuscode FROM `cuscode` ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$res = $stmt->fetch(PDO::FETCH_ASSOC);
extract($res, EXTR_OVERWRITE, "_");

$code = sprintf("%05s", ($cuscode + 1));

$strSQL = "INSERT INTO customer (`cuscode`, `cusname`, `idno`, `road`, `subdistrict`, `district`, `province`, `zipcode`, `tel`, `fax`, `taxnumber`, `email`, `status` ";
$strSQL .= ",`created_date`) ";
$strSQL .= " VALUES ('" . $code . "','" . $_POST["Addcusname"] . "','" . $_POST["Addidno"] . "','" . $_POST["Addroad"] . "','" . $_POST["Addsubdistrict"] . "' ";
$strSQL .= " ,'" . $_POST["Adddistrict"] . "','" . $_POST["Addprovince"] . "','" . $_POST["Addzipcode"] . "','" . $_POST["Addtel"] . "','" . $_POST["Addfax"] . "' ";
$strSQL .= " ,'" . $_POST["Addtaxnumber"] . "','" . $_POST["Addemail"] . "','Y' ";
$strSQL .= ",'".date("Y-m-d H:i:s")."')";

$stmt2 = $conn->prepare($strSQL);

if ($stmt2->execute()) {
    $strSQL = "UPDATE cuscode SET ";
    $strSQL .= "number=number+1 ";
    $strSQL .= " order by id desc LIMIT 1 ";

    $stmt3 = $conn->prepare($strSQL);
}


if ($stmt3->execute()) 
    $response = ['status' => 1, 'message' => 'เพิ่มลูกค้าสำเร็จ'];
else 
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
