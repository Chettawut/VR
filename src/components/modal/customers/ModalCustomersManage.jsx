/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Button, Flex, message, AutoComplete, Radio } from "antd";
import { Row, Col, Space } from "antd";

import { SaveFilled } from  "@ant-design/icons";

import { customers } from '../../../pages/customers/customers.model.js';  
// import { delay } from '../../../utils/util';
// import OptionService from '../../service/Options.service';
import CustomerService from '../../../service/CustomerService.js'; 
import OptionService from '../../../service/Options.service';
import { CreateInput } from 'thai-address-autocomplete-react';


const InputThaiAddress = CreateInput();
const ctmService = {...CustomerService};
const opservice = OptionService();
// const opservice = OptionService();

const THAICOUNTRY = "ไทย";
const ModalCustomersManage = ({submit}) => { 
    const [form] = Form.useForm();
    
    const [formDetail, setFormDetail] = useState(customers);
    
    const [countriesOption, setCountriesOption] = useState([]); 
    const [countries, setCountries] = useState(null);
    const [deliveryCountries, setDeliveryCountries] = useState(null);

    // const [packageTypeOption, setPackageTypeOption] = useState([]); 
    const init = async () => {  
        const cuscodeRes = await ctmService.getCuscode().catch( () => message.error("Initail failed"));

        const { data:cuscode } = cuscodeRes.data;
        const initForm = {...formDetail, cuscode};
        setFormDetail( state => ({...state, ...initForm}));
        form.setFieldsValue(initForm);

        const [
            countryOptionRes,
        ] = await Promise.all([
            opservice.optionsCountries(),
        ]);  
        const { data:op } = countryOptionRes.data;  
        setCountriesOption( op );
    }
 
    useEffect( ()=>{   
        init(); 
        return () => {}
    }, []); 
 
    const handleSelect = (address) => {
        const f = form.getFieldsValue();
        const addr = {
            ...f, 
            province: `จ.${address.province}`,
            zipcode: `${address.zipcode}`,
            subdistrict: `ต.${address.district}`,
            district: `อ.${address.amphoe}`,
        }
        setFormDetail(addr);
        form.setFieldsValue(addr);
    };
 
    const handleDeliverySelect = (address) => {
        const f = form.getFieldsValue();
        const addr = {
            ...f,  
            delprovince: `จ.${address.province}`,
            delzipcode: `${address.zipcode}`,
            delsubdistrict: `ต.${address.district}`,
            deldistrict: `อ.${address.amphoe}`,
        }
        setFormDetail(addr);
        form.setFieldsValue(addr);
    };

    const handleConfirm = () => {
        form.validateFields().then(  (v) => {
            const source = {...formDetail, ...v}; 
            submit( source );
        })
    } 

    const Detail = () => (
        <Row gutter={[8,8]} className='px-2 sm:px-4 md:px-4 lg:px-4'>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} >
                <Form.Item label='Customer Code' name='cuscode' rules={[ { required: true, message: "Please enter data!", } ]}>
                    <Input placeholder='Enter Customer Code.' className='!bg-zinc-300' readOnly />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16} >
                <Form.Item label='Customer Name' name='cusname' rules={[ { required: true, message: "Please enter data!", } ]}>
                    <Input placeholder='Enter Customer Name.' />
                </Form.Item> 
            </Col> 
            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8} >
                <Form.Item label='สถานะ' name='status'>
                    <Radio.Group  buttonStyle="solid" >
                        <Radio.Button value="Y">Enable</Radio.Button>
                        <Radio.Button value="N">Disable</Radio.Button> 
                    </Radio.Group>
                </Form.Item> 
            </Col> 
            <Col xs={24} sm={24} md={12} lg={16} xl={16} xxl={16} >
                <Form.Item label='เลขที่ผู้เสียภาษี' name='taxnumber'>
                    <Input placeholder='Enter Tax Number.' />
                </Form.Item> 
            </Col> 
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
                <Form.Item label='Express Code' name='express_code' rules={[ { required: true, message: "Please enter data!", } ]}>
                    <Input placeholder='Enter Express Code.' />
                </Form.Item> 
            </Col>         
        </Row>
    );

    const AddressDetail = () => (
        <Row gutter={[8,8]} className='px-2 sm:px-4 md:px-4 lg:px-4'>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
                <Form.Item label='เลขที่' name='idno' >
                  <Input placeholder='Enter Address No.' />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='ถนน' name='road' >
                  <Input placeholder='Enter Address No.' />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='ประเทศ' name='country' rules={[ { required: true, message: "Please enter data!", } ]} > 
                    <AutoComplete
                        options={countriesOption}
                        style={{ height: 40,}}
                        placeholder="Enter Country."
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onSelect={(value) => setCountries(value)}
                        onBlur={(e) => { setCountries(e.target.value) }}
                    />                  
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='ตำบล' name='subdistrict' >
                {
                  countries === THAICOUNTRY 
                  ? <InputThaiAddress.District onSelect={handleSelect} style={{height:40}} autoCompleteProps={{placeholder:"Enter Sub District"}}  />
                  : <Input placeholder="Enter Sub District" />
                } 
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='อำเภอ' name='district'  >
                {
                    countries === THAICOUNTRY 
                    ? <InputThaiAddress.Amphoe onSelect={handleSelect} style={{height:40}} autoCompleteProps={{placeholder:"Enter District"}} />
                    : <Input placeholder="Enter District" />                        
                } 
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='จังหวัด' name='province' >
                {
                    countries === THAICOUNTRY 
                    ? <InputThaiAddress.Province onSelect={handleSelect} style={{height:40}} autoCompleteProps={{placeholder:"Enter Province"}} />
                    : <Input placeholder="Enter Province" />                        
                }  
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='รหัสไปรษณีย์' name='zipcode'  >
                {
                    countries === THAICOUNTRY 
                    ? <InputThaiAddress.Zipcode onSelect={handleSelect} style={{height:40}} autoCompleteProps={{placeholder:"Enter Zipcode"}} />
                    : <Input placeholder="Enter Zipcode" />                        
                }
                </Form.Item>
            </Col>
        </Row>
    );  

    const DeliveryAddressDetail = () => (
        <Row gutter={[8,8]} className='px-2 sm:px-4 md:px-4 lg:px-4'>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
                <Form.Item label='เลขที่' name='delidno' >
                  <Input placeholder='Enter Address No.' />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='ถนน' name='delroad' >
                  <Input placeholder='Enter Address No.' />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='ประเทศ' name='delcountry' > 
                    <AutoComplete
                        options={countriesOption}
                        style={{ height: 40 }}
                        placeholder="Enter Country."
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onSelect={(value) => setDeliveryCountries(value)}
                        onBlur={(e) => { setDeliveryCountries(e.target.value) }}
                    />                  
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='ตำบล' name='delsubdistrict' >
                {
                  deliveryCountries === THAICOUNTRY 
                  ? <InputThaiAddress.District onSelect={handleDeliverySelect} style={{height:40}} autoCompleteProps={{placeholder:"Enter Sub District"}}  />
                  : <Input placeholder="Enter Sub District" />
                } 
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='อำเภอ' name='deldistrict'  >
                {
                    deliveryCountries === THAICOUNTRY 
                    ? <InputThaiAddress.Amphoe onSelect={handleDeliverySelect} style={{height:40}} autoCompleteProps={{placeholder:"Enter District"}} />
                    : <Input placeholder="Enter District" />                        
                } 
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='จังหวัด' name='delprovince' >
                {
                    deliveryCountries === THAICOUNTRY 
                    ? <InputThaiAddress.Province onSelect={handleDeliverySelect} style={{height:40}} autoCompleteProps={{placeholder:"Enter Province"}} />
                    : <Input placeholder="Enter Province" />                        
                }  
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='รหัสไปรษณีย์' name='delzipcode'  >
                {
                    deliveryCountries === THAICOUNTRY 
                    ? <InputThaiAddress.Zipcode onSelect={handleDeliverySelect} style={{height:40}} autoCompleteProps={{placeholder:"Enter Zipcode"}} />
                    : <Input placeholder="Enter Zipcode" />                        
                }
                </Form.Item>
            </Col>
        </Row>
    );  

    const ContactDetail = () => (
        <Row gutter={[8,8]} className='px-2 sm:px-4 md:px-4 lg:px-4'>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='ติดต่อ' name='contact' >
                  <Input placeholder='Enter Contact.' />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='อีเมล' name='email' >
                  <Input placeholder='Enter Email.' />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='เบอร์โทรศัพท์' name='tel'  >
                  <Input placeholder='Enter Tel Number.'  />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} >
                <Form.Item label='เบอร์แฟ็ค' name='fax'  >
                  <Input placeholder='Enter Fax Number.' />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
                <Form.Item label='หมายเหตุ' name='remark'  >
                  <Input.TextArea placeholder='Enter Remark.' rows={4} />
                </Form.Item>
            </Col>
        </Row>
    ); 

    const SectionBottom = (
        <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start'>
                    {/* <ButtonBack target={from} /> */}
                </Flex>
            </Col>
            <Col span={12} style={{paddingInline:0}}>
                <Flex gap={4} justify='end'>
                    <Button 
                    icon={<SaveFilled style={{fontSize:'1rem'}} />} 
                    type='primary' style={{ width:'9.5rem' }} 
                    onClick={()=>{ handleConfirm() }} 
                    >Save</Button>
                </Flex>
            </Col>
        </Row>         
    );


    return (
        <div className='customer-manage xs:px-0 sm:px-0 md:px-8 lg:px-8'>
            <Space direction='vertical' className='flex gap-2' >
                <Form form={form} layout="vertical" autoComplete="off" >
                    <Divider orientation="left" plain style={{margin:10}}> Information Detail </Divider>
                    <Detail />

                    <Divider orientation="left" plain style={{margin:10}}> Address Detail</Divider>
                    <AddressDetail />

                    <Divider orientation="left" plain style={{margin:10}}> Delivery Address Detail</Divider>
                    <DeliveryAddressDetail />
                    
                    <Divider orientation="left" plain style={{margin:10}}> Contact Detail</Divider>
                    <ContactDetail />
                </Form>
                {SectionBottom}           
            </Space>
        </div>
    );
}

export default ModalCustomersManage;
