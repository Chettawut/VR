/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';

import { Modal, Card, Table, message, Form } from "antd";
import { Row, Col, Space, Spin } from "antd";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from 'antd/es/form/Form';

import { columns } from "./modal-packages.model";
import OptionService from '../../../service/Options.service';

export default function ModalPackages({show, close, values, selected}) {
    const optionService = OptionService();
    const [form] = useForm();

    const [modalData, setModalData] = useState([]);
    const [modalDataWrap, setModalDataWrap] = useState([]);

    const [openModal,  setOpenModel] = useState(show);
    const [loading,  setLoading] = useState(true);
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
        if(!!value){    
            const f = modalData.filter( d => ( 
                d.stcode?.toLowerCase().includes(value?.toLowerCase()) || 
                d.stname?.toLowerCase().includes(value?.toLowerCase()) || 
                d.stnameEN?.toLowerCase().includes(value?.toLowerCase()) 
            ) );
             
            setModalDataWrap(f);            
        } else { 
            setModalDataWrap(modalData);            
        }

    }

    const handleChoose = (value) => {
        values(value);
        setOpenModel(false);
    }

    /** setting initial component */ 
    const column = columns({handleChoose});



    useEffect( () => {
        const onload = () =>{
            setLoading(true);
            optionService.optionsItems({p:'items', type:'package'}).then((res) => {
                let { data } = res.data; 
                setModalData(data);
                setModalDataWrap(data);
                // console.log(modalData, data) 
            })
            .catch((err) => { 
                message.error("Request error!");

                // setLoading(false);
            })
            .finally( () => setTimeout( () => { setLoading(false) }, 400));
        }        
        if( !!openModal ){
            onload();
            // console.log("modal-packages")        
        } 
    }, [openModal]);

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
        >
            <Spin spinning={loading} >
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                    <Card style={{backgroundColor:'#f0f0f0' }}>
                        <Form form={form} layout="vertical" autoComplete="off" >
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col span={24}>
                                    <Form.Item label="ค้นหา"  >
                                        <Input suffix={<SearchOutlined />} onChange={ (e) => { handleSearch(e.target.value) } } placeholder='ค้นหาชื่อ หรือ รหัส'/>
                                    </Form.Item>                        
                                </Col> 
                            </Row> 
                        </Form>
                    </Card>
                    <Card  style={{minHeight:'60vh'}}>
                        <Table
                            bordered
                            dataSource={modalDataWrap}
                            columns={column}
                            rowKey="stcode"
                            pagination={{ 
                                total:modalDataWrap.length, 
                                showTotal:(_, range) => `${range[0]}-${range[1]} of ${modalData.length} items`,
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
