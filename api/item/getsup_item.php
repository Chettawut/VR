<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';

$sql = "SELECT a.stcode,a.stname,a.stnamedisplay,a.stnameEN,a.express_code,a.unit,a.price,a.halal,a.halal_cert,a.feature,a.typecode,b.typename,c.supcode,c.supname,d.supcode as procode,d.supname as proname ";
$sql .= " ,a.yield,a.multiply,a.allergen,a.remarks,a.purpose,a.enumber,a.country,a.status ";
$sql .= " FROM `items` as a ";
$sql .= " inner join `type` as b on (a.typecode=b.typecode) ";
$sql .= " left outer join `supplier` as c on (a.supcode=c.supcode) ";
$sql .= " left outer join `supplier` as d on (a.procode=d.supcode) ";
$sql .= " where a.id = '" . $_POST['idcode'] . "'";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);
