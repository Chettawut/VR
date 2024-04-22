<?php

#region insert data
function sql__quotations(){
    $sql = "insert into quotations (
        quotcode,quotdate,cuscode,cusname,contact,address,tel,email,valid_price_until, dated_price_until, payment_condition,
        price_terms,currency,rate,remark,total_price,vat,grand_total_price,
        created_by,updated_by
    )
    values (
        :quotcode,
        :quotdate,
        :cuscode,
        :cusname,
        :contact,
        :address,
        :tel,
        :email,
        :valid_price_until,
        :dated_price_until,
        :payment_condition,
        :price_terms,
        :currency,
        :rate,
        :remark,
        :total_price,
        :vat,
        :grand_total_price,
        :action_user,
        :action_user
    )";
    return $sql;
}

function sql__quotations_detail(){
    $sql = "insert into quotations_detail (
        quotcode, spcode, spname, estcode, packingsetid, packingset_name, exworkcost_carton, exworksell_price, margin, 
        loadingtype_id, loadingtype_name, loadingtype_qty, insurance, commission, price, total_amount,
        unit_carton, qty, price_per_carton, shippingtype_id, shippingtype_name, shippingtype_price
    )
    values (
        :quotcode,
        :spcode,
        :spname,
        :estcode,
        :packingsetid,
        :packingset_name,
        :exworkcost_carton,
        :exworksell_price,
        :margin,
        :loadingtype_id,
        :loadingtype_name,
        :loadingtype_qty,
        :insurance,
        :commission,
        :price,
        :total_amount,
        :unit_carton,
        :qty,
        :price_per_carton,
        :shippingtype_id, 
        :shippingtype_name, 
        :shippingtype_price
    )";
    return $sql;
}

function sql__quotations_list(){
    $sql = "insert into quotations_list (detailid,detail_name,quotcode,detail_value )
    values (:detailid,:detail_name,:quotcode,:detail_value)"; 
    return $sql;
}

function sql__quotations_banks(){
    $sql = "insert into quotations_banks (quotcode,bank,bank_name,bank_name_th,bank_nickname,acc_no,acc_name)
    values (:quotcode,:bank,:bank_name,:bank_name_th,:bank_nickname,:acc_no,:acc_name)"; 
    return $sql;
}

function sql__quotations_shipping_termse(){
    $sql = "insert into quotations_shipping_terms (quotcode,detailid,shippingtype_id,expense_name,price)
    values (:quotcode,:detailid,:shippingtype_id,:expense_name,:price)"; 
    return $sql;
} 
#endregion

#region update data
function sql__quotations_update(){
    $sql = "update quotations set
        quotdate = :quotdate,
        cuscode = :cuscode,
        cusname = :cusname,
        contact = :contact,
        address = :address,
        tel = :tel,
        email = :email,
        valid_price_until = :valid_price_until,
        dated_price_until = :dated_price_until,
        payment_condition = :payment_condition,
        price_terms = :price_terms,
        currency = :currency,
        rate = :rate,
        remark = :remark,
        total_price = :total_price,
        vat = :vat,
        grand_total_price = :grand_total_price,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where quotcode = :quotcode
    ";
    return $sql;
} 
#endregion

#region get data
function sql__quotations_get(){
    $sql = "select 
    q.*, concat(u.firstname, ' ', u.lastname) created_name, u.email, u.tel
    from quotations q
    join user u on q.created_by = u.code
    where q.quotcode = :quotcode"; 
    return $sql;
}

function sql__quotations_detail_get(){
    $sql = "select * from quotations_detail qd where qd.quotcode = :quotcode"; 
    return $sql;
}

function sql__quotations_list_get(){
    $sql = "select * from quotations_list ql where ql.quotcode = :quotcode and ql.detailid = :detailid"; 
    return $sql;
}

function sql__quotations_bank_get(){
    $sql = "select * from quotations_banks qb where qb.quotcode = :quotcode"; 
    return $sql;
}

function sql__quotations_ship_get(){
    $sql = "select * from quotations_shipping_terms qs where qs.quotcode = :quotcode"; 
    return $sql;
}

#endregion

#region excube function

function exec_insert_detail($conn, $head, $detail, $banks){
    $sql = sql__quotations_detail();
    $stmt = $conn->prepare($sql);
    if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

    $sql = sql__quotations_list();
    $stmt_sub1 = $conn->prepare($sql);
    if(!$stmt_sub1) throw new PDOException("Insert data error => {$conn->errorInfo()}");

    $sql = sql__quotations_shipping_termse();
    $stmt_sub2 = $conn->prepare($sql);
    if(!$stmt_sub2) throw new PDOException("Insert data error => {$conn->errorInfo()}");
 
    // $detail = $detail;  
    foreach( $detail as $ind => $val){
        $val = (object)$val;
        $stmt->bindParam(":quotcode", $head->quotcode, PDO::PARAM_STR);
        $stmt->bindParam(":spcode", $val->spcode, PDO::PARAM_STR);
        $stmt->bindParam(":spname", $val->spname, PDO::PARAM_STR);
        $stmt->bindParam(":estcode", $val->estcode, PDO::PARAM_STR);
        $stmt->bindParam(":packingsetid", $val->packingsetid, PDO::PARAM_INT);
        $stmt->bindParam(":packingset_name", $val->packingset_name, PDO::PARAM_STR);
        $stmt->bindParam(":exworkcost_carton", $val->exworkcost_carton, PDO::PARAM_STR);
        $stmt->bindParam(":exworksell_price", $val->exworksell_price, PDO::PARAM_STR);
        $stmt->bindParam(":margin", $val->margin, PDO::PARAM_STR);
        $stmt->bindParam(":loadingtype_id", $val->loadingtype_id, PDO::PARAM_INT);
        $stmt->bindParam(":loadingtype_name", $val->loadingtype_name, PDO::PARAM_STR);
        $stmt->bindParam(":loadingtype_qty", $val->loadingtype_qty, PDO::PARAM_STR);
        $stmt->bindParam(":shippingtype_id", $val->shippingtype_id, PDO::PARAM_INT);
        $stmt->bindParam(":shippingtype_name", $val->shippingtype_name, PDO::PARAM_STR);
        $stmt->bindParam(":shippingtype_price", $val->shippingtype_price, PDO::PARAM_STR);
        $stmt->bindParam(":insurance", $val->insurance, PDO::PARAM_STR);
        $stmt->bindParam(":commission", $val->commission, PDO::PARAM_STR);
        $stmt->bindParam(":price", $val->price, PDO::PARAM_STR);
        $stmt->bindParam(":total_amount", $val->total_amount, PDO::PARAM_STR);
        $stmt->bindParam(":unit_carton", $val->unit_carton, PDO::PARAM_STR);
        $stmt->bindParam(":qty", $val->qty, PDO::PARAM_STR);
        $stmt->bindParam(":price_per_carton", $val->price_per_carton, PDO::PARAM_STR);
        if(!$stmt->execute()) throw new PDOException("Insert data error => {$conn->errorInfo()}");  
        
        $detailid = $conn->lastInsertId(); 

        $list = $val->quotations_list;
        foreach( $list as $i => $d) { 
            $d = (object)$d;
            $stmt_sub1->bindParam(":detailid", $detailid, PDO::PARAM_INT);
            $stmt_sub1->bindParam(":detail_name", $d->detail_name, PDO::PARAM_STR);
            $stmt_sub1->bindParam(":quotcode", $head->quotcode, PDO::PARAM_STR);
            $stmt_sub1->bindParam(":detail_value", $d->detail_value, PDO::PARAM_STR);
            if(!$stmt_sub1->execute()) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 
        }
        
        $ship = $val->shipping_terms;  
        foreach( $ship as $ind => $val){
            $val = (object)$val;
            $stmt_sub2->bindParam(":quotcode", $head->quotcode, PDO::PARAM_STR);
            $stmt_sub2->bindParam(":detailid", $detailid, PDO::PARAM_INT);
            $stmt_sub2->bindParam(":shippingtype_id", $val->shippingtype_id, PDO::PARAM_INT);
            $stmt_sub2->bindParam(":expense_name", $val->expense_name, PDO::PARAM_STR);
            $stmt_sub2->bindParam(":price", $val->price, PDO::PARAM_STR);
            if(!$stmt_sub2->execute()) throw new PDOException("Insert data error => {$conn->errorInfo()}");
        }
    } 
    
    $sql = sql__quotations_banks();
    $stmt = $conn->prepare($sql);
    if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

    foreach( $banks as $ind => $val){
        $val = (object)$val;
        $stmt->bindParam(":quotcode", $head->quotcode, PDO::PARAM_STR);
        $stmt->bindParam(":bank", $val->bank, PDO::PARAM_STR);
        $stmt->bindParam(":bank_name", $val->bank_name, PDO::PARAM_STR);
        $stmt->bindParam(":bank_name_th", $val->bank_name_th, PDO::PARAM_STR);
        $stmt->bindParam(":bank_nickname", $val->bank_nickname, PDO::PARAM_STR);
        $stmt->bindParam(":acc_no", $val->acc_no, PDO::PARAM_STR);
        $stmt->bindParam(":acc_name", $val->acc_name, PDO::PARAM_STR);
        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error"); 
        } 
    }  
} 

function exec_deleted_detail($conn, $code){
    $sql = "delete from quotations_detail where quotcode = :id";
    $stmt = $conn->prepare($sql);
    if (!$stmt->execute([ 'id'=> $code ])) throw new PDOException("Remove data error => {$conn->errorInfo()}"); 

    $sql = "delete from quotations_list where quotcode = :id";
    $stmt = $conn->prepare($sql);
    if (!$stmt->execute([ 'id'=> $code ])) throw new PDOException("Remove data error => {$conn->errorInfo()}"); 

    $sql = "delete from quotations_banks where quotcode = :id";
    $stmt = $conn->prepare($sql);
    if (!$stmt->execute([ 'id'=> $code ])) throw new PDOException("Remove data error => {$conn->errorInfo()}"); 

    $sql = "delete from quotations_shipping_terms where quotcode = :id";
    $stmt = $conn->prepare($sql);
    if (!$stmt->execute([ 'id'=> $code ])) throw new PDOException("Remove data error => {$conn->errorInfo()}");
}

#endregion
?>