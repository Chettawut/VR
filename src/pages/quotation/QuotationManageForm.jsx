/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

// import { MinusCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import { Input, Form, Card, Row, Col, Divider, Flex } from 'antd';
import { Typography, message, Button, Descriptions, InputNumber, Space } from 'antd';
 
// import OptionService from '../../service/Options.service.js';
import { ModalEstimationPackingSet  } from '../../components/modal/esimation/modal-estiamtion.js';
import { FaBoxesPacking } from "react-icons/fa6";
import { formatCommaNumber } from '../../utils/util.js';
import { MinusCircleOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';

import { quotationDetailForm } from "./quotation.model.js";
import { ModalLoadingType, ModalShippingType } from '../../components/modal/shipping-type/modal-shipping-type.js';


import { description_defualt } from "./quotation.model.js";
import { v4 as uuidv4 } from 'uuid';
// const opservice = OptionService();
const KEY_DEFAULT = description_defualt.map( (m) => m.detail_name);
function QuotationManageForm({ confirm, mode, formName, source, list=[], config={} }) {
  const [form] = Form.useForm();

  const [openEstimation, setOpenEstimation] = useState(false); 
  const [openLoadingType, setOpenLoadingType] = useState(false);
  const [openShippingType, setOpenShippingType] = useState(false);



  const [formData, setFormData] = useState(quotationDetailForm);
  const [descEstimationData, setDescEstimationData] = useState([]);

  const updateForm = ( value, editType = true ) => {
    const form_value = form.getFieldsValue();
    const initeial_value = {...formData, ...form_value, ...value}
    // console.log( initeial_value );
    // const { exworksell_price, qty, shipping_price, insurance, commission } = initeial_value;

    const qty = Number( initeial_value?.loadingtype_qty || 0);
    const shipping_price = Number( initeial_value?.shippingtype_price || 0);
    const commission = Number( initeial_value?.commission || 0) / 100;
    const insurance = Number( initeial_value?.insurance || 0);
    const exworksell_price = Number( initeial_value?.exworksell_price || 0);
    initeial_value.price =  (parseFloat( ((exworksell_price + (shipping_price / qty) + (insurance / qty)) / ( 1 - commission)).toFixed(2) )) || 0;
    initeial_value.price_per_carton = editType ? (initeial_value.price_per_carton || initeial_value?.price || 0) : (initeial_value?.price || 0);
    initeial_value.total_amount = qty * initeial_value.price_per_carton;
    // initeial_value.qty = qty;
    setFormData(initeial_value);
    form.setFieldsValue( initeial_value ); 

    

    handleUpdateDescription(initeial_value)
  }

  const updateDetail = (array, idToUpdate, newName) => {
    for (let i = 0; i < array.length; i++) {
      if (!!KEY_DEFAULT.includes(idToUpdate) && array[i].detail_name === idToUpdate ) {
        // console.log(array[i])
        array[i].detail_value = newName || array[i].detail_value;
        setTimeout( () => form.setFieldValue( 'quotations_list',  array ), 200);
        break; // Stop loop once the item is updated
      }
    }
  }

  const handleUpdateDescription = (val) => {  
    updateDetail(val?.quotations_list, "Ref", val?.spcode );//Ref
    updateDetail(val?.quotations_list, "Packing", val?.packingset_name );//Packing
    updateDetail(val?.quotations_list, "Unit Net wt(gm)", !!val?.declared ? `${val?.declared}` : null );//Unit Net wt(gm)
    updateDetail(val?.quotations_list, "carton size (WxLxH)", !!val?.dimension ? `${val?.dimension} mm` : null );//carton size (WxLxH)
    updateDetail(val?.quotations_list, "Gross wt per carton(kg)", !!val?.gross_weight_carton ? `${((val?.gross_weight_carton || 0 )/1000).toFixed(2)}kgs` : null );//Gross wt per carton(kg)
    updateDetail(val?.quotations_list, "Loading Type & Quantity", !!val?.loadingtype_name ? `${val?.loadingtype_name}, ${val?.loadingtype_qty || 0} carton` : '');//Loading Type & Quantity
  }

  const handleProductSeleted = (value, init = false) => {
    const items = [
      {
        key: uuidv4(),
        label: 'Sample name',
        span: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 },
        children: value?.spcode,
      },
      {
        key: uuidv4(),
        label: 'SP No',
        span: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 },
        children: value?.spname,
      },
      {
        key: uuidv4(),
        label: 'EST Cost', 
        span: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 },
        children: value?.estcode,
      },
      {
        key: uuidv4(),
        label: 'Packing Set',
        span: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 },
        children: value?.packingset_name,
      },
      {
        key: uuidv4(),
        label: 'Ex-work cost',
        span: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 },
        children: formatCommaNumber( Number( value?.exworkcost_carton ||  0)),
      },
    ]; 
    setDescEstimationData( items );
    setFormData( s => ({...s, ...value}));
    updateForm(value, init);
  }

  const handleLoadingTypeSeleted = (value) => { 
    updateForm(value, false);
  }

  const handleShippingTypeSeleted = (value) => { 
    updateForm(value, false);
  }

  const handleMargin = (e) => {
    const { exworkcost_carton } = formData;

    const exworksell_price =  parseFloat( ( exworkcost_carton / ( 1 - ( Number( e || 0) / 100 ) )).toFixed(2) );

    const new_value = {...formData, exworksell_price, margin: e};
    updateForm( new_value, false );
  }

  const handleInsurance = (e) => {
    const new_value = {...formData, insurance: e};
    updateForm( new_value, false );
  }

  const handleCommission = (e) => {  
    const new_value = {...formData, commission: e};
    updateForm( new_value, false );
  }

  const handleQuantity = (e) => {  
    const new_value = {...formData, loadingtype_qty: e};
    updateForm( new_value, false );
  }

 
  // useEffect( () => {
  //   const initeial = async () => {
      
  //     form.setFieldsValue( formData );
  //   }
  //   // if( ship.length < 1 ){
  //   //   setInitForm( shipping_expense_defualt.map( item => ({ expense_name: item, price: 0  })) );
  //   // } 
    
  //   initeial();  
  //   return () => {}
  // }, [form, formData]);
 

  useEffect( () => {
    const initeail = () => {
      if(mode !== "create"){
        const { data } = config;
        handleProductSeleted( data, true );

        // console.log( list, source, config)
        form.setFieldsValue({...source});
      } else {
        form.setFieldsValue({ });
      }      
    }
    initeail();
    console.log(mode);
  },[source, mode, form, list, config]);

  const onFinish = (values) => {
    if( values.quotations_list.length < 1 ){
      message.error( "Product description is not empty." );
      throw new Error("Product description is not empty.");
    }
    const id = formData?.id || uuidv4();
    const total_amount = parseFloat(( Number( formData?.loadingtype_qty || 0 ) * Number( formData?.price_per_carton || 0 )).toFixed(2));
    const unit_carton = Number( formData.unit_carton || 0 );
    const qty = Number( formData.loadingtype_qty || 0 );
    confirm({...formData, ...values, id, total_amount, unit_carton, qty});
  };

  const ProductCalculate = (<>
    <Row gutter={[8,8]} className='m-0'>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Margin' name='margin' rules={[{ required: true, message: 'Missing Loading type', },]} >
            <InputNumber placeholder='Enter Margin' min={0} controls={false} className='w-full input-30' onChange={handleMargin} /> 
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Ex-Work Price' >
            <Input placeholder='Enter Margin for calculate Ex work price' controls={false} readOnly className='input-30'  value={formatCommaNumber( Number( formData?.exworksell_price || 0 ))} /> 
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item name='loadingtype_name' htmlFor="loadingtype_name-1" label='Loading Type' rules={[{ required: true, message: 'Missing Loading type', },]}> 
            <Space.Compact style={{ width: '100%' }}>
                <Input readOnly placeholder='Select Loading Type' id="loadingtype_name-1" value={formData.loadingtype_name} className='input-30 !bg-white' />
                <Button type="primary" className='bn-center' icon={<SearchOutlined />} onClick={() => setOpenLoadingType(true)} style={{minWidth:32}} ></Button>
            </Space.Compact>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Quantity' name="loadingtype_qty" className='!mb-1'> 
            <InputNumber placeholder='Select Loading Type for get quantity' className='w-full input-30' min={0} controls={false} onChange={handleQuantity} /> 
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item name='shippingtype_name' htmlFor="shipingtype_name-1" label='Shipping Type' rules={[{ required: true, message: 'Missing Shipping type', },]}> 
            <Space.Compact style={{ width: '100%' }}>
                <Input readOnly placeholder='Select Loading Type' id="shippingtype_name-1" value={formData.shippingtype_name} className='input-30 !bg-white' />
                <Button type="primary" className='bn-center' icon={<SearchOutlined />} onClick={() => setOpenShippingType(true)} style={{minWidth:32}} ></Button>
            </Space.Compact>
          </Form.Item>
        </Col> 
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Shipping Type expense price' className='!mb-1'> 
            <Input readOnly 
              placeholder='Select Shipping Type for get shipping type expense price' 
              value={formatCommaNumber( Number( formData?.shippingtype_price || 0 ))}  
              className='input-30' 
            /> 
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Insurance' name='insurance' rules={[{ required: true, message: 'Missing Loading type', },]} >
            <InputNumber placeholder='Enter Insurance' min={0} controls={false} className='w-full input-30' onChange={handleInsurance} /> 
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Commssion' name='commission' rules={[{ required: true, message: 'Missing Loading type', },]} >
            <InputNumber placeholder='Enter Commssion' min={0} controls={false} className='w-full input-30' onChange={handleCommission} suffix="%"  /> 
          </Form.Item>
        </Col>
    </Row> 
  </>);

  const ProductSummary = (<>
    <Row gutter={[8,8]} className='m-0'>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Currency' >
            <Typography.Text>{source?.currency}</Typography.Text>
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Ex-Work Price' >
            <Typography.Text>{source?.rate}</Typography.Text>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Price' >
            <Input readOnly placeholder='Select Loading Type for get quantity' value={formatCommaNumber( Number( formData?.price || 0 ))} className='input-30'/> 
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} >
          <Form.Item label='Price per carton' name='price_per_carton' rules={[{ required: true, message: 'Missing Loading type', },]} >
            <InputNumber placeholder='Enter Commssion' min={0} controls={false} className='w-full input-30'/> 
          </Form.Item>
        </Col>
    </Row> 
  </>);

  const ProductDescription = (<>
    <Row gutter={[8,8]} className='!mx-0 width-100' style={{
      padding: '12px',
      backgroundColor: '#6e6e71',
      borderRadius: 12,
      marginBottom:8,
    }}>
      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
        <Typography.Text className='text-white'>Title</Typography.Text>
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
        <Typography.Text className='text-white'>Desctiption</Typography.Text>
      </Col>

    </Row> 
    <Form.List name="quotations_list">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => {
          const readOnly = !!KEY_DEFAULT.includes(formData?.quotations_list[name]?.detail_name);
          return (
            <Flex key={key} align="baseline" className='width-100' gap={4} > 
              <Form.Item {...restField} name={[name, 'detail_name']} rules={[{ required: true, message: 'Missing Description Title', },]} className='w-full width-100' >
                <Input placeholder="Description Title" readOnly={readOnly} className='width-100 input-30' />
              </Form.Item>  
              <Form.Item {...restField} name={[name, 'detail_value']} rules={[{required: true, message: 'Missing Description',},]} className='w-full width-100' >
                <Input placeholder="Description" min={0} className='width-100 input-30' readOnly={readOnly}  />
              </Form.Item>
              <MinusCircleOutlined onClick={() => {
                setFormData( state => ({ ...state, quotations_list: state.quotations_list.filter( (_,i) => i !== name )  }));
                remove(name)
              }} />
            </Flex>
          )})}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />}>
              Add Description
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List> 
  </>)


  return (
    <>
      <div className='flex flex-col gap-y-4 quotation-manage-form'>
        <Form 
        form={form}
        name={formName}
        onFinish={onFinish}
        style={{ width: '100%', }} autoComplete="off"
        // initialValues={formData}  
        layout='vertical' >
          <Divider orientation="left" plain style={{margin:10}}> Product and Packing </Divider>
          <Card  style={{backgroundColor:'#f0f0f0' }} > 
            <Row gutter={[8,8]} className='m-0' align='middle' >
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <Typography.Title level={5} className='m-0 !text-zinc-400'>Please Select Product and Packing</Typography.Title>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <Flex justify='end'>
                  <Button className='bn-center' icon={<FaBoxesPacking />} onClick={()=> setOpenEstimation(true) } >Choose Product and Packing</Button> 
                </Flex>
              </Col>
            </Row>
          </Card>

          {descEstimationData.length > 0 && (<>
          <Divider orientation="left" plain style={{margin:10}}> Products Infomations </Divider>
          <Card  style={{backgroundColor:'#f0f0f0' }} >
              <Row gutter={[8,8]} className='m-0'>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
                    <Descriptions items={descEstimationData} size='small' column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }} colon={false} /> 
                  </Col>
              </Row>
          </Card>

          <Divider orientation="left" plain style={{margin:10}}> Products Calculate </Divider>
          <Space size='small' direction='vertical' className='flex gap-2'>
            <Card  style={{backgroundColor:'#f0f0f0' }} > 
              { ProductCalculate }
            </Card> 
            <Card  style={{backgroundColor:'#f0f0f0' }} > 
              { ProductSummary }
            </Card> 
            <Card  style={{backgroundColor:'#f0f0f0' }} > 
              { ProductDescription }
            </Card> 
          </Space>
          </>)}
        </Form>
        { openEstimation && <ModalEstimationPackingSet show={openEstimation} close={() => setOpenEstimation(false)} values={handleProductSeleted} checkdup={list.map(d => d?.estimation_detailid)} /> }

        { openShippingType && <ModalShippingType show={openShippingType} close={()=> setOpenShippingType(false)} values={handleShippingTypeSeleted} />}

        { openLoadingType && <ModalLoadingType show={openLoadingType} close={()=> setOpenLoadingType(false)} values={handleLoadingTypeSeleted} packingset={formData.packingsetid} />}
      </div>  
    </> 
  )
}

export default QuotationManageForm