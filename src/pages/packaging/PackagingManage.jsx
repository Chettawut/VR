/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Collapse, Form, Input, InputNumber, Button, Flex, message } from "antd";
import { Row, Col, Space } from "antd";

import { CaretRightOutlined, SaveFilled, SearchOutlined } from  "@ant-design/icons";

import { ButtonBack, ButtonUpload } from '../../components/button';
import ModalPackagingType from '../../components/modal/packaging/ModalPackagingType';
import ModalSupplier from '../../components/modal/supplier/ModalSupplier';
import ModalUnit from '../../components/modal/unit/ModalUnit';

import { pkmaster } from './packaging.model';
import PackagingService from '../../service/Packaging.service';
import { useLocation, useNavigate } from 'react-router';
import { delay } from '../../utils/util';
// import OptionService from '../../service/Options.service';

const pkservice = PackagingService();
// const opservice = OptionService();
const PackagingManage = () => {
    const navigate = useNavigate(); 
    const location = useLocation();
    
    const { config } = location.state || {config:null};
    const [form] = Form.useForm();
    
    const [formDetail, setFormDetail] = useState(pkmaster);

    const [openModalPackagingType, setOpenModalPackgingType] = useState(false);
    const [openModalSupplier, setOpenModalSupplier] = useState(false);

    const [openModalUnit, setOpenModalUnit] = useState(false);
    // const [packageTypeOption, setPackageTypeOption] = useState([]);
    const [code,  setCode] = useState(null);
    const init = async () => {
        
        if(config?.action !== "create"){
            pkservice.get(config?.code).then( async (res) => {
                const {data:detail} = res.data;
                const initialValues = { ...pkmaster, ...detail };
                initialValues.lost  = initialValues.lost * 100;
                const { pkcode } = detail; 
                setCode( pkcode );
                setFormDetail(initialValues);
                form.setFieldsValue(initialValues);
            })
            .catch( err => {
                // console.warn(err);
                const {data} = err.response;
                message.error( data?.message || "error request"); 
            });
        }else{ 
            setFormDetail(pkmaster);
            form.setFieldsValue(pkmaster);
        }
    }
 
    useEffect( ()=>{   
        init();

        return () => {}
    }, []);

    const handleChoosedPackagingType = (v) => {
        const f = form.getFieldsValue();
        const val = {...formDetail, ...f, pktypeid: v.id, pktype: v.pktype };
        
        setFormDetail(val);

        form.setFieldsValue( val );
    }

    const handleChoosedSupplier = (v) => {
        const f = form.getFieldsValue();
        const val = {...formDetail, ...f, supcode: v.supcode, supname: v.supname };
        setFormDetail(val);

        form.setFieldsValue( val );
    }

    const handleChoosedUnit = (v) => {
        const f = form.getFieldsValue();
        const val = {...formDetail, ...f, unitid: v.unitcode, unit: v.unit };
        setFormDetail(val);

        form.setFieldsValue( val );
    }

    const handleConfirm = () => {
        form.validateFields().then(  (v) => {
            const source = {...formDetail, ...v, lost:Number(v.lost)/100};
            const cost = ( Number(source.price) + Number(source.transport) ) / (1 - (source.lost) );
            const parm = { ...source, cost };
            const actions = config?.action !== "create" ? pkservice.update( parm ) : pkservice.create( parm );
            // console.log(parm)

            actions.then( async(r) => {
                const { pkcode } = r.data; 
                setCode( pkcode );
                message.success("Request success.");

                navigate("/packaging", {replace:true});
                await delay(300);
                console.clear();
            })
            .catch( err => {
                console.warn(err);
                const data = err?.response?.data;
                message.error( data?.message || "error request");
            });
        })
    }

    const panelStyle = {
    //   marginBottom: 24,
      borderRadius: 6,
      border: '1px solid #d9d9d9',
    //   backgroundColor: '#fff', 
    };

    const Detail = () => (
        <Row gutter={[8,8]} className='px-2 sm:px-4 md:px-4 lg:px-4'>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Packaging Name' name='pkname' rules={[ { required: true, message: "Please enter data!", } ]}>
                    <Input placeholder='Enter Packaging Name.' />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Packaging Name (TH)' name='pknameTH'>
                    <Input placeholder='Enter Packaging Name(TH).' />
                </Form.Item> 
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Express Code' name='expscode' >
                    <Input placeholder='Enter Express Code.' />
                </Form.Item>
            </Col>  
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Express Name' name='expsname'>
                    <Input placeholder='Enter Express Name.' />
                </Form.Item> 
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Dimension' name='dimension'>
                    <Input placeholder='Enter Dimension.' />
                </Form.Item> 
            </Col>            
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Package Type.' > 
                    <Space.Compact style={{ width: '100%' }}>
                        <Input readOnly placeholder='Choose Package Type.' value={ !!formDetail.pktypeid ? formDetail.pktype : ""}  />
                        <Button 
                            type="primary" 
                            className='bn-primary' 
                            icon={<SearchOutlined />} 
                            style={{minWidth:40}} 
                            onClick={()=>setOpenModalPackgingType(true)} 
                        ></Button>
                    </Space.Compact> 
                </Form.Item>  
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Wt/Unit.' name='weight_unit'>
                    <InputNumber 
                    min={0} placeholder='Enter Wt/Unit.'
                    style={{ width: '100%', height: '40px' }} 
                    className='input-40' 
                    controls={false} 
                    />
                </Form.Item>  
            </Col>            
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Lost.' name='lost'>
                    <InputNumber 
                    min={0} placeholder='Enter Lost.' 
                    addonAfter='%' 
                    style={{ width: '100%', height: '40px' }} 
                    className='input-40' 
                    controls={false} 
                    />
                </Form.Item>  
            </Col>
        </Row>
    );

    const Supplier = () => (
        <Row gutter={[8,8]} className='px-2 sm:px-4 md:px-4 lg:px-4'>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Supplier Name' name='supcode'  >
                    <Input readOnly placeholder='Choose Supplier.' value={ !!formDetail.supcode ? `${formDetail.supcode}` : ""} />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Supplier Name' >
                    <Space.Compact style={{ width: '100%' }}>
                        <Input readOnly placeholder='Choose Supplier.' value={ !!formDetail.supcode ? `${formDetail.supname}` : ""}  />
                        <Button 
                            type="primary" 
                            className='bn-primary' 
                            icon={<SearchOutlined />} 
                            style={{minWidth:40}}
                            onClick={()=>setOpenModalSupplier(true)}
                        ></Button>
                    </Space.Compact>
                </Form.Item>
            </Col> 
        </Row>
    ); 

    const Price = () => (
        <Row gutter={[8,8]} className='px-2 sm:px-4 md:px-4 lg:px-4'>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Price' name='price' rules={[ { required: true, message: "Please enter data!", } ]}>
                    <InputNumber min={0} placeholder='Enter Price.' style={{ width: '100%', height: '40px' }} className='input-40' controls={false} />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Unit' >
                    <Space.Compact style={{ width: '100%' }}>
                        <Input readOnly placeholder='Choose Unit.' value={ !!formDetail.unitid ? `${formDetail.unit}` : ""}  />
                        <Button 
                            type="primary" 
                            className='bn-primary' 
                            icon={<SearchOutlined />} 
                            style={{minWidth:40}}
                            onClick={()=>setOpenModalUnit(true)}
                        ></Button>
                    </Space.Compact>
                </Form.Item>
            </Col>            
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                <Form.Item label='Transport' name='transport'>
                    <InputNumber min={0} placeholder='Enter Transport.' style={{ width: '100%', height: '40px' }} className='input-40' controls={false} />
                </Form.Item> 
            </Col>
        </Row>
    );

    const Other = () => (
        <Row gutter={[8,8]} className='px-2 sm:px-4 md:px-4 lg:px-4'>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
                <Form.Item label='Remark' name='remark' >
                    <Input.TextArea placeholder='Enter Remark.'  rows={5} />
                </Form.Item>
            </Col> 
        </Row>
    );

    const getItems = ( style )=>{
        return [
            {
              key: '1',
              label: 'Detail',
              children: <>{<Detail />}</>,
              style: style,
            },
            {
              key: '2',
              label: 'Price/Cost',
              children: <>{<Price />}</>,
              style: style,
            },
            {
              key: '3',
              label: 'Supplier',
              children: <>{<Supplier />}</>,
              style: style,
            },
            {
              key: '4',
              label: 'Other',
              children: <>{<Other />}</>,
              style: style,
            },
        ]
    };

    const SectionTop = (
        <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start'>
                    <ButtonBack target="/packaging" />

                </Flex>
            </Col>
            <Col span={12} style={{paddingInline:0}}>  
                <Flex gap={4} justify='end'>
                    { !!code && <ButtonUpload code={code} refer='Packaging' showExpire={true} /> }

                </Flex>  
            </Col>
        </Row>         
    );

    const SectionBottom = (
        <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start'>
                    <ButtonBack target="/packaging" />
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
        <div className='packaging-manage xs:px-0 sm:px-0 md:px-8 lg:px-8'>
            <Space direction='vertical' className='flex gap-2' >
                {SectionTop}
                <Form form={form} layout="vertical" autoComplete="off" >
                    <Collapse
                    bordered={false}
                    defaultActiveKey={['1','2', '3', '4']}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    style={{backgroundColor:'#ffffff00'}}
                    items={getItems(panelStyle)}
                    />                 
                </Form>
                {SectionBottom}           
            </Space>
            
            { openModalPackagingType && 
                <ModalPackagingType show={openModalPackagingType} close={() => { setOpenModalPackgingType(false) }} values={(v)=>{handleChoosedPackagingType(v)}} /> 
            }
            
            { openModalSupplier && 
                <ModalSupplier show={openModalSupplier} close={() => { setOpenModalSupplier(false) }} values={(v)=>{handleChoosedSupplier(v)}} /> 
            }

            {openModalUnit && 
                <ModalUnit show={openModalUnit} close={() => { setOpenModalUnit(false) }} values={(v)=>{handleChoosedUnit(v)}} /> 
            }
        </div>
    );
}

export default PackagingManage;
