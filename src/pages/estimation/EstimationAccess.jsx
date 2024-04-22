import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Select } from 'antd';
import { Collapse, Form, Flex, Row, Col, Space } from 'antd';
import { Input, Button, Table, message, DatePicker, Typography } from 'antd';
import { SearchOutlined, ClearOutlined, FileAddOutlined } from '@ant-design/icons'; 
import { accessColumn } from "./estimation.model";

import dayjs from 'dayjs';
import EstimationService from '../../service/Estimation.service';
import SamplePreparationService from '../../service/SamplePreparation.service';

import { delay } from '../../utils/util';

const estService = EstimationService(); 
const spmService = SamplePreparationService();
const mngConfig = {title:"", textOk:null, textCancel:null, action:"create", code:null};

const RangePicker = DatePicker.RangePicker;
const EstimationAccess = () => {
    const navigate = useNavigate();
    
    const [form] = Form.useForm();

    const [accessData, setAccessData] = useState([]);
    const [activeSearch, setActiveSearch] = useState([]);

    const [mounted, setMounted] = useState(false);
 
    const [optionTags, setOptionTags] = useState([]);
    const [tagsValue, setTagsValue] = useState([]);
    
    const CollapseItemSearch = () => {
      return (
        <>  
        <Row gutter={[8,8]}> 
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Estimation Code' name='estcode'>
                    <Input placeholder='Enter Estimation Code.' />
                </Form.Item>                            
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Sample Name' name='spname'>
                    <Input placeholder='Enter Sample Name.' />
                </Form.Item>                            
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Sample No.' name='spcode'>
                    <Input placeholder='Enter Sample No.' />
                </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Estimate Cost Date.' name='created_date'>
                    <RangePicker placeholder={['From Date', 'To date']} style={{width:'100%', height:40}}  />
                </Form.Item>                            
            </Col> 
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Sample Date.' name='spdate'>
                    <RangePicker placeholder={['From Date', 'To date']} style={{width:'100%', height:40}}  />
                </Form.Item>                            
            </Col> 
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Tags.' name='sptag'>
                    <Select 
                        mode='multiple'
                        value={tagsValue}
                        onChange={(e) => setTagsValue(e)}
                        allowClear
                        autoClearSearchValue={false}
                        style={{
                            width: '100%',
                            height: '40px'
                        }}
                        placeholder="Please select"
                        maxTagCount= 'responsive'
                        options={optionTags.map((item) => ({
                            value: item.id,
                            label: item.text,
                        }))}
                        getPopupContainer={() => document.getElementById('area')}
                    ></Select>
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
      )
    }

    const FormSearch = (
        <Collapse 
        size="small"                    
        onChange={(e) => { setActiveSearch(e) }}
        activeKey={activeSearch} 
        items={[
        { 
            key: '1', 
            label: <><SearchOutlined /><span> Search</span></>,  
            children: CollapseItemSearch(),
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
                Object.assign(data, {created_form, created_to});
            }
            if( !!data?.spdate ) {
                const arr = data?.spdate.map( m => dayjs(m).format("YYYY-MM-DD") )
                const [spdate_form, spdate_to] = arr; 
                Object.assign(data, {spdate_form, spdate_to});
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
    const hangleAdd = () => {  
        navigate("manage/create", { state: { config: {...mngConfig, title:"Create Estimation", action:"create"} } }); 
    }

    const handleEdit = (data) => {
        // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
        navigate("manage/edit", { state: { config: {...mngConfig, title:"แก้ไข Estimation", action:"edit", code:data?.estcode} }, replace:true } );
    }; 

    const handleDelete = (data) => { 
        // startLoading();
        estService.deleted(data?.estcode).then( _ => {
            const tmp = accessData.filter( d => d.estcode !== data?.estcode );

            setAccessData([...tmp]); 
        })
        .catch(err => {
            console.log(err);
            message.error("Request error!");
        });
    }; 

    const handleView  = (data) => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = `/est-print/${data.estcode}`;
      };

    const column = accessColumn( {handleEdit, handleDelete, handleView  });

    const getData = (data) => {
        data.sptag = data.sptag?.length > 0 ? `'${data.sptag.join("','")}'` : null;
        estService.search(data).then( res => {
            const {data} = res.data;

            setAccessData(data);
        }).catch( err => {
            console.log(err);
            message.error("Request error!");
        });
    }

    const handleFormChange = (value) => {
        setTimeout( () => handleSearch(true), 40)
    }

    const init = async () => {
        const [ 
            tagsOptionRes, 
        ] = await Promise.all([ 
            spmService.get_sptags(), 
        ]);  
        const {data:tags} = tagsOptionRes.data;
         
        setOptionTags( tags ); 
    }
            
    useEffect( () => {
        init();

        getData({});  


        setMounted( true );
        return  async () => { 
            await delay(400);
            setMounted( false );
            console.clear();
        }
    }, []);
    const TitleTable = (
        <Flex className='width-100' align='center'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start' align='center'>
                  <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Estimate Cost</Typography.Title>
                </Flex>
            </Col>
            <Col span={12} style={{paddingInline:0}}>
                <Flex gap={4} justify='end'>
                      <Button  
                      size='small' 
                      className='bn-action bn-center bn-primary-outline justify-center'  
                      icon={<FileAddOutlined  style={{fontSize:'.9rem'}} />} 
                      onClick={() => { hangleAdd() } } >
                          Request Estimate cost
                      </Button>
                </Flex>
            </Col>  
        </Flex>
    );    
    return mounted && (
    <div className='pilot-scale-access' id="area">
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} >
            <Form form={form} layout="vertical" autoComplete="off" onValuesChange={(v) => handleFormChange(v)} >
                {FormSearch}
            </Form> 
            <Card>
                <Row gutter={[8,8]} className='m-0'>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table title={()=>TitleTable} size='small' rowKey="estcode" columns={column} dataSource={accessData} scroll={{ x: 'max-content' }} />
                    </Col>
                </Row>         
            </Card>
        </Space>
    </div>
    );
}

export default EstimationAccess;