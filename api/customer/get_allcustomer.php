<?php
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';
extract($_POST, EXTR_OVERWRITE, "_");  
$cuscode_cdt = !empty($cuscode) ? "and e.cuscode like '%$cuscode%'" : "";
$cusname_cdt = !empty($cusname) ? "and e.cusname like '%$cusname%'" : "";
$country_cdt = !empty($country) ? "and e.country like '%$country%'" : "";
 

$sql = "SELECT * FROM customer e where 1 = 1 $cuscode_cdt $cusname_cdt $country_cdt order by created_date desc;";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);
