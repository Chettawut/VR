/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Row, Col, Space, Flex, Typography, Collapse, Input, Select, DatePicker } from "antd";
import { Table, Card, message, Form } from "antd";
import { Button } from "antd";
 
import { columns } from "./sample-preparation.model.js";  
import { waitingApproved } from '../../store/slices/sample-preparation-approve.slices.js';
import { useAppDispatch } from '../../store/store.js';
import { 
    // BadgeSamplePreparationStatus, 
    TagSamplePreparationApproveStatus 
  } from "../../components/badge-and-tag";
import SamplePreparationService from "../../service/SamplePreparation.service.js";
import dayjs from 'dayjs';
import { ClearOutlined, FileAddOutlined, SearchOutlined } from '@ant-design/icons';

const approveStatus = [
    'approved',
    'cancel',
    'not_approved',
    'waiting_approve',
]
export default function SamplePreparation() {
    const navigate = useNavigate();
    const samplePreparationService = SamplePreparationService(); 
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();
 

    const [samplePreparationData, setSamplePreparationData] = useState([]);

    const [manageConfig] = useState({title:"เพิ่ม Sample Preparation", textOk:null, textCancel:null, action:"create", code:null});

    const [activeSearch, setActiveSearch] = useState([]);

    const [optionTags, setOptionTags] = useState([]);
    const [tagsValue, setTagsValue] = useState([]);

    const [approveStatusValue, setApproveStatusValue] = useState([]);
    
    const handleSearch = (load = false) => {
        form.validateFields().then( v => {
            const data = {...v};  
            if( !!data?.spdate ) {
                const arr = data?.spdate.map( m => dayjs(m).format("YYYY-MM-DD") )
                const [spdate_form, spdate_to] = arr; 
                //data.spdate_date = arr
                Object.assign(data, {spdate_form, spdate_to}); 
            } 

            getData(data, load);
        }).catch( err => {
            console.warn(err);
        })
    }

    const handleClear = () => {
        form.resetFields();
        
        handleSearch()
    }

    const getData = (data, load = false) => {
        data.sptag = data.sptag?.length > 0 ? `'${data.sptag.join("','")}'` : null;
        data.approved_result = data.approved_result?.length > 0 ? `'${data.approved_result.join("','")}'` : null; 
        samplePreparationService.search(data, {ignoreLoading : load}).then( res => {
            const {data} = res.data;

            setSamplePreparationData(data);
        }).catch( err => {
            console.log(err);
            message.error("Request error!");
        });
    }

    const showEditModal = (data) => {
        // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
        navigate("manage/edit", { state: { config: {...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.spcode} }, replace:true } );
    };    

    const handleView = (data) => {
        navigate("view", { state: { config: {...manageConfig, title:"View", code:data?.spcode} }, replace:true } );
    };    

    const handlePrint = (data) => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = `/spt-print/${data.spcode}`;
    };

    const handleDelete = (data) => {
        samplePreparationService.del(data?.spcode).then( _ => {
            const tmp = samplePreparationData.filter( d => d.spcode !== data?.spcode );

            setSamplePreparationData([...tmp]);
            dispatch(waitingApproved());
        });
    }; 

    const handleCustomerAppreved = (data) => {
        samplePreparationService.customer_approved({ spcode:data?.spcode, cusapproved_status:data.cusapproved_status === 'N' ? 'Y' : 'N' }).then( _ => {
            getData({}, true);
        });
    }; 

    const handleFormChange = (value) => {
        setTimeout( () => handleSearch(true), 40)
    }
    
    const SactionForm = () =><>  
        <Row gutter={[8,8]}>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Sample Code.' name='spcode'>
                    <Input placeholder='Enter Sample Code.' />
                </Form.Item>                            
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Sample Name.' name='spname'>
                    <Input placeholder='Enter Sample Name.' />
                </Form.Item>                            
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Sample Request(SR) Code.' name='srcode'>
                    <Input placeholder='Enter Sample Request(SR) Code.' />
                </Form.Item>                            
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Sample Date' name='spdate'>
                <DatePicker.RangePicker placeholder={['From Date', 'To date']} style={{width:'100%', height:40}}  />
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
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Approved Status.' name='approved_result'>
                    <Select 
                        className='select-tags'
                        mode='multiple'
                        value={approveStatusValue}
                        onChange={(e) => setApproveStatusValue(e)}
                        allowClear
                        autoClearSearchValue={false}
                        style={{
                            width: '100%',
                            height: '40px'
                        }}
                        placeholder="Please select"
                        maxTagCount= 'responsive'
                        options={approveStatus.map((item) => ({
                            value: item,
                            label: <TagSamplePreparationApproveStatus result={item} />,
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

    const FormSearch = (
        <Collapse 
        size="small"                    
        onChange={(e) => { setActiveSearch(e) }}
        activeKey={activeSearch} 
        items={[
        { 
            key: '1', 
            label: <><SearchOutlined /><span> Search</span></>,  
            children: SactionForm(),
            showArrow: false, 
        } 
        ]}
        // bordered={false}
        />         
    );

  
    const srColumn = columns({handleAction:showEditModal, handleDelete, handleView, handlePrint, handleCloseAttach: ()=>{ getData({}, true); }, handleCustomerAppreved });  

    const onload = () =>{
        getData({});
    }

    useEffect( () => {
        const initial =  async () => {
            const [ 
            tagsOptionRes, 
            ] = await Promise.all([ 
                samplePreparationService.get_sptags(), 
            ]);  
            const {data:tags} = tagsOptionRes.data;
             
            setOptionTags( tags ); 
        }
        initial();

        onload(); 
        return () => { };
    }, []);

    const TitleTable = (
      <Flex className='width-100' align='center'>
          <Col span={12} className='p-0'>
              <Flex gap={4} justify='start' align='center'>
                <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Sample Preparation</Typography.Title>
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
                        navigate("manage/create", { state: { config: {...manageConfig, title:"เพิ่ม Sample Request", action:"create"} }, replace:true })
                    }} >
                        Request Sample Preparation
                    </Button>
              </Flex>
          </Col>  
      </Flex>
    );
    return (
        <>
        <div className="layout-content"  id="area">
            <Space direction="vertical" size="middle" className='width-100 sample-preparation collapse-search' > 
                <Form form={form} layout="vertical" autoComplete="off" onValuesChange={(v) => handleFormChange(v)}>
                    {FormSearch}
                </Form> 
                <Card bordered={false} className="criclebox cardbody h-full">
                    <Table 
                    title={() => TitleTable}
                    size='small' 
                    rowKey="spcode" 
                    columns={srColumn} 
                    dataSource={samplePreparationData}  
                    onRow = {(v, index) => { 
                        return v.cusapproved_status === 'Y' ? { 
                        className:"cus-approved", 
                        } : {}
                    }}
                    />
                </Card> 
            </Space> 
        </div> 
        </>
    )
}
