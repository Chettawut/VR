/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Space, Row, Col, Flex, Input, Collapse, Table, message } from 'antd';
import { Card } from 'antd';
import { Form, Empty, Descriptions, Typography } from 'antd';
import {  Button } from 'antd';
import { ArrowLeftOutlined, ExperimentFilled, SaveOutlined } from '@ant-design/icons';
import { TbFileSearch, TbFileX } from "react-icons/tb";
import ModalSamplePreparation from '../../components/modal/sample-preparation/ModalSamplePreparation';

import { formatCommaNumber } from '../../utils/util';
import { itemsColumn, parameterColumn } from './pilot-scale.model';
import SamplePreparationService from '../../service/SamplePreparation.service';
import PilotScaleService from '../../service/PilotScale.service';

const spService = SamplePreparationService();
const plService = PilotScaleService();
function PilotScaleManage() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const { Text } = Typography;
  const { config } = location.state || {config:null};
  const [form] = Form.useForm();

  const batchSizeRef = useRef(null);

  const [openModal, setOpenModal] = useState(false)
  const [dsItems, setDsItems] = useState([]);

  const [batchSize, setBatchSize] = useState(1);

  const [pilotHeader,  setPilotHerder] = useState({});
  const [spItems, setSpItems] = useState(null);
  const [spParms, setSpParms] = useState(null);
  // const [spMaster, setSpMaster] = useState({});

  const setData = ( v ) => {
    
    spService.get( v.spcode ).then( async res => {
      const { data : { master, detail, params } } = res.data
      const total_weight  = ( detail.reduce( (a,v) =>  a += (!!v?.stcode ? Number(v.amount) : 0), 0 ) )  /1000;
      const i = [
        { 
          label: 'Sample Preparation No.', 
          labelStyle: { verticalAlign:'top', maxWidth:205, minWidth:120 },
          children: master.spcode, 
          span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 } 
        },
        { 
          label: 'Sample Preparation Name.', 
          labelStyle: { verticalAlign:'top', maxWidth:205, minWidth:120 },
          children: master.spname, 
          span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 } 
        },
        { 
          label: 'PK Code.', 
          labelStyle: { verticalAlign:'top', maxWidth:205, minWidth:120 },
          contentStyle: { verticalAlign:'top', minWidth:'20vw' },
          children: master.pkcode, 
          span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 } 
        },
        { 
          label: 'Packaging.', 
          labelStyle: { verticalAlign:'top', maxWidth:205, minWidth:120 },
          style: { verticalAlign:'top', minWidth:'20vw' },
          children: master.pkname, 
          span: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 } 
        },
      ]; 
  
      setDsItems([...i]); 

      if( config.action !== 'create'){
        const d = await plService.get(v.pilotscale_code);
        const { data:{ batchsize, fgcode,  productcode, remark, pilotscale_code } } =  d.data;
 
        form.setFieldsValue({ batchsize, fgcode,  productcode, remark });
        setPilotHerder({...master, batchsize, fgcode,  productcode, pilotscale_code });
        setBatchSize(Number(batchsize).toFixed(5)); 
      } else {
        setPilotHerder({...master, batchsize : total_weight});
        setBatchSize(total_weight.toFixed(5));
      }
      // console.log(detail)
      setSpItems( detail );
      setSpParms( params );
    }).catch( err => {
      console.log(err);
      message.error("Error getting infomation Sample preparation.")
    })
  }

  const handleClose = () => {
    setTimeout( () => navigate("/pilot-scale", {replace:true}), 400);
  }

  const handleSearch = (e) => {
    setOpenModal(true);
  }

  const handleBatchSize = (e) => {  
    const val = e.target.value;
    form.setFieldValue("batchsize", val)
    setPilotHerder( (state) => ({...state, batchsize : val }) ); 
  }

  const handlePilotScale = (v) => {
    const toGram = ( Number( pilotHeader.batchsize )  || 1) * 1000;
    return  (toGram/100)  * (Number( v.totalpercent ) * 100 )
  }

  const handleChooseValue = (v) => {
    // setSpMaster(v);
    setOpenModal(false); 
    setData(v);
  }

  const handleConfirm = () => {
    try {
      form.validateFields().then( d => {
        if( config.action === 'create'){
          plService.create( { header : {...pilotHeader, ...d} } ).then( res => {
            // console.log(d, res);      
            message.success("Create Pilot Scale Success.");

            handleClose();
          }).catch( err => { message.warning("Request Pilot Scale Fail.") } );        
        } else if( config.action === 'edit') {
          plService.update( { header : {...pilotHeader, ...d} } ).then( res => {
            // console.log(d, res);      
            message.success("Update Pilot Scale Success.");

            handleClose();
          }).catch( err => { message.warning("Request Pilot Scale Fail.") } );            
        }        
      }).catch( err => { message.warning("Please Enter value.") });
    } catch (err){
      message.warning("Request Pilot Scale Fail."); 
      console.warn(err);
    }

  }

  const columnItems = itemsColumn({handlePilotScale});

  const HeaderBath = () => {
    return (
      <>
        <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
            <Flex align='center' gap={10}>
              <Form form={form}>
                <Form.Item label='Batch size :' name='batchsize' rules={[ { required: true, message: "Please enter data!", } ]} >
                  <Space.Compact style={{ width: '100%' }}>
                    <Input 
                      ref={batchSizeRef} 
                      suffix='kg.' 
                      placeholder='Enter Batch size.' 
                      className='input-40'  
                      onBlur={handleBatchSize}
                      onPressEnter={(e) => handleBatchSize(e)}  
                      defaultValue={pilotHeader.batchsize}
                    />
                    <Button type="primary" icon={<ExperimentFilled />} onClick={(e) => handleBatchSize(e)} style={{minWidth:40, borderRadius:'0 6px 6px 0'}} ></Button>
                  </Space.Compact> 
                </Form.Item>
              </Form>
              {/* <label style={{fontWeight:400}}>Batch size :</label>   */}

            </Flex>                              
          </Col>
        </Row>
      </>
    )
  }

  const handleSummary = (r) => {
    // console.log(r);
    // const maxStep = Math.max( ...r.map( m => Number(m.stepno) ) );
    // const totalWeight  = r.filter( f => Number(f.stepno) === maxStep).reduce( (a,v) =>  a += Number(v.amount), 0 );
    const totalWeight  = r.reduce( (a,v) =>  a += (!!v?.stcode ? Number(v.amount) : 0), 0 );
    const totalPercent  = r.reduce( (a,v) =>  a += Number(v.totalpercent), 0 );
    const totalBatchsize  = r.reduce( (a,v) => {
      const toGram = ( Number( pilotHeader.batchsize )  || 1) * 1000; 
      return a += (toGram/100)  * (Number( v.totalpercent ) * 100);
    } , 0 );

    return (
      <>
      <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={3} className='pe-2 text-center border-right-0' >
              <Text>รวม</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={1} className='pe-2 text-end border-right-0' > 
              <Text type="danger">{ formatCommaNumber(totalWeight || 0) }</Text>
          </Table.Summary.Cell> 
          <Table.Summary.Cell index={2} colSpan={1} className='pe-2 text-end border-right-0' >
              <Text type="danger">{ formatCommaNumber(totalPercent * 100) }</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3} colSpan={1}  className='pe-2 text-end border-right-0' >
              <Text type="danger">{ formatCommaNumber(totalBatchsize) }</Text>
          </Table.Summary.Cell>
      </Table.Summary.Row>
  </>
    )
  }

  const ButtonActionLeft = (
    <Space gap="small" align="center" style={{display:"flex", justifyContent:"start"}} > 
        <Button style={{ width: 120 }} icon={ <ArrowLeftOutlined /> } onClick={ () => { navigate("/pilot-scale", {replace:true}); } } >
            กลับ
        </Button>
    </Space>
  );

  const ButtonActionBottomLeft = (
    <Space gap="small" align="center" style={{display:"flex", justifyContent:"start"}} > 
        <Button style={{ width: 120 }} icon={ <ArrowLeftOutlined /> } onClick={ () => { navigate("/pilot-scale", {replace:true}); } } >
            กลับ
        </Button>
    </Space>
  );

  const ButtonActionBottomRight = (
    <Space gap="small" align="center" style={{display:"flex", justifyContent:"end"}} > 
        <Button 
          icon={<SaveOutlined style={{fontSize:'1rem'}} />} 
          type='primary' style={{ width:'9.5rem' }} 
          onClick={()=>{ handleConfirm() }} 
        >ยืนยันบันทึก</Button>
    </Space>
  );

  useEffect( () => {
    if(!config) { 
      handleClose();
      return;
    }

    if(config?.action !== "create"){
      setData(config.data);
    }
    return () => {
      // form.resetFields();
    }
  }, []);

  return (
    <div className='pilot-scale-manage'>
      <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
          <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
             <Col span={12} className='p-0'>{ ButtonActionLeft }</Col>
             {/* <Col span={12} style={{paddingInline:0}}>  </Col> */}
          </Row>          
          <Card style={{backgroundColor:'#f0f0f0' }}>
            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0 items-center'>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <Flex align='center' justify='start'>
                  <Typography.Title level={3} className='m-0'>Pilot Scale for Sample</Typography.Title>
                </Flex>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <Flex align='center' justify='end'>
                  <Button  className='bn-center bn-primary-outline' icon={<TbFileSearch style={{fontSize:'1.34rem'}} />} onClick={(e) => handleSearch(e) } >
                    Select Sample Preparation
                  </Button> 
                </Flex>
              </Col>
            </Row>               
          </Card>
          { dsItems.length < 1 ? (
            <Card style={{backgroundColor:'#f0f0f0' }}>
              <Empty description={false} image={<TbFileX style={{fontSize:'12rem', color:'#b5b5b5'}} />} >  
                <span style={{fontSize:'1rem', fontWeight:600, color:'#b5b5b5'}}>
                  No data found. Please select Sample Preparation No again.
                </span>
              </Empty>
            </Card>
          ) : (
            <> 
              <Descriptions 
                bordered
                column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
                items={dsItems} 
              />

              <Card style={{backgroundColor:'#f0f0f0' }}>
                  <Form form={form} layout="vertical" autoComplete="off" >
                    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <Form.Item label='FG Code' name='fgcode'>
                            <Input placeholder='Enter FG Code.'></Input>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                          <Form.Item label='Product Code' name='productcode'>
                            <Input placeholder='Enter Product Code.'></Input>
                          </Form.Item>
                        </Col>
                    </Row> 
                  </Form>
              </Card>

              <Card title={<HeaderBath />} style={{backgroundColor:'#f0f0f0' }} > 
                <Table
                  style={{backgroundColor: '#fafafa' }}
                  dataSource={spItems || []}
                  columns={columnItems}
                  pagination={false}
                  rowKey="spno"
                  scroll={{ x: 'max-content' }} 
                  
                  summary={(r)=> handleSummary(r) }
                />
              </Card> 

              <Card title='Quality Parameters' style={{backgroundColor:'#f0f0f0' }} > 
                <Table
                  style={{backgroundColor: '#fafafa' }}
                  bordered
                  dataSource={spParms || []}
                  columns={parameterColumn}
                  pagination={false}
                  rowKey="id"
                  scroll={{ x: 'max-content' }} 
                  size='small' 
                />
              </Card> 
              <Card style={{backgroundColor:'#f0f0f0' }}>
                  <Form form={form} layout="vertical" autoComplete="off" >
                    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                          <Form.Item label='Remark' name='remark'>
                            <Input.TextArea placeholder='Enter Remark.' rows={5}></Input.TextArea>
                          </Form.Item>
                        </Col> 
                    </Row> 
                  </Form>
              </Card>
            </> 
          )}
          <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
             <Col span={12} className='p-0'>{ ButtonActionBottomLeft }</Col>
             <Col span={12} style={{paddingInline:0}}> {ButtonActionBottomRight} </Col>
          </Row> 

      </Space>

      { openModal && <ModalSamplePreparation show={openModal} close={() => setOpenModal(false)} values={handleChooseValue}  /> }

    </div>
  )
}

export default PilotScaleManage