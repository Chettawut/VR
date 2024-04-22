<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");
include '../conn.php';

$strSQL = "UPDATE customer SET ";
$strSQL .= " cusname='" . $_POST["Editcusname"] . "',idno='" . $_POST["Editidno"] . "',road='" . $_POST["Editroad"] . "' ";
$strSQL .= ",subdistrict='" . $_POST["Editsubdistrict"] . "',district='" . $_POST["Editdistrict"] . "',province='" . $_POST["Editprovince"] . "' ";
$strSQL .= ",zipcode='" . $_POST["Editzipcode"] . "',tel='" . $_POST["Edittel"] . "',fax='" . $_POST["Editfax"] . "' ";
$strSQL .= ",taxnumber='" . $_POST["Edittaxnumber"] . "',email='" . $_POST["Editemail"] . "',status='" . $_POST["Editstatuscus"] . "' ";
$strSQL .= ",`updated_date`='" . date("Y-m-d H:i:s")."' ";
$strSQL .= "WHERE cuscode= '" . $_POST["Editcuscode"] . "' ";
$stmt = $conn->prepare($strSQL);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขลูกค้า ' . $_POST["Editcusname"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);
