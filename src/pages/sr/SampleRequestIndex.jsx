/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Row, Col, Space, Flex, Typography, Collapse, Form, DatePicker, Input } from "antd";
import { Table, Card, message } from "antd";
import { Button } from "antd";
import { ClearOutlined, FileAddOutlined, SearchOutlined } from "@ant-design/icons";

// import Highlighter from "react-highlight-words"; 
import { columns } from "./sample-request.model"; 

import SRService from "../../service/SRService"; 
import dayjs from 'dayjs';

// import { useLoadingContext } from "../../store/context/loading-context";
export default function SampleRequest() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    // const { startLoading, stopLoading } = useLoadingContext();  

    const [sampleRequestData, setSampleRequestData] = useState([]);
    const [activeSearch, setActiveSearch] = useState([]);

    const [manageConfig] = useState({title:"เพิ่ม Sample Request", textOk:null, textCancel:null, action:"create", code:null}); 
    
    const handleSearch = () => {
        form.validateFields().then( v => {
            const data = {...v};  
            if( !!data?.srdate ) {
                const arr = data?.srdate.map( m => dayjs(m).format("YYYY-MM-DD") )
                const [srdate_form, srdate_to] = arr; 
                //data.spdate_date = arr
                Object.assign(data, {srdate_form, srdate_to}); 
            } 

            getData(data);
        }).catch( err => {
            console.warn(err);
        })
    }

    const handleClear = () => {
        form.resetFields();
        
        handleSearch()
    }

    const getData = (data) => {
        SRService.search(data).then( res => {
            const {data} = res.data;

            setSampleRequestData(data);
        }).catch( err => {
            console.log(err);
            message.error("Request error!");
        });
    } 

    const showEditModal = (data) => {
        // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
        navigate("manage/edit", { state: { config: {...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode} }, replace:true } );
    }; 
      
    const handleView = (data) => {
        navigate("view", { state: { config: {...manageConfig, title:"View", code:data?.srcode} }, replace:true } );
    };    
      
    const handleColseAttach = (data) => {
        onload();
    };    

    const handleDelete = (data) => { 
        // startLoading();
        SRService.delete(data?.srcode).then( _ => {
            const tmp = sampleRequestData.filter( d => d.srcode !== data?.srcode );

            setSampleRequestData([...tmp]);

            // stopLoading();
        })
        .catch(e => {
            // stopLoading();
        });
    };   
 
    
    const srColumn = columns({handleAction:showEditModal, handleView, handleDelete, handleColseAttach} ); 

    
    const SactionForm = () =>(
    <>  
        <Row gutter={[8,8]}>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Sample Request Code.' name='srcode'>
                    <Input placeholder='Enter Sample Request(SR) Code.' />
                </Form.Item>                            
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Sample Request Date' name='srdate'>
                    <DatePicker.RangePicker placeholder={['From Date', 'To date']} style={{width:'100%', height:40}}  />
                </Form.Item>                            
            </Col> 
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Customer.' name='cusname'>
                    <Input placeholder='Enter Customer.' />
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
            children: <SactionForm />,
            showArrow: false, 
        } 
        ]}
        // bordered={false}
        />         
    );

    const onload = () =>{
        getData({});
    }
 
    useEffect( () => { 
        onload();
    }, []);

    const TitleTable = (
        <Flex className='width-100' align='center'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start' align='center'>
                  <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Sample Request</Typography.Title>
                </Flex>
            </Col>
            <Col span={12} style={{paddingInline:0}}>
                <Flex gap={4} justify='end'>
                      <Button  
                       size='small' 
                       className='bn-action bn-center bn-primary-outline justify-center'  
                       icon={<FileAddOutlined  
                       style={{fontSize:'.9rem'}} />} 
                       onClick={() => {
                           navigate("manage/create", { state: { config: {...manageConfig, title:"เพิ่ม Sample Preparation", action:"create"} }, replace:true })
                       }} >
                          Request Sample Preparation
                      </Button>
                </Flex>
            </Col>  
        </Flex>
    );    
    return (
        <>
        <div className="layout-content" id="area">
            <Space direction="vertical" size="middle" className='width-100 sample-request collapse-search' > 
                <Form form={form} layout="vertical" autoComplete="off">
                    {FormSearch}
                </Form> 
                <Card bordered={false} className="criclebox cardbody h-full">
                    <Table 
                        title={()=> TitleTable}
                        scroll={{ x: 'max-content' }} 
                        size='small' 
                        rowKey="srcode" 
                        columns={srColumn} 
                        dataSource={sampleRequestData}
                        className='table-sample-request'
                    />
                </Card>         
            </Space>
        </div>
        </>
    )
}
