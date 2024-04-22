/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Select } from 'antd';
import { Collapse, Form, Flex, Row, Col, Space } from 'antd';
import { Input, Button, Table, message, Typography } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons'; 
import { LuPackagePlus } from "react-icons/lu";
import { accessColumn } from "./packing-set.model";

import dayjs from 'dayjs';
import PackingSetService from '../../service/PackingSet.service';
import OptionService from '../../service/Options.service';
import { delay } from '../../utils/util';

const packingSetService = PackingSetService(); 
const mngConfig = {title:"", textOk:null, textCancel:null, action:"create", code:null};

// const RangePicker = DatePicker.RangePicker;
const opService = OptionService();
const PackingSetAccess = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [accessData, setAccessData] = useState([]);
    const [activeSearch, setActiveSearch] = useState([]);
 
    const [packingSetGroupOption, setPackingSetGroupOption] = useState([]); 
    const [packingSetGroupValue, setPackingSetGroupValue] = useState([]); 

    const [optionLoadingTypes, setOptionLoadingTypes] = useState([]);
    const [loadingTypesValue, setLoadingTypesValue] = useState([]);

    const [loading, setLoading] = useState(false);

    const CollapseItemSearch = () => {
      return (
        <>  
        <Row gutter={[8,8]}> 
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Packing Set' name='packingset_name'>
                    <Input placeholder='Enter Packing Set Name.' />
                </Form.Item>                            
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Package Set Group.' name='packingset_group'>
                    <Select 
                        mode='multiple'
                        value={packingSetGroupValue}
                        onChange={(e) => setPackingSetGroupValue(e)}
                        allowClear
                        autoClearSearchValue={false}
                        style={{
                            width: '100%',
                            height: '40px'
                        }}
                        placeholder="Please select"
                        maxTagCount= 'responsive'
                        options={packingSetGroupOption.map((item) => ({
                            value: item.id,
                            label: item.packingset_group,
                          }))}
                        getPopupContainer={() => document.getElementById('area')}
                    ></Select>
                </Form.Item>                            
            </Col>             
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Loading Type' name='loadingtype_name'>
                    <Select 
                        mode='multiple'
                        value={loadingTypesValue}
                        onChange={(e) => setLoadingTypesValue(e)}
                        allowClear
                        autoClearSearchValue={false}
                        style={{
                            width: '100%',
                            height: '40px'
                        }}
                        placeholder="Please select"
                        maxTagCount= 'responsive'
                        options={optionLoadingTypes.map((item) => ({
                            value: item.value,
                            label: item.value,
                        }))}
                        getPopupContainer={() => document.getElementById('area')}
                    ></Select>
                </Form.Item>                            
            </Col>            
            {/* <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Request Date.' name='created_date'>
                    <RangePicker placeholder={['From Date', 'To date']} style={{width:'100%', height:40}}  />
                </Form.Item>                            
            </Col> 
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='Request By.' name='created_by'>
                    <Input placeholder='Enter First Name or Last Name.' />
                </Form.Item>
            </Col> */}
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
        navigate("manage/create", { state: { config: {...mngConfig, title:"Create Packing Set", action:"create"} } }); 
    }

    const handleEdit = (data) => {
        // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
        navigate("manage/edit", { state: { config: {...mngConfig, title:"แก้ไข Packaging", action:"edit", code:data?.id} }, replace:true } );
    }; 

    const handleDelete = (data) => { 
        // startLoading();
        packingSetService.deleted(data?.id).then( _ => {
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
        data.packingset_group = data.packingset_group?.length > 0 ? `${data.packingset_group.join(',')}` : null;
        data.loadingtype_name = data.loadingtype_name?.length > 0 ? `'${data.loadingtype_name.join("','")}'` : null;
        packingSetService.search(data, {ignoreLoading: loading}).then( res => {
            const {data} = res.data;

            setAccessData(data);
        }).catch( err => {
            console.log(err);
            message.error("Request error!");
        });
    }

    const init = async () => {
        const [
            packingSetGroupRes, 
            loadingTypeRes, 
        ] = await Promise.all([
            opService.optionsPackingSet({p : 'group'}), 
            opService.optionsPackingSet({p : 'loading-type'})
        ]); 
        const {data:pks_group} = packingSetGroupRes.data; 
        const {data:loadingtype} = loadingTypeRes.data;
        setPackingSetGroupOption( pks_group );
        setOptionLoadingTypes( loadingtype )
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
                  <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Packing Set</Typography.Title>
                </Flex>
            </Col>
            <Col span={12} style={{paddingInline:0}}>
                <Flex gap={4} justify='end'>
                      <Button  
                      size='small' 
                      className='bn-action bn-center bn-primary-outline justify-center'  
                      icon={<LuPackagePlus  style={{fontSize:'.9rem'}} />} 
                      onClick={() => { hangleAdd() } } >
                          Request Packing Set
                      </Button>
                </Flex>
            </Col>  
        </Flex>
    );    
    return (
    <div className='pilot-scale-access' id="area">
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} >
            <Form form={form} layout="vertical" autoComplete="off" onValuesChange={() => handleSearch(true)}>
                {FormSearch}
            </Form> 
            <Card>
                <Row gutter={[8,8]} className='m-0'>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table title={()=>TitleTable} size='small' rowKey="id" columns={column} dataSource={accessData} scroll={{ x: 'max-content' }} />
                    </Col>
                </Row>         
            </Card>
        </Space>
    </div>
    );
}

export default PackingSetAccess;
