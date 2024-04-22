/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Card, Form, Drawer, message } from "antd";
import { Row, Col, Space, Table } from "antd";
import { Input, DatePicker, Button } from "antd"; 

import { SearchOutlined, InboxOutlined, ArrowLeftOutlined, PlusCircleOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";
 
import { srmaster, columnSampleEditable, componentsEditable } from "./sample-request.model"
// import { formatCommaNumber } from "../../utils/util";

import { FileControl } from "../file-control/file-control";
import { ModalCustomers } from "../../components/modal/customers/modal-customers";
import { ModalPackagingSingle } from "../../components/modal/packaging/modal-packaging";

import SRService from "../../service/SRService";
import dayjs from 'dayjs';

import { useLoadingContext } from "../../store/context/loading-context";

// const TextArea = Input.TextArea;
const refs = "Sample Request";
export default function SampleRequestForm( ) {
    const navigate = useNavigate();
    const location = useLocation(); 

    const { startLoading, stopLoading } = useLoadingContext();

    const { config } = location.state || {config:null};
    const [form] = Form.useForm();
    
    const [samples, setSamples] = useState([]);

    const [isOpenModalCustomer, setIsOpenModalCustomer] = useState(false);
    const [isOpenModalPackage, setIsOpenModalPackage] = useState(false);

    const [modalPackageValue, setModalPackageValue] = useState({});

    const [isOpenUpload, setIsOpenUpload] = useState(false); 
 
    const [formDetail, setFormDetail] = useState(srmaster);
    
    const [submited, setSubmited] = useState(false);
    const [refcode, setRefcode] = useState(null);

    // const [isOpenModal, setOpenModal] = useState(show); 

    const hendleClose = () => { 
        setTimeout( ()=> navigate("/sample-request", {replace:true}), 400 );
    }

    const gettingSrCode = () => {
        startLoading();
        SRService.get_srcode().then( async (res) => {
            const code = res.data.data;
            const year = dayjs().format("YY");
            const mon = dayjs().format("MM");
            setRefcode(`SR${year}${mon}${code}`);
            const initialValues = { ...srmaster, srcode:`SR${year}${mon}${code}`, srdate:dayjs() };

            setFormDetail(initialValues);
            form.setFieldsValue(initialValues);
            stopLoading();
        })
        .catch( err => {
            console.warn(err);
            const {message} = err.response;
            message.error( message || "error request");
            stopLoading();
        });
    }

    const gettingSampleRequestData = () => {
        startLoading();
        SRService.get(config?.code).then( async (res) => {
            const {detail, master} = res.data.data;
            const initialValues = { ...srmaster, ...master };
            initialValues.srdate  = dayjs(initialValues.srdate);
            initialValues.duedate  = dayjs(initialValues.duedate);
            setRefcode(initialValues.srcode);
            setFormDetail(initialValues);
            form.setFieldsValue(initialValues);  

            setSamples(detail);
            stopLoading();
        })
        .catch( err => {
            // console.warn(err);
            const {data} = err.response;
            message.error( data?.message || "error request");
            stopLoading();
        });
    } 

    useEffect( ()=>{
        if(!config) { 
            hendleClose();
            return;
        }

        if(config?.action !== "create"){
            gettingSampleRequestData();
        }else{
            gettingSrCode();
        }

        return () => { }
        
    }, []);
    


    const handleConfirm = () => {
        setSubmited(true);
        const sampleValidate = (submited && (samples.length < 1 || !!samples.find( d => !d.spname)));
        if( sampleValidate ){
            message.warning("Warning: Please Add Sample Name");
            return;
        }
        form.validateFields().then( value => {
            startLoading();
            const master = value;
            const detail = samples;
            master.srdate = dayjs(master.srdate).format("YYYY-MM-DD");
            master.duedate = dayjs(master.duedate).format("YYYY-MM-DD");
            if(config.action === "create"){
                SRService.create( {master, detail} ).then( res => { 
                    message.success("Success: Create sample requerest done.");
                    
                    stopLoading();
                    hendleClose();
                })
                .catch( err =>  {
                    message.error("Error: Create sample requerest fail.");
                    stopLoading();
                });         
            } else {
                SRService.update( {master, detail} ).then( res => { 
                    message.success("Success: Update sample requerest done.");
                    stopLoading();
                    hendleClose();
                })
                .catch( err =>  {
                    message.error("Error: Update sample requerest fail.");
                    stopLoading();
                });
            } 
        })

    }


    const handleChoosedCustomer = (value) => {
        const f = form.getFieldValue();
        const initialValues = { ...f, ...value};
        form.setFieldsValue(initialValues);
        setFormDetail(initialValues); 
    }; 

    const handleChoosedPacking = (value) => {
        const newData = {...modalPackageValue, pkname : value.pkname, pkcode: value.expscode }; 

        // console.log(newData, value);
        handleSave(newData);
    } 

    const handleSave = (row) => { 
        const newData = (r) => { 
            const newData = [...samples];
            
            const ind = newData.findIndex( (item) => row.seq === item?.seq );
            const item = newData[ind];
            
            newData.splice(ind, 1, {
                ...item,
                ...row,
            });
            return newData;
        } 
        setSamples([...newData()]);
    };

    const handleModalSelect = (e, row) => {
        setIsOpenModalPackage(true);
        setModalPackageValue(row);
    }

    const handleDelete = (code, seq) => { 
        const newData = samples.filter((val) => val?.seq !== seq ).map( (m, i) => ({...m, seq:i+1 }));
        setSamples([...newData]);
    };

    const handleAction = (record) => { 
        return samples.length >= 1 ? (
          <Button
            className="bt-icon"
            size='small'
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record?.paraname, record.seq)} 
          />
        ) : null
    }
    
    const handleAddSample = () => {
        setSamples([...samples, {
            seq:samples.length + 1,
            spname:null,
            pkname:null,
            amount:null,
        }]);
    }

    const sample_column = columnSampleEditable(handleSave, handleModalSelect, {handleAction});
    /** settimg child component */
    const ButtonActionSrDetailLeft = (
        <Space gap="small" align="center" style={{display:"flex", justifyContent:"start"}} > 
            <Button style={{ width: 120 }} icon={ <ArrowLeftOutlined /> } onClick={ () => { hendleClose(); } } >
                กลับ
            </Button>
        </Space>
    );

    const ButtonActionSrDetailRight = (
        <Space gap="small" align="center" style={{display:"flex", justifyContent:"end"}} > 
            <Button style={{ width: 120 }} type="primary" icon={ <InboxOutlined /> } onClick={ () => { setIsOpenUpload(true)} } >
                อัพโหลด
            </Button>
        </Space>
    );

    return (
    <> 
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative', paddingInline:"1.34rem" }} className='sample-request-modal' >
            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                <Col span={12} style={{paddingInline:'0px'}}>{ ButtonActionSrDetailLeft }</Col>
                <Col span={12} style={{paddingInline:'0px'}}>{ ButtonActionSrDetailRight }</Col>
            </Row>            
            <Card>
                <Form form={form} layout="vertical" autoComplete="off" >
                    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                            <Form.Item label="Sample Request No :" name="srcode" rules={[ { required: true, message: "Please input your data!", } ]} >
                                <Input readOnly placeholder='Sample No' />
                            </Form.Item>                        
                        </Col>                        
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Sample Request Date :" name="srdate" rules={[ { required: true, message: "Please input your data!", } ]}>
                                <DatePicker size="large" style={{ width: "100%", }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={4} xl={3}> 
                            <Form.Item label="รหัสลูกค้า :" name="cuscode" rules={[ { required: true, message: "Please choose data!", } ]} >
                                <Input readOnly placeholder='รหัสลูกค้า' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={20} lg={8} xl={9}>
                            <Form.Item label="ชื่อลูกค้า :" name="cusname"  rules={[ { required: true, message: "Please choose data!", } ]} >
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input readOnly placeholder='ชื่อลูกค้า' value={formDetail.cusname}  />
                                    <Button type="primary" icon={<SearchOutlined />} onClick={() => setIsOpenModalCustomer(true)} style={{minWidth:40}} ></Button>
                                </Space.Compact> 
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Form.Item label="Due Date :" name="duedate" rules={[ { required: true, message: "Please input your data!", } ]}>
                                <DatePicker size="large" style={{ width: "100%", }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                            <Form.Item label="Description :" name="description" >
                                <Input.TextArea placeholder='Description' rows={5} />
                            </Form.Item>                        
                        </Col> 
                    </Row>  
                </Form>
            </Card> 
            <Card>
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} className='sample-request-modal' >
                    {submited && !!samples.find( d => !d.spname)}
                    <Table 
                        className={`table-require ${(submited && (samples.length < 1 || !!samples.find( d => !d.spname))) ? 'table-invalid' : ''}`}
                        components={componentsEditable}
                        rowClassName={() => "editable-row"}
                        bordered
                        dataSource={samples || []}
                        columns={sample_column}
                        pagination={false}
                        rowKey="seq"
                        locale = {{ emptyText: <span>No data available, please add some data.</span> }}
                        scroll={{ x: '100%' }} size='small'
                        summary={(val)=>(
                        <> 
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={1} colSpan={5}>
                                    <Row> 
                                        <Col span={24} style={{display:'flex', justifyContent:'center'}} className='width-100 append-step' >
                                            <Button 
                                                shape="circle" icon={<PlusCircleOutlined />} 
                                                style={{width:'2.5rem', boxShadow:'none', lineHeight: '2.5rem'}} 
                                                onClick={()=>{ handleAddSample() }}  
                                            ></Button>
                                        </Col>
                                    </Row>                    
                                </Table.Summary.Cell> 
                            </Table.Summary.Row>
                        </>
                        )}
                    />
                </Space> 
            </Card>

            <Row> 
                <Col span={12} style={{display:'flex', justifyContent:'start'}} >
                    {ButtonActionSrDetailLeft}
                </Col>
                <Col span={12} style={{display:'flex', justifyContent:'end'}} >
                    <Button 
                        icon={<SaveOutlined style={{fontSize:'1rem'}} />} 
                        type='primary' style={{ width:'9.5rem' }} 
                        onClick={()=>{ handleConfirm() }} 
                        disabled={ !samples.find( d => d.spname?.length > 0 ) }
                    >ยืนยันบันทึก</Button>
                </Col>
            </Row>
        </Space> 
        
        <Drawer title="Upload" placement="right" size="large" open={isOpenUpload} onClose={()=>{ setIsOpenUpload(false) }} > 
            { isOpenUpload && (<FileControl title={`แนบไฟล์ สำหรับ Code : `} refcode = {refcode} refs={refs} noExpire={true} />)} 
        </Drawer>
  
        { isOpenModalCustomer && (
            <ModalCustomers show={isOpenModalCustomer} close={() => { setIsOpenModalCustomer(false) }} values={(v)=>{handleChoosedCustomer(v)}} ></ModalCustomers>
        )}
  
        { isOpenModalPackage && (
            <ModalPackagingSingle show={isOpenModalPackage} close={() => { setIsOpenModalPackage(false) }} values={(v)=>{handleChoosedPacking(v)}} ></ModalPackagingSingle>
        )}
    </>)
}
