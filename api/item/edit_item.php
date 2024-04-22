<?php

date_default_timezone_set("Asia/Bangkok");
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");
date_default_timezone_set("Asia/Bangkok");

include '../conn.php';
extract($_POST, EXTR_OVERWRITE, "_");
// $strSQL = "UPDATE `items` SET ";
// $strSQL .= " stcode='" . $_POST["Edit_stcode"] . "',stname='" . $_POST["Edit_stname"] . "',stnamedisplay='" . $_POST["Edit_stnamedisplay"] . "' ";
// $strSQL .= ",stnameEN='" . $_POST["Edit_stnameEN"] . "',unit='" . $_POST["Edit_unit"] . "',price='" . $_POST["Edit_price"] . "',feature='" . $_POST["Edit_feature"] . "' ";
// $strSQL .= ",typecode='" . $_POST["Edit_typecode"] . "',supcode='" . $_POST["Edit_supcode"] . "',procode='" . $_POST["Edit_procode"] . "',yield='" . $_POST["Edit_yield"] . "' ";
// $strSQL .= ",multiply='" . $_POST["Edit_multiply"] . "',allergen='" . $_POST["Edit_allergen"] . "',remarks='" . $_POST["Edit_remarks"] . "',purpose='" . $_POST["Edit_purpose"] . "' ";
// $strSQL .= ",enumber='" . $_POST["Edit_enumber"] . "',country='" . $_POST["Edit_country"] . "',status='" . $_POST["Edit_status"] . "' ";
// $strSQL .= ",e_date='" . date("Y-m-d") . "',e_time='" . date("H:i:s") . "',e_user='0' ";
// $strSQL .= "WHERE stcode= '" . $_POST["Edit_stcode"] . "' ";
// $stmt = $conn->prepare($strSQL);
$date = date("Y-m-d H:i:s");
$sql = "
UPDATE items 
SET 
stname = :stname, stnamedisplay = :stnamedisplay, stnameEN = :stnameEN, express_code = :express_code, unit = :unit, price = :price, feature = :feature,
typecode = :typecode, supcode = :supcode, procode = :procode, yield = :yield, multiply = :multiply, allergen = :allergen,
remarks = :remarks, purpose = :purpose, enumber = :enumber, country = :country, status = :status, updated_date = :updated_date
WHERE stcode = :stcode"; 

$stmt = $conn->prepare($sql); 

$stmt->bindParam(":stcode", $stcode);
$stmt->bindParam(":stname", $stname);
$stmt->bindParam(":stnamedisplay", $stnamedisplay);
$stmt->bindParam(":stnameEN", $stnameEN);
$stmt->bindParam(":express_code", $express_code);
$stmt->bindParam(":unit", $unit);
$stmt->bindParam(":price", $price);
$stmt->bindParam(":feature", $feature);
$stmt->bindParam(":typecode", $typecode);
$supcode = $supcode ?? 0;
$stmt->bindParam(":supcode", $supcode, PDO::PARAM_STR);
$procode = $procode ?? 0;
$stmt->bindParam(":procode", $procode, PDO::PARAM_STR);
$stmt->bindParam(":yield", $yield);
$stmt->bindParam(":multiply", $multiply);
$stmt->bindParam(":allergen", $allergen);
$stmt->bindParam(":remarks", $remarks);
$stmt->bindParam(":purpose", $purpose);
$stmt->bindParam(":enumber", $enumber);
$stmt->bindParam(":country", $country);
$stmt->bindParam(":status", $status);
$stmt->bindParam(":updated_date", $date);

if ($stmt->execute())
    $response = ['status' => 1, 'message' => 'แก้ไขสินค้า ' . $_POST["stcode"] . ' สำเร็จ'];
else
    $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

echo json_encode($response);