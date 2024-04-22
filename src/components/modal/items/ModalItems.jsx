/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';

import { Modal, Card, Table, message, Form, Button } from "antd";
import { Row, Col, Space, Spin, Flex } from "antd";
import { Input, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from 'antd/es/form/Form';

import { TagItemTypes } from '../../badge-and-tag';
import { columns } from "./modal-items.model";
import OptionService from '../../../service/Options.service';
import { BsUiChecks } from "react-icons/bs";
const CheckboxGroup = Checkbox.Group;


export default function ModalItems({show, close, values, selected=[]}) {
    const optionService = OptionService();
    const [form] = useForm();
    const inputRef = useRef(null);
    const [modalData, setModalData] = useState([]);
    const [modalDataWrap, setModalDataWrap] = useState([]);

    const [openModal,  setOpenModel] = useState(show);
    const [loading,  setLoading] = useState(true);
    const [onLoaded,  setOnLoaded] = useState(false);

    const [rowKeySelect, setRowKeySelect] = useState([]);

    const [itemsTypeData, setItemsTypeData] = useState([]);
    const [itemsTypeOption, setItemTypeOption] = useState([]);
 
    const checkAll = itemsTypeOption.length === itemsTypeData.length;
    const indeterminate = itemsTypeData.length > 0 && itemsTypeData.length < itemsTypeOption.length;
    const onChange = (list) => { 
        setItemsTypeData([...list]); 
    };
    const onCheckAllChange = (e) => {
        const all = e.target.checked ? itemsTypeOption.map( m => m.value) : [];

        setItemsTypeData([...all]); 
    };

    // console.log( itemsTypeData )

    /** handle logic component */
    const handleClose = () =>{ 
        setTimeout( () => { close(false);  }, 140);
        
        //setTimeout( () => close(false), 200 );
    }

    // const handleConfirm = () => {
    //     // console.log(itemsList); 
    //     // values([...itemsList, ...selected]);
    //     // setItemsList([]);
    //     setOpenModel(false);
    // }

    const handleSearch = (value) => {
        const types = [...itemsTypeData];

        if(!!value){    
            const f = modalData.filter( d => {
                const text = ( 
                    d.stcode?.toLowerCase().includes(value?.toLowerCase()) || 
                    d.stname?.toLowerCase().includes(value?.toLowerCase()) || 
                    d.stnameEN?.toLowerCase().includes(value?.toLowerCase()) 
                ) 
                const type = types.includes(  d.typecode ); 
                return  text && type;
            });
            setModalDataWrap(f);            
        } else { 
            const f = modalData.filter( d => {
                const type = types.includes(  d.typecode ); 
                return type;
            });
            setModalDataWrap(f); 
        }

    }

    const handleChoose = () => {
        const choosed = selected.map( m => m.stcode );
        const itemsChoose = (modalData.filter( f => rowKeySelect.includes(f.stcode) && !choosed.includes(f.stcode) )).map( (m, i) => (
        {
            id:m.id,
            stcode:m.stcode,
            stname:m.stname,
            amount: 1,
        }));
        
        // const trans = selected.filter( (item) =>  item?.stcode === "" );
        // const rawdt = selected.filter( (item) =>  item?.stcode !== "" );
        // console.log(itemsChoose, rawdt, trans); 
        values([...selected, ...itemsChoose]);
        
        setOpenModel(false);
    }

    /** setting initial component */ 
    const column = columns();

    useEffect( () => {
        if( onLoaded ){
            setLoading(true);
            setTimeout( ()=>{
                const value = inputRef.current?.input.value;
                handleSearch(value); 
                
                setLoading(false);
            }, 200)           
        }
    }, [itemsTypeData])

    useEffect( () => {
        const onload = () =>{
            setLoading(true);
            optionService.optionsItems({p:'items'}).then(async (res) => {
                let { data } = res.data; 
                setModalData(data);
                setModalDataWrap(data);
                // console.log(modalData, data) 
                const keySeleted = selected.map( m => m.stcode );

                setRowKeySelect([...keySeleted]);

                const [
                  itemTypeRes,
                ] = await Promise.all([
                    optionService.optionsItems({p:'items-type'}),
                ]); 
                const {data:itemType} = itemTypeRes.data;
                const optionItemType = itemType.map( m => ({
                    label: <TagItemTypes data={m.typename} />,
                    value: m.typecode,
                }));
                setItemTypeOption(optionItemType);
                setItemsTypeData([...optionItemType.map(m=>m.value)]);                
            })
            .catch((err) => { 
                message.error("Request error!");

                // setLoading(false);
            })
            .finally( () => setTimeout( () => { setLoading(false); setOnLoaded(true) }, 400));
        }        
        if( !!openModal ){
            onload();

            // console.log("modal-packages")        
        } 
    }, [openModal]);

    const handleCheckDuplicate = (itemCode) => !!selected.find( (item) =>  item?.stcode === itemCode ) ;

    const itemSelection = {
        selectedRowKeys : rowKeySelect,
        type: "checkbox",
        fixed: true,
        hideSelectAll:true,
        onChange: (selectedRowKeys, selectedRows) => { 
            // setRowKeySelect([...new Set([...selectedRowKeys, ...rowKeySelect])]);
            // setItemsList(selectedRows);
            //setRowKeySelect(selectedRowKeys);
        },
        getCheckboxProps: (record) => { 
            return {
                disabled: handleCheckDuplicate(record.stcode), 
                name: record.stcode,
            }
        },
        onSelect: (record, selected, selectedRows, nativeEvent) => {
            //console.log(record, selected, selectedRows, nativeEvent);
            if( selected ){
                setRowKeySelect([...new Set([...rowKeySelect, record.stcode])]);
            } else {
                const ind = rowKeySelect.findIndex( d => d === record.stcode);
                const tval = [...rowKeySelect];
                tval.splice(ind, 1);
                setRowKeySelect([...tval]);
                //console.log(ind, rowKeySelect);
            }
        }
    };
    /** setting child component */
    // const ButtonModal = (
    //     <Space direction="horizontal" size="middle" >
    //         <Button type='primary' onClick={() => handleConfirm() }>ยืนยันการเลือกสินค้า</Button>
    //         <Button onClick={() => setOpenModel(false) }>ปิด</Button>
    //     </Space>
    // )
    /** */
    return (
        <>
        <Modal
            open={openModal}
            title="เลือกสินค้า"
            afterClose={() => handleClose() }
            onCancel={() => setOpenModel(false) } 
            maskClosable={false}
            style={{ top: 20 }}
            width={800}
            className='modal-customers'
            footer={(
                <Row>
                    <Col span={24}>
                        {/* Ignore */}
                    </Col>
                    <Col span={24}>
                        <Flex justify='flex-end'>
                            <Button  className='bn-center bn-primary' icon={<BsUiChecks />} onClick={()=>handleChoose()}> Confirm </Button>
                        </Flex>
                    </Col> 
                </Row>
            )}
        >
            <Spin spinning={loading} >
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                    <Card style={{backgroundColor:'#f0f0f0' }}>
                        <Form form={form} layout="vertical" autoComplete="off" >
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col span={24}>
                                    <Form.Item label="ค้นหา"  >
                                        <Input ref={inputRef} suffix={<SearchOutlined />} onChange={ (e) => { handleSearch(e.target.value) } } placeholder='ค้นหาชื่อ หรือ รหัส'/>
                                    </Form.Item>                        
                                </Col> 
                            </Row> 
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col span={24}> 
                                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                        <TagItemTypes data={"Check All"} />
                                    </Checkbox> 
                                    <CheckboxGroup options={itemsTypeOption} value={itemsTypeData} onChange={onChange} />                       
                                </Col> 
                            </Row> 
                        </Form>
                    </Card>
                    <Card  style={{minHeight:'60vh'}}>
                        <Table
                            bordered
                            dataSource={modalDataWrap}
                            rowSelection={itemSelection}
                            columns={column}
                            rowKey="stcode"
                            pagination={{ 
                                total:modalDataWrap?.length || 0, 
                                showTotal:(_, range) => `${range[0]}-${range[1]} of ${modalDataWrap?.length || 0} items`,
                                defaultPageSize:25,
                                pageSizeOptions:[25,35,50,100]
                            }} 
                            size='small'
                        /> 
                    </Card>                    
                </Space> 
            </Spin>
        </Modal>    
        </>
    )
}
