import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from 'antd';
import { Collapse, Form, Flex, Row, Col, Space } from 'antd';
import { Input, Button, Table, message, Select, Typography } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { LiaPrescriptionBottleAltSolid } from "react-icons/lia";
import { accessColumn } from "./packaging.model";

import dayjs from 'dayjs';
import PackagingService from '../../service/Packaging.service'; 
import OptionService from '../../service/Options.service';

import { delay } from '../../utils/util';

const pkService = PackagingService();
const opService = OptionService();
const mngConfig = {title:"", textOk:null, textCancel:null, action:"create", code:null};
const PackagingAccess = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [accessData, setAccessData] = useState([]);
    const [activeSearch, setActiveSearch] = useState([]);

    const [packageTypeOption, setPackageTypeOption] = useState([]); 
    const [packageTypeValue, setPackageTypeValue] = useState([]); 

    
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
                <Row gutter={[8,8]}>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                        <Form.Item label='Package Name.' name='pkname'>
                            <Input placeholder='Enter Package Name.' />
                        </Form.Item>                            
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                        <Form.Item label='Package Type.' name='pktype'>
                            <Select 
                                mode='multiple'
                                value={packageTypeValue}
                                onChange={(e) => setPackageTypeValue(e)}
                                allowClear
                                autoClearSearchValue={false}
                                style={{
                                    width: '100%',
                                    height: '40px'
                                }}
                                placeholder="Please select"
                                maxTagCount= 'responsive'
                                options={packageTypeOption.map((item) => ({
                                    value: item.id,
                                    label: item.pktype,
                                  }))}
                                getPopupContainer={() => document.getElementById('area')}
                            ></Select>
                        </Form.Item>                            
                    </Col> 
                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                        <Form.Item label='Express Code.' name='expscode'>
                            <Input placeholder='Enter Express Code.' />
                        </Form.Item>                            
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                        <Form.Item label='Express Name.' name='expsname'>
                            <Input placeholder='Enter Express Name.' />
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
        }).catch( err => {
            console.warn(err);
        })
    }

    const handleClear = () => {
        form.resetFields();
        
        handleSearch()
    }
    // console.log(form);
    const handleAdd = () => {  
        navigate("manage/create", { state: { config: {...mngConfig, title:"สร้าง Packaging", action:"create"} } }); 
    }

    const handleEdit = (data) => {
        // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
        navigate("manage/edit", { state: { config: {...mngConfig, title:"แก้ไข Packaging", action:"edit", code:data?.id} }, replace:true } );
    }; 

    const handleDelete = (data) => { 
        // startLoading();
        pkService.deleted(data?.id).then( _ => {
            const tmp = accessData.filter( d => d.id !== data?.id );

            setAccessData([...tmp]); 
        })
        .catch(err => {
            console.log(err);
            message.error("Request error!");
        });
    }; 

    const column = accessColumn( {handleEdit, handleDelete });

    const getData = (data) => {
        data.pktype = data.pktype?.length > 0 ? `${data.pktype.join(',')}` : null;
        pkService.search(data).then( res => {
            const {data} = res.data;

            setAccessData(data);
        }).catch( err => {
            console.log(err);
            message.error("Request error!");
        });
    }

    const init = async () => {
        const [
            packagingRes, 
        ] = await Promise.all([
            opService.optionsPackaging({p : 'type'}), 
        ]); 
        const {data:pktype} = packagingRes.data; 
        // const opn_pktype = pktype.map( v => ({value:v.id, label:v.pktype}));
        setPackageTypeOption( pktype ); 
    }

            
    useEffect( () => {
        init();

        getData({});  
        return  async () => { 
            await delay(400);
            console.clear();
        }
    }, []);

    const TitleTable = (
        <Flex className='width-100' align='center'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start' align='center'>
                  <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Packaging</Typography.Title>
                </Flex>
            </Col>
            <Col span={12} style={{paddingInline:0}}>
                <Flex gap={4} justify='end'>
                      <Button  
                      size='small' 
                      className='bn-action bn-center bn-primary-outline justify-center'  
                      icon={<LiaPrescriptionBottleAltSolid  
                      style={{fontSize:'1.13rem'}} />} 
                      onClick={() => { handleAdd() } } >
                          Create Packaging
                      </Button>
                </Flex>
            </Col>  
        </Flex>
    );    
    return (
    <div className='pilot-scale-access' id="area">
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} >
            <Form form={form} layout="vertical" autoComplete="off">
                {FormSearch}
            </Form> 
            <Card>
                <Row gutter={[8,8]} className='m-0'>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table title={() => TitleTable} size='small' rowKey="id" columns={column} dataSource={accessData} scroll={{ x: 'max-content' }} />
                    </Col>
                </Row>         
            </Card>
        </Space>
    </div>
    );
}

export default PackagingAccess;
