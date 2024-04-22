/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, message } from 'antd';
import { Collapse, Form, Flex, Row, Col, Space } from 'antd';
import { Input, DatePicker, Button, Table } from 'antd';
import { SearchOutlined, ClearOutlined, FileAddOutlined } from '@ant-design/icons';
import { accessColumn } from "./bom.model";

import dayjs from 'dayjs';
import DeliveryNoteService from '../../service/DeliveryNote.service';

const dnService = DeliveryNoteService();
const mngConfig = {title:"", textOk:null, textCancel:null, action:"create", code:null};
const BomAccess = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [accessData, setAccessData] = useState([]);
    const [activeSearch, setActiveSearch] = useState([]);

    const handleSearch = () => {
        form.validateFields().then( v => {
            const data = {...v};
            console.log(data);
            if( !!data?.created_date ) {
                const arr = data?.created_date.map( m => dayjs(m).format("YYYY-MM-DD") )
                const [created_form, created_to] = arr;

                //data.created_date = arr
                Object.assign(data, {created_form, created_to});
            }

            if( !!data?.dndate ){
                const arr = data?.dndate.map( m => dayjs(m).format("YYYY-MM-DD") )
                const [dndate_form, dndate_to] = arr;

                //data.dndate = arr
                Object.assign(data, {dndate_form, dndate_to});
            }

            dnService.getDnMaster(data).then( res => {
                const {data} = res.data;

                setAccessData(data);
            }).catch( err => {
                console.log(err);
                message.error("Request error!");
            });

        });

    }

    const handleClear = () => {
        form.resetFields();
        
        handleSearch()
    }


    const hangleAdd = () => {
        navigate("manage/create", { state: { config: {...mngConfig, title:"สร้าง Delivery Note", action:"create"} }, replace:true })
    }

    const handleEdit = (data) => {
        // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
        navigate("manage/edit", { state: { config: {...mngConfig, title:"แก้ไข Delivery Note", action:"edit", code:data?.srcode} }, replace:true } );
    }; 
      
    const handleView = (data) => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = `/dln-print/${data.dncode}`;
    };    

    const handleDelete = (data) => { 
        // startLoading();
        dnService.delete(data?.srcode).then( _ => {
            const tmp = accessData.filter( d => d.srcode !== data?.srcode );

            setAccessData([...tmp]); 
        })
        .catch(err => {
            console.log(err);
            message.error("Request error!");
        });
    };      
            
    useEffect( () => { 
        // dnService.getDnMaster().then( res => {
        //     const {data} = res.data;

        //     setAccessData(data);
        // }).catch( err => {
        //     console.log(err);
        //     message.error("Request error!");
        // });
    }, []);

    const FormSearch = () => (
        <Collapse 
            size="small"
            onChange={(e) => { setActiveSearch(e) }}
            activeKey={activeSearch}
            items={[
                { 
                    key: '1', 
                    label: <><SearchOutlined /><span> Search</span></>, 
                    children: (
                        <> 
                            <Form form={form} layout="vertical" autoComplete="off">
                                <Row gutter={[8,8]}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Delivery Note No.' name='dncode'>
                                            <Input placeholder='Enter Delivery Note Number.' />
                                        </Form.Item>                            
                                    </Col>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Delivery Date.' name='dndate'>
                                            <RangePicker placeholder={['From Date', 'To date']} style={{width:'100%', height:40}}  />
                                        </Form.Item>                            
                                    </Col>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Request Date' name='created_date'>
                                          <RangePicker placeholder={['From Date', 'To date']} style={{width:'100%', height:40}}  />
                                        </Form.Item>                            
                                    </Col>
                                </Row>
                                <Row gutter={[8,8]}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Sample Request No.' name='srcode'>
                                            <Input placeholder='Enter Sample Preparation Number.' />
                                        </Form.Item>                            
                                    </Col>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Customer Code.' name='cuscode'>
                                            <Input placeholder='Enter Customer Code.' />
                                        </Form.Item>                            
                                    </Col>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Customer Name' name='cusname'>
                                            <Input placeholder='Enter Customer Name.' />
                                        </Form.Item>                            
                                    </Col> 
                                </Row>
                                <Row gutter={[8,8]}>
                                    <Col xs={24} sm={8} md={12} lg={12} xl={12}>
                                        {/* Ignore */}
                                    </Col>
                                    <Col xs={24} sm={8} md={12} lg={12} xl={12}>
                                        <Flex justify='flex-end' gap={8}>
                                            <Button type="primary" size='small' className='bn-action' icon={<SearchOutlined />} onClick={()=>handleSearch()} >
                                                Search
                                            </Button>
                                            <Button type="primary" size='small' className='bn-action' danger icon={<ClearOutlined />} onClick={()=>handleClear()}>
                                                Clear
                                            </Button>
                                        </Flex>
                                    </Col>
                                </Row>
                            </Form> 
                        </>
                    ),
                    showArrow: false, 
                }
            ]}
            // bordered={false}
        />         
    );
    const column = accessColumn( {handleEdit, handleDelete, handleView });
    return (
    <div className='delivery-note-access'>
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} >
            <FormSearch />
            <Card>
                <Row gutter={[8,8]}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Flex justify='flex-start' gap={8}>
                            <Button type="primary" size='small' className='bn-action'  icon={<FileAddOutlined />} onClick={hangleAdd}>
                                สร้าง Bill of materials (BOM)
                            </Button>
                        </Flex>                    
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        {/* Ignore */} 
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table size='small' rowKey="dncode" columns={column} dataSource={accessData} />
                    </Col>
                </Row>         
            </Card>
        </Space>
    </div>
    );
}

export default BomAccess;
