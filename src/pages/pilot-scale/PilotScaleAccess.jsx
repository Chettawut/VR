import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from 'antd';
import { Collapse, Form, Flex, Row, Col, Space } from 'antd';
import { Input, DatePicker, Button, Table, message, Typography } from 'antd';
import { SearchOutlined, ClearOutlined, FileAddOutlined } from '@ant-design/icons';
import { accessColumn } from "./pilot-scale.model";

import dayjs from 'dayjs';
import PilotScaleService from '../../service/PilotScale.service';

const plService =  PilotScaleService();
const mngConfig = {title:"", textOk:null, textCancel:null, action:"create", code:null};
const PilotScaleAccess = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const [accessData, setAccessData] = useState([]);
    const [activeSearch, setActiveSearch] = useState([]);

    const FormSearch = (
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
                                        <Form.Item label='Pilot Scale No.' name='pilotscale_code'>
                                            <Input placeholder='Enter Pilot Scale Number.' />
                                        </Form.Item>                            
                                    </Col>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Request Date.' name='created_date'>
                                            <RangePicker placeholder={['From Date', 'To date']} style={{width:'100%', height:40}}  />
                                        </Form.Item>                            
                                    </Col>
                                </Row>
                                <Row gutter={[8,8]}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Sample Preparation No.' name='spcode'>
                                            <Input placeholder='Enter Sample Preparation Number.' />
                                        </Form.Item>                            
                                    </Col>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Sample Preparation Name.' name='spname'>
                                            <Input placeholder='Enter Sample Preparation Name.' />
                                        </Form.Item>                            
                                    </Col>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Form.Item label='Package.' name='pkname'>
                                            <Input placeholder='Enter Package Name.' />
                                        </Form.Item>                            
                                    </Col>
                                </Row>
                                <Row gutter={[8,8]}>
                                    <Col xs={24} sm={8} md={12} lg={12} xl={12}>
                                        {/* Ignore */}
                                    </Col>
                                    <Col xs={24} sm={8} md={12} lg={12} xl={12}>
                                        <Flex justify='flex-end' gap={8}>
                                            <Button type="primary" size='small' className='bn-action' icon={<SearchOutlined />} onClick={() => handleSearch()}>
                                                Search
                                            </Button>
                                            <Button type="primary" size='small' className='bn-action' danger icon={<ClearOutlined />} onClick={() => handleClear()}>
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

    const handleSearch = () => {
        form.validateFields().then( v => {
            const data = {...v}; 
            if( !!data?.created_date ) {
                const arr = data?.created_date.map( m => dayjs(m).format("YYYY-MM-DD") )
                const [created_form, created_to] = arr; 
                //data.created_date = arr
                Object.assign(data, {created_form, created_to});
            } 

            getData(data);
        }); 
    }

    const handleClear = () => {
        form.resetFields();
        
        handleSearch()
    }

    const hangleAdd = () => {
        navigate("manage/create", { state: { config: {...mngConfig, title:"สร้าง Pilot Scale", action:"create"} }, replace:true })
    }
    const handleEdit = (data) => {
        // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
        navigate("manage/edit", { state: { config: {...mngConfig, title:"แก้ไข Pilot scale", action:"edit", data:data} }, replace:true } );
    };
      
    const handleView = (data) => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = `/dln-print/${data.pilotscale_code}`;
    };    

    const handleDelete = (data) => { 
        // startLoading();
        plService.deleted(data?.pilotscale_code).then( _ => {
            const tmp = accessData.filter( d => d.pilotscale_code !== data?.pilotscale_code );

            setAccessData([...tmp]); 
        })
        .catch(err => {
            console.log(err);
            message.error("Request error!");
        });
    }; 

    const column = accessColumn( {handleEdit, handleDelete, handleView });

    const getData = (data) => {
        plService.search(data).then( res => {
            const {data} = res.data;

            setAccessData(data);
        }).catch( err => {
            console.log(err);
            message.error("Request error!");
        });
    }
            
    useEffect( () => {
        getData({});
    }, []);

    const TitleTable = (
        <Flex className='width-100' align='center'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start' align='center'>
                  <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Pilot Scale</Typography.Title>
                </Flex>
            </Col>
            <Col span={12} style={{paddingInline:0}}>
                <Flex gap={4} justify='end'>
                      <Button  
                      size='small' 
                      className='bn-action bn-center bn-primary-outline justify-center'  
                      icon={<FileAddOutlined  
                      style={{fontSize:'.9rem'}} />} 
                      onClick={() => { hangleAdd() } } >
                          Request Pilot Scale
                      </Button>
                </Flex>
            </Col>  
        </Flex>
    );       
    return (
    <div className='pilot-scale-access'>
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} >
            {FormSearch}
            <Card>
                <Row gutter={[8,8]} className='m-0'> 
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table title={()=>TitleTable} size='small' rowKey="pilotscale_code" columns={column} dataSource={accessData} />
                    </Col>
                </Row>         
            </Card>
        </Space>
    </div>
    );
}

export default PilotScaleAccess;
