/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Divider, Flex, Input, InputNumber, Row, Space, Table, Typography, message } from 'antd';
import { Form } from "antd";
import { ButtonBack } from '../../components/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ModalPackaging } from "../../components/modal/packaging/modal-packaging";

import { SaveFilled, SearchOutlined } from '@ant-design/icons';
 
import PackingSetService from '../../service/PackingSet.service';
import OptionService from '../../service/Options.service';

import { delay } from '../../utils/util';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuPackageSearch } from "react-icons/lu";
import { FaTruckLoading } from "react-icons/fa";

import { columnsDetailsEditable, componentsEditable, columnsLoadingTypeEditable } from './packing-set.model';
import ModalPackingSetGroup from '../../components/modal/packing-set/ModalPackingSetGroup';

import { v4 as uuidv4 } from 'uuid';

const packingSetService = PackingSetService();
const optionService = OptionService();

const loadingtype_defualt = ["FCL-with pallet", "FCL-loose load", "LCL-1pallets", "LCL-2pallets", "LCL-3pallets", "LCL-4pallets", "truck 4 wheels"];
function PackingSetManage() {
  const navigate = useNavigate(); 
  const location = useLocation();
  
  const { config } = location.state || {config:null};

  const [form] = Form.useForm();  

  const [formDetail, setFormDetail] = useState({});
  const [listDetail, setListDetail] = useState([]);
  const [listLoadingType, setListLoadingType] = useState([]);

  const [openModalPackaging, setOpenModalPackaging] = useState(false);
  const [openModalPackingSetGroup, setOpenModalPackingSetGroup] = useState(false);

  const [optionLoading, setOptionLoading] = useState([]);
  const [optionLoadingWrap, setOptionLoadingWrap] = useState([]);

  const handleChoosePackaging = (value) => {
    //setItemsData(value); 
    // console.log(value)
    const { unit_cost } = form.getFieldValue();
    const item = value.map( (m) => ({
      ...m,
      lost:Number( m?.lost || 0 ),
      transport:Number(m?.transport || 0),
      cost:Number( m?.cost || ( Number(m?.price || 0) + Number(m?.transport || 0) ) / (1 - (Number( m?.lost || 0 )) ) || 0 ),
      pcs_carton: m?.pcs_carton || Number( unit_cost ) || null,
    })); 
    
    setListDetail( item ); 
  }; 

  const handleChoosePackingSetGroup = (v) => {
    const f = form.getFieldsValue();
    const val = {...formDetail, ...f, packingset_groupid: v.id, packingset_group: v.packingset_group };
    
    setFormDetail(val); 
    form.setFieldsValue( val );
  }; 

  const handleConfirm = () => {
    form.validateFields().then(  (v) => {
        const header = {...formDetail, ...v };

        const detail = [ ...listDetail ];

        const loadingtype = [ ...listLoadingType ];

        const parm = {header, detail, loadingtype};

        // console.log( parm );
        const actions = config?.action !== "create" ? packingSetService.update( parm ) : packingSetService.create( parm );

        actions.then( async(r) => { 
            message.success("Request success.");

            handleClose();
        })
        .catch( err => {
            console.warn(err);
            const data = err?.response?.data;
            message.error( data?.message || "error request");
        });
    })
  };

  //** for packaging list */
  const handleSave = (row) => {
    const newData = (r) => {
        const itemDetail  = [...listDetail];
        const newData = [...itemDetail];
        
        const ind = newData.findIndex( (item) => r?.id === item?.id );
        if( ind < 0 ) return itemDetail; 
        const item = newData[ind]; 
        newData.splice(ind, 1, {
          ...item,
          ...{ 
            ...r,
            cost : ( Number(r?.price || 0) + Number(r?.transport || 0) ) / (1 - (Number( r?.lost || 0 )/100) ) || 0,
          }
        });
        return newData;
    }
    setListDetail([...newData(row)]);
  };

  const handleDelete = (code) => {
    const itemDetail  = [...listDetail];
    const newData = itemDetail.filter (
        (item) => item?.id !== code
    );
    setListDetail([...newData]);
    //setItemsData([...newData]);
  };

  const handleAction = (record) =>{
    const itemDetail  = [...listDetail];
    return itemDetail.length >= 1 ? (
        <Button
          className="bt-icon"
          size='small'
          danger
          icon={<RiDeleteBin5Line style={{fontSize: '1rem', marginTop: '3px' }} />}
          onClick={() => handleDelete(record?.id)}
          disabled={!record?.id}
        />
      ) : null
  };

  //** for loading type list */
  const handleSaveLoadingType = (row) => {
    const newData = (r) => {
        // console.log( r );
        const itemDetail  = [...listLoadingType];
        const newData = [...itemDetail];
        
        const ind = newData.findIndex( (item) => r?.id === item?.id );
        if( ind < 0 ) return itemDetail; 
        const item = newData[ind]; 
        newData.splice(ind, 1, {...item, ...r});
        return newData;
    }
    setListLoadingType([...newData(row)]);
  };

  const handleDeleteLoadingType = (code) => {
    const itemDetail  = [...listLoadingType];
    const newData = itemDetail.filter (
        (item) => item?.id !== code
    );
    setListLoadingType([...newData]);
    //setItemsData([...newData]);
  };

  const handleAddLoadingType = () => {
    setListLoadingType([...listLoadingType, { 
        id: uuidv4(),
        loadingtype_name: null,
        qty: 0, 
    }]);
  };

  const handleChoosedLoadingType = () => {
    const svalue = [...listLoadingType];
    const nameChoose = optionLoading.filter( d => !svalue.find( f => (f.loadingtype_name === d.value) ) );

    setOptionLoadingWrap([...nameChoose]); 
  };

  const handleActionLoadingType = (record) =>{
    const itemDetail  = [...listLoadingType];
    return itemDetail.length >= 1 ? (
        <Button
          className="bt-icon"
          size='small'
          danger
          icon={<RiDeleteBin5Line style={{fontSize: '1rem', marginTop: '3px' }} />}
          onClick={() => handleDeleteLoadingType(record?.id)} 
        />
      ) : null
  };

  const handleClose = async () => {
    navigate("/packing-set", {replace:true});
    await delay(300);
    console.clear();
  }

  const setData = ( v ) => { 
    packingSetService.get( v ).then( async res => {
      const { data : { header, detail, loadingtype } } = res.data;

      const init = {...header, packingset_groupid: !!header?.packingset_group ? header.packingset_groupid : null };
      setFormDetail({...init }); 
      form.setFieldsValue({...init});

      setListDetail([...detail.map( r => {
        return {
          ...r,
          cost : ( Number(r?.price || 0) + Number(r?.transport || 0) ) / (1 - (Number( r?.lost || 0 )/100) ) || 0
        }
      })]);

      setListLoadingType( loadingtype );
    }).catch( err => {
      console.log(err);
      message.error("Error getting infomation Sample preparation.")
    })
  }
  
  useEffect( () => {
    const initial = async () => {
      const [
        loadingTypeRes, 
      ] = await Promise.all([ 
          optionService.optionsPackingSet({p:"loading-type"}),
      ]); 
      const {data:loadingTypeOption} = loadingTypeRes.data;
      const opn_loadingType = [...new Set( [...loadingtype_defualt, ...( loadingTypeOption?.map( val => val?.value ) )] ) ];

      const opnLtd = opn_loadingType.map( v => ({value:v}));
      setOptionLoading( opnLtd );
      setOptionLoadingWrap( opnLtd );
    }

    if(!config) { 
      handleClose();
      return;
    }

    if(config?.action !== "create"){
      setData(config.code);
    }

    initial();
    return () => {
      // form.resetFields();
    }
  }, []);

  useEffect( ()=>{ 
    handleChoosedLoadingType();
    // console.log("paramer name choosed"); 
  }, [JSON.stringify(listLoadingType.map( m => m.paraname ))]);

  const column = columnsDetailsEditable(handleSave, {handleAction});  
  const columnLoadingType = columnsLoadingTypeEditable(handleSaveLoadingType, { handleAction:handleActionLoadingType, nameOption:optionLoadingWrap });  

  const SectionTop = (
    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
        <Col span={12} className='p-0'>
            <Flex gap={4} justify='start'>
              <ButtonBack target="/packing-set" />
  
            </Flex>
        </Col>
        {/* <Col span={12} style={{paddingInline:0}}>  
            <Flex gap={4} justify='end'>
                { !!code && <ButtonUpload code={code} refer='Packaging' /> }
  
            </Flex>  
        </Col> */}
    </Row>         
  );
  
  const SectionBottom = (
    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
        <Col span={12} className='p-0'>
            <Flex gap={4} justify='start'>
                <ButtonBack target="/packing-set" />
            </Flex>
        </Col>
        <Col span={12} style={{paddingInline:0}}>
            <Flex gap={4} justify='end'>
                <Button 
                className='bn-center justify-center'
                icon={<SaveFilled style={{fontSize:'1rem'}} />} 
                type='primary' style={{ width:'9.5rem' }} 
                onClick={()=>{ handleConfirm() }} 
                >Save</Button>
            </Flex>
        </Col>
    </Row>         
  );
  
  const TitleTable = (
    <Flex className='width-100' align='center'>
        <Col span={12} className='p-0'>
            <Flex gap={4} justify='start' align='center'>
              <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Packaging</Typography.Title>
            </Flex>
        </Col>
        <Col span={12} style={{paddingInline:0}}>
            <Flex gap={4} justify='end'>
                <Button icon={<LuPackageSearch style={{fontSize:'1.2rem'}} />} 
                  className='bn-center justify-center bn-primary-outline' 
                  onClick={() => setOpenModalPackaging(true)}
                >Select Packaging</Button>
            </Flex>
        </Col>  
    </Flex>
  );
  
  const TitleTableLoadingType = (
    <Flex className='width-100' align='center'>
        <Col span={12} className='p-0'>
            <Flex gap={4} justify='start' align='center'>
              <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Loading Type</Typography.Title>
            </Flex>
        </Col>
        <Col span={12} style={{paddingInline:0}}>
            <Flex gap={4} justify='end'>
                <Button icon={<FaTruckLoading style={{fontSize:'1.2rem'}} />} 
                  className='bn-center justify-center bn-primary-outline' 
                  onClick={() => handleAddLoadingType()}
                >Add Loading Type</Button>
            </Flex>
        </Col>  
    </Flex>
  );

  const FormCol50 = ({children, label, name, required = true}) => (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
      <Form.Item label={label} name={name} rules={[ { required: required, message: "Please enter data!", } ]} >
        {children}
      </Form.Item>
    </Col>
  );

  return (
    <div id="packing-set-manage" className='px-0 sm:px-0 md:px-8 lg:px-8'>
      <Space direction='vertical' className='flex gap-4' >
        { SectionTop }
        <Flex className='width-100' vertical gap={4}>
          <Divider orientation="left" className='!my-0' >Packing Detail</Divider>
          <Card style={{backgroundColor:'#f0f0f0' }}>
            <Form form={form} layout='vertical' autoComplete='off' >
              <Row gutter={[8,8]} className='px-4 sm:px-0 md:px-0 lg:px-0'>
                <FormCol50 label='Packing Set Name' name='packingset_name'>
                    <Input placeholder='Enter Packing Set Name' />
                </FormCol50>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label='Packing Set Group.' name='packingset_groupid' rules={[ { required: true, message: "Please enter data!", } ]} > 
                      <Space.Compact style={{ width: '100%' }}>
                          <Input readOnly placeholder='Choose Pacling Set Group.' value={ !!formDetail.packingset_group ? formDetail.packingset_group : ""}  />
                          <Button 
                              type="primary" 
                              className='bn-primary' 
                              icon={<SearchOutlined />} 
                              style={{minWidth:40}} 
                              onClick={()=>setOpenModalPackingSetGroup(true)} 
                          ></Button>
                      </Space.Compact> 
                  </Form.Item> 
                </Col>                                
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label='Unit/Cs' name='unit_cost' >
                    <InputNumber placeholder='Enter Unit Per Cost' controls={false} className='width-100 input-40' />
                  </Form.Item>
                </Col> 
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label='Fill volume (ml)' name='fill_volume' >
                    <InputNumber placeholder='Enter Fill volume (ml)' controls={false} className='width-100 input-40' />
                  </Form.Item>
                </Col> 
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label='Declared' name='declared' >
                    <Input placeholder='Enter Declared' className='width-100 input-40' />
                  </Form.Item>
                </Col> 
                <Col xs={24} sm={12} md={12} lg={4} xl={4} xxl={4}>
                  <Form.Item label='Labour cost' name='labour_cost' >
                    <InputNumber placeholder='Enter Labour cost' controls={false} className='width-100 input-40' />
                  </Form.Item>
                </Col> 
                <Col xs={24} sm={12} md={12} lg={4} xl={4} xxl={4}>
                  <Form.Item label='Overhead' name='overhead' >
                    <InputNumber placeholder='Enter Overhead' controls={false} className='width-100 input-40' />
                  </Form.Item>
                </Col> 
                <Col xs={24} sm={12} md={12} lg={4} xl={4} xxl={4}>
                  <Form.Item label='Packing labour cost' name='packing_labour_cost' >
                    <InputNumber placeholder='Enter Packing labour cost' controls={false} className='width-100 input-40' />
                  </Form.Item>
                </Col> 
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label='Dimenstion' name='dimension' >
                    <Input placeholder='Enter Dimenstion (WxLxH)' controls={false} className='width-100 input-40' />
                  </Form.Item>
                </Col> 
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Form.Item label='Remark' name='remark' >
                    <Input.TextArea rows={3} placeholder='Enter Remark' />
                  </Form.Item>
                </Col>                
              </Row> 
            </Form>
          </Card>          
        </Flex>

        <Flex className='width-100' vertical gap={4}>
          <Divider orientation="left" className='!my-0' >Packing Set</Divider>
          <Card style={{backgroundColor:'#f0f0f0' }}> 
              <Table 
                title={() => TitleTable }
                components={componentsEditable}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={listDetail}
                columns={column}
                pagination={false}
                rowKey="id" 
                scroll={{ x: 'max-content' }} 
                locale = {{ emptyText: <span>No data available, please add some data.</span> }}
              />
          </Card>          
        </Flex>

        <Flex className='width-100' vertical gap={4}>
          <Divider orientation="left" className='!my-0' >Loading Type</Divider>
          <Card style={{backgroundColor:'#f0f0f0' }}> 
              <Table 
                title={() => TitleTableLoadingType }
                components={componentsEditable}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={listLoadingType}
                columns={columnLoadingType}
                pagination={false}
                rowKey="id" 
                scroll={{ x: 'max-content' }} 
                locale = {{ emptyText: <span>No data available, please add some data.</span> }}
              />
          </Card>          
        </Flex>

        { SectionBottom}
      </Space>
        
      { openModalPackaging && ( 
        <ModalPackaging show={openModalPackaging} close={() => { setOpenModalPackaging(false) }} values={(v)=>{handleChoosePackaging(v)}} selected={listDetail}  ></ModalPackaging> 
      )}
      { openModalPackingSetGroup  && (
        <ModalPackingSetGroup show={openModalPackingSetGroup} close={() => { setOpenModalPackingSetGroup(false) }} values={(v)=>{handleChoosePackingSetGroup(v)}} /> 
      )}
    </div>
  )
}

export default PackingSetManage