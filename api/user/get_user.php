<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: *");

include '../conn.php';
extract($_POST, EXTR_OVERWRITE, "_");
$username = !empty($username) ? "and a.username like '%$username%'" : "";
$firstname = !empty($firstname) ? "and a.firstname like '%$firstname%'" : "";
$lastname = !empty($lastname) ? "and a.lastname like '%$lastname%'" : "";
$tel = !empty($tel) ? "and a.tel like '%$tel%'" : "";
$email = !empty($email) ? "and a.email like '%$email'" : "";

$sql = "SELECT a.*, a.status as statususer
FROM `user` a
where 1 = 1
$username
$firstname
$lastname
$tel
$email
order by a.date desc";
$stmt = $conn->prepare($sql);
$stmt->execute();
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($data);
