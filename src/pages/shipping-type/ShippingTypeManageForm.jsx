import React, { useEffect, useState } from 'react';
import { MinusCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, InputNumber, Card, Row, Col, Divider, AutoComplete, Flex, Typography } from 'antd';
 
import OptionService from '../../service/Options.service.js';

const shippingtype_defualt = ["FCL-with pallet", "FCL-loose load", "LCL-1pallets", "LCL-2pallets", "LCL-3pallets", "LCL-4pallets", "truck 4 wheels"];
const opservice = OptionService();
const limitOption = 5;
function ShippingTypeManageForm({ confirm, load, ship, mode }) {
  const [form] = Form.useForm();
 
  const [shippingTypeOption, setShippingTypeOption] = useState([]);
  const [shippingTypeOptionWrap, setShippingTypeOptionWrap] = useState([]);

  // const [formData, setFormData] = useState({});
 
  useEffect( () => {
    const initeial = async () => {
      const [
        shippingTypeRes, 
      ] = await Promise.all([ 
          opservice.optionsShippingType({p:"shipping-type-name"}),
      ]); 
      const {data:shippingTypeOption} = shippingTypeRes.data;
      const opn_shippingType = [...new Set( [...shippingtype_defualt, ...( shippingTypeOption?.map( val => val?.value ) )] ) ];

      const opnLtd = opn_shippingType.map( v => ({value:v}));
      setShippingTypeOption( opnLtd );
 
  }
    // if( ship.length < 1 ){
    //   setInitForm( shipping_expense_defualt.map( item => ({ expense_name: item, price: 0  })) );
    // } 
    
    initeial();  
  }, []);

  useEffect( () => {
    if(mode !== "create"){
      form.setFieldsValue({
        ...load,
        shipping_terms:ship
      });
    }else{
      form.setFieldsValue({ 
        shipping_terms:ship
      });      
    }
  },[load, ship, mode, form])

  const onFinish = (values) => {
    const { shippingtype_name, qty, remark, shipping_terms } = values;
    confirm({
      shippingtype : { shippingtype_name, qty, remark },
      shipping: shipping_terms
    });
  };

  const handleSearch = (searchText) => {
    // Your logic to filter dataSource based on the searchText
    const filteredData = shippingTypeOption
      .filter(item => {
          //item?.toLowerCase().includes(searchText.toLowerCase())
          const { value } = item;
          return value?.toLowerCase().includes(searchText.toLowerCase());
      })
      .slice(0, limitOption); // Limiting to the first 5 options
      setShippingTypeOptionWrap(filteredData);
  };

  return (
    <div className='flex flex-col gap-y-4'>
      <Form 
      form={form}
      name="shippingtype-form" 
      onFinish={onFinish} 
      style={{ width: '100%', }} autoComplete="off" 
      // initialValues={formData} 
      layout='vertical' >
        <Divider orientation="left" plain style={{margin:10}}> Shipping Type </Divider>
        <Card  style={{backgroundColor:'#f0f0f0' }} > 
          <Row gutter={[8,8]} className='m-0'>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
              <Form.Item className='' name='shippingtype_name' label='Shipping type Name' rules={[{ required: true, message: 'Missing Shipping type', },]} >
                {/* <Input placeholder='Enter Loading type Name.' /> */}
                <AutoComplete 
                  style={{ height:42, width:'100%' }}
                  options={shippingTypeOptionWrap}
                  onSearch={handleSearch}
                  filterOption={(inputValue, option) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  allowClear 
                  placeholder='Enter Shipping type Name.'
                />                
              </Form.Item>
            </Col>
            {/* <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
              <Form.Item className='' name='qty' label='Quantity' rules={[{ required: true, message: 'Missing Quantity', },]} >
                <InputNumber placeholder='Enter Quantity (Baht)' controls={false} min={0} className='width-100 input-40'  />
              </Form.Item>
            </Col> */}
          </Row>
        </Card>
        <Divider orientation="left" plain style={{margin:10}}> Shipping expense </Divider>
        <Card  style={{backgroundColor:'#f0f0f0' }} >
          <Row gutter={[8,8]} className='mx-0 width-100' style={{
            padding: '12px',
            backgroundColor: '#6e6e71',
            borderRadius: 12,
            marginBottom:8,
          }}>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
              <Typography.Text className='text-white'>Shipping expense</Typography.Text>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
              <Typography.Text className='text-white'>Price (Baht)</Typography.Text>
            </Col>
          </Row> 
          <Form.List name="shipping_terms">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                return (
                  <Flex key={key} align="baseline" className='width-100' gap={4} > 
                    <Form.Item {...restField} name={[name, 'expense_name']} rules={[{ required: true, message: 'Missing Shipping expense', },]} className='w-full width-100' >
                      <Input placeholder="Shipping expense" />
                    </Form.Item>  
                    <Form.Item {...restField} name={[name, 'price']} rules={[{required: true, message: 'Missing Shipping expense price',},]} className='w-full width-100' >
                      <InputNumber placeholder="Shipping expense Price" controls={false} min={0} className='width-100 input-40'  />
                    </Form.Item> 
                    <MinusCircleTwoTone onClick={() => remove(name)} />
                  </Flex>
                )})}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
        <Divider orientation="left" plain style={{margin:10}}> Other </Divider>
        <Card  style={{backgroundColor:'#f0f0f0' }} > 
          <Row gutter={[8,8]} className='m-0'>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
              <Form.Item className='' name='remark' label='Remark' >
                <Input.TextArea placeholder='Enter Remark' rows={4}  />
              </Form.Item>
            </Col>
          </Row>
        </Card>        
      </Form>
    </div>
  )
}

export default ShippingTypeManageForm