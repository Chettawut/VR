<?php
#region Update Code
function update_srcode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set srcode = srcode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
}

function update_spcode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set spcode = spcode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
}

function update_dncode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set dncode = dncode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
}

function update_pilotscale_code($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set pilotscale_code = pilotscale_code + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
}  

function update_estcode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set estcode = estcode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
}

function update_quotcode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set quotcode = quotcode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
}

#endregion
 
#region Request Code
function request_srcode($pdo ){
    $year = date("Y");
    $month = date("m");

    $sql = "select srcode from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //SR24010001
    $res = $result["srcode"];
    $y = date("y");
    $m = date("m");
    $number = intval($res);

    while(true){
        $code = sprintf("%04s", ( $number + 1) );
        $format = "SR$y$m$code";
        $sql = "SELECT 1 r FROM srmaster where srcode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_srcode($pdo);
            continue;
        } else break;
    } 
    return $number;    
}

function request_spcode($pdo ){
    $year = date("Y");
    $month = date("m");

    $sql = "select spcode from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {

        create_options($pdo, $year, $month);
        return 0;
    } 
    $res = $result["spcode"];
    $y = date("y");
    $m = date("m");
    $number = intval($res);

    while(true){
        $code = sprintf("%05s", ( $number + 1) );
        $format = "$y-$m-$code-0";
        $sql = "SELECT 1 r FROM spmaster where spcode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_spcode($pdo);
            continue;
        } else break;
    } 
    return $number;
} 

function request_pilotscale_code($pdo ){
    $year = date("Y");
    $month = date("m");

    $sql = "select pilotscale_code code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //SR24010001
    $res = $result["code"];
    $y = date("y");
    $m = date("m");
    $number = intval($res);
    $prefix = "PIL$y$m";
    while(true){
        $code = sprintf("%04s", ( $number + 1) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM dnmaster where dncode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_dncode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%04s", ( $number + 1) );   
}

function request_dncode($pdo ){
    $year = date("Y");
    $month = date("m");

    $sql = "select dncode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //SR24010001
    $res = $result["code"];
    $y = date("y");
    $m = date("m");
    $number = intval($res);
    $prefix = "DN$y$m";
    while(true){
        $code = sprintf("%05s", ( $number + 1) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM dnmaster where dncode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_dncode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%05s", ( $number + 1) );   
}

function request_estcode($pdo ){
    $year = date("Y");
    $month = date("m");

    $sql = "select estcode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //EST24010001
    $res = $result["code"];
    $y = date("y");
    $m = date("m");
    $number = intval($res);
    $prefix = "EST$y$m";
    while(true){
        $code = sprintf("%05s", ( $number + 1) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM estimation where estcode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_estcode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%05s", ( $number + 1) );   
}

function request_quotcode($pdo){
    $year = date("Y");
    $month = date("m");

    $sql = "select quotcode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //QU240100001
    $res = $result["code"];
    $y = date("y");
    $m = date("m");
    $number = intval($res);
    $prefix = "QU$y$m";
    while(true){
        $code = sprintf("%05s", ( $number + 1) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM quotations where quotcode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_quotcode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%05s", ( $number + 1) );   
}

#endregion

function create_options($pdo, $year, $month){
    $sql = "insert into options (year, month) values ( :y, :m)";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }
}