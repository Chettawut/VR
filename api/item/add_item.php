<?php
date_default_timezone_set("Asia/Bangkok");
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 1);

include '../conn.php';
extract($_POST, EXTR_OVERWRITE, "_");

$sql = "SELECT IF(count(stcode)>=1, false, true) as chkdata FROM `items` where stcode = '".$stcode."'  ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$res = $stmt->fetch(PDO::FETCH_ASSOC);
extract($res, EXTR_OVERWRITE, "_");

if ($chkdata) {

    $sql = "INSERT INTO items (`stcode`, `stname`, `stnameEN`, `stnamedisplay`, `express_code` 
        , `unit`, `typecode`,feature, yield, `multiply`,`supcode`,`procode`
        ,allergen,purpose,enumber,country, remarks, price)
        values (
        :stcode,:stname,:stnameEN,:stnamedisplay,:express_code,:unit,:typecode,:feature,:yield,
        :multiply,:supcode,:procode,:allergen,:purpose,:enumber,:country,:remarks,:price
    )";

    $stmt = $conn->prepare($sql); 

    $stmt->bindParam(":stcode", $stcode, PDO::PARAM_STR);
    $stmt->bindParam(":stname", $stname, PDO::PARAM_STR);
    $stmt->bindParam(":stnameEN", $stnameEN, PDO::PARAM_STR);
    $stmt->bindParam(":stnamedisplay", $stnamedisplay, PDO::PARAM_STR);
    $stmt->bindParam(":express_code", $express_code, PDO::PARAM_STR);
    $stmt->bindParam(":unit", $unit, PDO::PARAM_STR);
    $stmt->bindParam(":typecode", $typecode, PDO::PARAM_STR);
    $stmt->bindParam(":feature", $feature, PDO::PARAM_STR);
    $stmt->bindParam(":yield", $yield, PDO::PARAM_STR);
    $stmt->bindParam(":multiply", $multiply, PDO::PARAM_STR);
    $stmt->bindParam(":supcode", $supcode, PDO::PARAM_STR);
    $stmt->bindParam(":procode", $procode, PDO::PARAM_STR);
    $stmt->bindParam(":allergen", $allergen, PDO::PARAM_STR);
    $stmt->bindParam(":purpose", $purpose, PDO::PARAM_STR);
    $stmt->bindParam(":enumber", $enumber, PDO::PARAM_STR);
    $stmt->bindParam(":country", $country, PDO::PARAM_STR);
    $stmt->bindParam(":remarks", $remarks, PDO::PARAM_STR);
    $stmt->bindParam(":price", $price, PDO::PARAM_STR);
    
    
    if ($stmt->execute())
        $response = ['status' => 1, 'message' => 'เพิ่มสินค้า ' . $stcode . ' สำเร็จ'];
    else
        $response = ['status' => 0, 'message' => 'Error! ติดต่อโปรแกรมเมอร์'];

    
}
else
$response = ['status' => 0, 'message' => 'รหัสซ้ำ'];

echo json_encode($response);