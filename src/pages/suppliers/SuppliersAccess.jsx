/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Radio, Select, message } from 'antd';
import { Collapse, Form, Flex, Row, Col, Space } from 'antd';
import { Input, Button, Table, Typography } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { MdGroupAdd } from "react-icons/md";
import { accessColumn } from "./suppliers.model";

// import dayjs from 'dayjs';
import SupplierService from '../../service/SupplierService'; 

const spiService = {...SupplierService};
const mngConfig = {title:"", textOk:null, textCancel:null, action:"create", code:null};

const optionTypeSup = [
    { value: "ผู้ขาย", label: "ผู้ขาย" },
    { value: "ผู้ผลิต", label: "ผู้ผลิต" },
    { value: "ผู้ขายและผู้ผลิต", label: "ผู้ขายและผู้ผลิต" },
];
const SuppliersAccess = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm(); 
    const [accessData, setAccessData] = useState([]);
    const [activeSearch, setActiveSearch] = useState([]);

    const [supTypeValue, setSupTypeValue] = useState(['ผู้ขาย', 'ผู้ขายและผู้ผลิต']); 

    const handleSearch = () => {
        form.validateFields().then( v => {
            const data = {...v}; 

            data.type = data.type?.length > 0 ? `'${data.type.join("','")}'` : null;
            onGetSearch(data); 
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
        navigate("manage/edit", { state: { config: {...mngConfig, title:"แก้ไข Delivery Note", action:"edit", code:data?.supcode} }, replace:true } );
    }; 
      
    const handleView = (data) => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = `/dln-print/${data.dncode}`;
    }; 
    
    const onGetSearch = (data = {}) => {
        spiService.getsupplier(data).then( res => {
            const {data} = res.data;

            setAccessData(data);
        }).catch( err => {
            console.log(err);
            message.error("Request error!");
        });        
    }
            
    useEffect( () => { 
        onGetSearch();

        form.setFieldValue("status", "Y")
    }, []);

    const FormSearchComponent = () => (
        <Form form={form} layout="vertical" autoComplete="off">
            <Row gutter={[8,8]}>
                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item label='Supplier Code.' name='supcode'>
                        <Input placeholder='Enter Supplier Code.' />
                    </Form.Item>                            
                </Col>
                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item label='Supplier Name.' name='supname'>
                        <Input placeholder='Enter Supplier Name.' />
                    </Form.Item>                            
                </Col> 
                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item label='Supplier Type.' name='type'>
                        <Select 
                            mode='multiple'
                            value={supTypeValue}
                            onChange={(e) => setSupTypeValue(e)}
                            allowClear
                            autoClearSearchValue={false}
                            style={{
                                width: '100%',
                                height: '40px'
                            }}
                            placeholder="Please select"
                            maxTagCount= 'responsive'
                            options={optionTypeSup}
                            getPopupContainer={() => document.getElementById('area')}
                        />
                    </Form.Item>                            
                </Col>                 
                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item label='Countires.' name='country'>
                        <Input placeholder='Enter Countires.' />
                    </Form.Item>                            
                </Col>
                <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8} >
                    <Form.Item label='สถานะ' name='status'>
                        <Radio.Group  buttonStyle="solid" >
                            <Radio.Button value="Y">Enable</Radio.Button>
                            <Radio.Button value="N">Disable</Radio.Button>
                        </Radio.Group>
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
    )
    const FormSearch = (
        <Collapse 
            size="small"
            onChange={(e) => { setActiveSearch(e) }}
            activeKey={activeSearch}
            items={[
                { 
                    key: '1', 
                    label: <><SearchOutlined /><span> Search</span></>, 
                    children: <FormSearchComponent />,
                    showArrow: false, 
                }
            ]}
            // bordered={false}
        />         
    );
    const column = accessColumn( {handleEdit, handleView });

    const TitleTable = (
        <Flex className='width-100' align='center'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start' align='center'>
                  <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Supplier</Typography.Title>
                </Flex>
            </Col>
            <Col span={12} style={{paddingInline:0}}>
                <Flex gap={4} justify='end'>
                      <Button  
                      size='small' 
                      className='bn-action bn-center bn-primary-outline justify-center'  
                      icon={<MdGroupAdd style={{fontSize:'.9rem'}} />} 
                      onClick={() => { hangleAdd() } } >
                          Create Supplier
                      </Button>
                </Flex>
            </Col>  
        </Flex>
    );    
    return (
    <div className='supplier-access'>
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} >
            {FormSearch}
            <Card>
                <Row gutter={[8,8]} className='m-0'>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table title={()=>TitleTable} size='small' rowKey="supcode" columns={column} dataSource={accessData} />
                    </Col>
                </Row>         
            </Card>
        </Space>
    </div>
    );
}

export default SuppliersAccess;
