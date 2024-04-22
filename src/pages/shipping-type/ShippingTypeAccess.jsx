/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';

import { Card, DatePicker, message } from 'antd';
import { Collapse, Form, Flex, Row, Col, Space } from 'antd';
import { Input, Button, Table, Typography } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { FaTruckLoading } from "react-icons/fa";
import { accessColumn } from "./shipping-type.model";

import dayjs from 'dayjs';
import ShippingTypeService from '../../service/ShippingTypeService'; 

import ShippingTypeManage from "./ShippingTypeManage";

const ldtService = ShippingTypeService();
const mngConfig = {title:"", textOk:null, textCancel:null, action:"create", code:null};
const ShippingTypeAccess = () => {
    // const navigate = useNavigate();
    const [form] = Form.useForm(); 
    const [accessData, setAccessData] = useState([]);
    const [activeSearch, setActiveSearch] = useState([]);

    const [openManage, setOpenManage] = useState(false);
    const [config, setConfig] = useState(mngConfig);

    const [loading, setLoading] = useState(false);
    
    const handleSearch = (load = false) => {
        setLoading(load);
        form.validateFields().then( v => {
            const data = {...v}; 
            if( !!data?.created_date ) {
                const arr = data?.created_date.map( m => dayjs(m).format("YYYY-MM-DD") )
                const [created_form, created_to] = arr; 
                //data.created_date = arr
                Object.assign(data, {created_form, created_to});
            } 
            handleGetData(data);
        });
    }

    const handleClear = () => {
        form.resetFields();
        
        handleSearch()
    }

    const handleGetData = (data) => {
        ldtService.search(data, {ignoreLoading : loading}).then( res => {
            const {data} = res.data;

            setAccessData(data);
        }).catch( err => {
            console.log(err);
            message.error("Request error!");
        }); 
    } 

    const hangleAdd = () => {
        setConfig({...mngConfig, title:"สร้าง Loading type", action:"create"});

        setOpenManage(true);
    }

    const handleEdit = (data) => {
        // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
        setConfig({...mngConfig, title:"แก้ไข Loading type", action:"edit", code:data?.id});

        setOpenManage(true);
    };   

    const handleDelete = (data) => { 
        // startLoading();
        // ctmService.deleted(data?.dncode).then( _ => {
        //     const tmp = accessData.filter( d => d.dncode !== data?.dncode );

        //     setAccessData([...tmp]); 
        // })
        // .catch(err => {
        //     console.log(err);
        //     message.error("Request error!");
        // });
    };      
            
    useEffect( () => { 
        handleGetData({});
    }, []);

    const FormContent = (<>
        <Row gutter={[8,8]}>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Shipping Type' name='shippingtype_name'>
                    <Input placeholder='Enter Customer Code.' />
                </Form.Item>                            
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Request Date.' name='created_date'>
                    <DatePicker.RangePicker placeholder={['From Date', 'To date']} style={{width:'100%', height:40}}  />
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
    </>)

    const FormSearch = (
        <Collapse 
            size="small"
            onChange={(e) => { setActiveSearch(e) }}
            activeKey={activeSearch}
            items={[
                { 
                    key: '1', 
                    label: <><SearchOutlined /><span> Search</span></>, 
                    children: ( <Form form={form} layout="vertical" autoComplete="off" onValuesChange={()=>handleSearch(true)} >{FormContent}</Form> ),
                    showArrow: false, 
                }
            ]}
            // bordered={false}
        />         
    );

    const column = accessColumn( {handleEdit, handleDelete });

    const TitleTable = (
        <Flex className='width-100' align='center'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start' align='center'>
                  <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Shipping Type</Typography.Title>
                </Flex>
            </Col>
            <Col span={12} style={{paddingInline:0}}>
                <Flex gap={4} justify='end'>
                      <Button  
                      size='small' 
                      className='bn-action bn-center bn-primary-outline justify-center'  
                      icon={<FaTruckLoading style={{fontSize:'.9rem'}} />} 
                      onClick={() => { hangleAdd() } } >
                          Create Shipping Type
                      </Button>
                </Flex>
            </Col>  
        </Flex>
    ); 

    return (
    <div className='shippingtype-access'>
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} >
            {FormSearch}
            <Card>
                <Row gutter={[8,8]} className='m-0'>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table 
                        title={()=>TitleTable} 
                        size='small' 
                        rowKey="id" 
                        columns={column} 
                        dataSource={accessData} 
                        scroll={{ x: 'max-content' }}
                        />
                    </Col>
                </Row>         
            </Card> 

            { openManage && 
                <ShippingTypeManage 
                    config={config}
                    open={openManage} 
                    close={()=>setOpenManage(false)} 
                    complete={() => { handleSearch(true); setOpenManage(false); }} 
                />
            }
        </Space>
    </div>
    );
}

export default ShippingTypeAccess;
