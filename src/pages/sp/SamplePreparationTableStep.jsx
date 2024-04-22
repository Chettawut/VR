/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react'
import { Flex, Table, Typography, message } from "antd";
import { Space, Col, Row } from "antd";
import { Button, InputNumber  } from "antd";

import { componentsEditable, columnsDetailEditable } from "./sample-preparation.model.js";

import { useSelector } from "react-redux";
import {
    samplePreparationSelector,
    addItemsDetail,
    updateDetailWithIndex,
} from "../../store/slices/sample-preparation.slices.js";
import { useAppDispatch } from "../../store/store.js";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { SamplePreparationItems } from "./sample-preparation.js"; 
import { formatCommaNumber } from "../../utils/util.js";
const { Text } = Typography;
export default function SamplePreparationTableStep({index}) { 
    const dispatch = useAppDispatch();
    const samplePreparationReducer = useSelector(samplePreparationSelector);
    const myLost = useRef(null);
    // const [itemDetail, setItemDetail] = useState([]);
    const [isOpenModalItem, setIsOpenModalItem] = useState(false);

    const [showModalItem, setShowModalItem] = useState(false);
 
    const [lostValue, setLostValue] = useState(samplePreparationReducer[index]?.lost); 

    const handleSave = (row) => {
        const { key } = row;
        const newData = (r) => {
            const itemDetail  = samplePreparationReducer[index]?.details || [];
            const newData = [...itemDetail];
            
            const ind = newData.findIndex( (item) => row?.stcode === item?.stcode );
            const item = newData[ind < 0 ? 0 : ind]; 
            // row.total_price = +row?.amount * +row?.price - +row?.discount;
            newData.splice(ind < 0 ? 0 : ind, 1, {
                ...item,
                ...row,
            }); 
            // console.log(item, ind, newData, key)

            return newData;
        }
        switch( key ){
            case 'method': 
                let payload = {
                    index,
                    detail: [...newData(row)],
                }
        
                dispatch(updateDetailWithIndex(payload));                 
                break;
            case 'amount': 
                if (row?.amount > 0) {  
                    handleDetail([...newData(row)]);
                } else console.log(newData(row), key)
                break;
            default: message.error("not found key");
        }
    };

    const handleDelete = (code) => {
        const itemDetail  = samplePreparationReducer[index]?.details || [];
        const newData = itemDetail.filter(
            (item) => item?.stcode !== code
        );
        handleDetail(newData);
    };

    const handleAction = (record) =>{
        const itemDetail  = samplePreparationReducer[index]?.details || [];
        return itemDetail.length >= 1 ? (
            <Button
              className="bt-icon"
              size='small'
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record?.stcode)}
              disabled={!record?.stcode}
            />
          ) : null
    }
    
    const column = columnsDetailEditable(handleSave, {handleAction})

    const modalSelectItemsOpen = () => {
        setIsOpenModalItem(true);
        setShowModalItem(true);
    }

    const modalSelectItemsClose = () => {
        setIsOpenModalItem(false);
        setTimeout( () => { setShowModalItem(false); }, 480);
    }

    const handleDetail = (value) => { 
        // console.log(value);
        let payload = {
            index,
            detail: [...value], 
            lost: lostValue || samplePreparationReducer[index]?.lost,
        }

        dispatch(addItemsDetail(payload)); 

        setTimeout( () => {
            if( index > 0 ){
                const itemDetail  = samplePreparationReducer[index - 1]?.details || [];
                payload = {
                    index : index - 1,
                    detail: itemDetail, 
                    lost: samplePreparationReducer[index - 1]?.lost
                }
            } 
        }, 500);
 
    }

    const handleLostChange = (val) => {  
        // console.log(val);
        const payload = {
            index,
            detail: samplePreparationReducer[index]?.details || [], 
            lost: val
        }

        dispatch(addItemsDetail(payload));
        setLostValue(val);
    }
 
    useEffect( () => {  
        myLost.current.value = samplePreparationReducer[index].lost;
        // setTimeout( () =>setLostValue( samplePreparationReducer[index].lost ), 100 );
        // console.log(samplePreparationReducer[index].lost, lostValue);
    }, []);

    /** settimg child component */
    const ButtonActionSrDetail = (
        <Row className='width-100' gap="small" align="center" style={{ justifyContent: "end", paddingInlineEnd:5 }} >
            <Col span={12} style={{display:'flex', justifyContent:'start', alignItems:'center'}}>
                <Typography.Title level={3} className='m-0 !text-zinc-50'>List of Ingredients</Typography.Title>
            </Col>
            <Col span={12} style={{display:'flex', justifyContent:'end'}}>
                <Button 
                    style={{ lineHeight: "1.5rem" }}
                    className='bn-success-outline'
                    size='default'
                    icon={ <PlusOutlined style={{ fontSize: "16px" }} /> } 
                    onClick={() => modalSelectItemsOpen() } disabled={showModalItem}  
                > เลือกส่วนผสม </Button>
            </Col>
            {/* <Text style={{fontWeight:600}}>{title || 'Step 0'}</Text> */}
        </Row>
    );
    
    const TableSummary = () => { 
        return (
        <>
            <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>รวม</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={2} className='pe-2 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                    <Text type="danger">{ formatCommaNumber(samplePreparationReducer[index]?.total) }</Text>
                </Table.Summary.Cell> 
                <Table.Summary.Cell index={1} colSpan={1} className='pe-2 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                    <Text type="danger">{ formatCommaNumber(samplePreparationReducer[index]?.details.reduce( (acc, val) => acc += val?.percent || 0, 0)  * 100 ) }</Text>
                </Table.Summary.Cell> 
                {/* <Table.Summary.Cell index={1} colSpan={1} className='pe-2 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                    <Text type="danger">{ formatCommaNumber(samplePreparationReducer[index]?.details.reduce( (acc, val) => acc += val?.totalpercent || 0, 0) * 100 ) }</Text>
                </Table.Summary.Cell>  */}
                <Table.Summary.Cell colSpan={5} className='border-right-0' />
                <Table.Summary.Cell index={1} colSpan={1} className='pe-2 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                    <Text type="danger">{ 
                        formatCommaNumber( samplePreparationReducer[index]?.details.reduce( (acc, val) => acc += parseFloat((val?.cost || 0).toFixed(2)), 0), 2, 2 ) 
                    }</Text>
                </Table.Summary.Cell> 
                <Table.Summary.Cell colSpan={2} className='border-right-0' />
            </Table.Summary.Row>
            <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>สูญเสีย</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={2} className='field-edit suffix border-right-0' >
                    <InputNumber 
                        style={{height:32, textAlign:"end", width:'100%' }} 
                        defaultValue={samplePreparationReducer[index].lost}
                        value={samplePreparationReducer[index].lost}
                        onBlur={(v) => handleLostChange(v.target.value) }
                        onFocus={() => { myLost.current?.select() } }
                        suffix="%" 
                        ref={myLost}
                        controls={false}
                        className='lost-field'
                    />
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={10} className='border-right-0' />
            </Table.Summary.Row>
            <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>น้ำหนักหลังสูญเสีย</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={2} className='pe-2 text-end border-right-0'>
                    <Text type="danger" style={{textAlign:"end"}}>{ formatCommaNumber(samplePreparationReducer[index]?.afterLost)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={6} className='border-right-0' />
                <Table.Summary.Cell index={1} colSpan={1} className='pe-2 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                    <Text type="danger">{ formatCommaNumber( samplePreparationReducer[index]?.cost_after_lost || 0, 2,  2 ) }</Text>
                </Table.Summary.Cell> 
                <Table.Summary.Cell colSpan={2} className='border-right-0' />                
            </Table.Summary.Row>
        </>
        );
    }

    return (
        <> 
            <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} className='sample-request-modal' > 
                <Table 
                    title={ () => <Flex className='widthh-100' justify='end'>{ ButtonActionSrDetail }</Flex> }
                    components={componentsEditable}
                    rowClassName={() => "editable-row"}
                    bordered
                    dataSource={samplePreparationReducer[index]?.details || []}
                    columns={column}
                    pagination={false}
                    rowKey="stcode"
                    scroll={{ x: 'max-content' }} size='small'
                    summary={(_)=>TableSummary()}
                />
            </Space> 
            { showModalItem && ( 
                <SamplePreparationItems 
                    show={isOpenModalItem} 
                    close={() => { modalSelectItemsClose() }} 
                    selected={samplePreparationReducer[index]?.details || []}  
                    values={ (v)=>{ handleDetail(v) }} 
                />
            )}
        </>


    )
}
