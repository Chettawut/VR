/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';

import { Modal, Card, Table, message, Form, Drawer } from "antd";
import { Row, Col, Space, Spin } from "antd";
import { Input, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from 'antd/es/form/Form';

import { ModalSupplierManage } from "./modal-supplier.js";
import { columns } from "./modal-supplier.model"; 
import SupplierService from '../../../service/SupplierService'; 
import OptionService from '../../../service/Options.service'; 
import { capitalized } from '../../../utils/util.js';
 
const optionService = OptionService();
const spiService = {...SupplierService};
export default function ModalSupplier({show, close, values, type = "supplier"}) {
    const [form] = useForm();

    const [modalData, setModalData] = useState([]);
    const [modalDataWrap, setModalDataWrap] = useState([]);

    const [openModal,  setOpenModel] = useState(show); 
    const [loading,  setLoading] = useState(true);

    const [openManage,  setOpenManage] = useState(false);  
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    /** handle logic component */
    const handleClose = () =>{ 
        setTimeout( () => { close(false);  }, 140);
        
        //setTimeout( () => close(false), 200 );
    } 

    const handleSearch = (value) => {
        if(!!value){    
            const f = modalData.filter( d => ( 
                d.supcode?.toLowerCase().includes(value?.toLowerCase())
            ||  d.supname?.toLowerCase().includes(value?.toLowerCase())
            ||  d.type?.toLowerCase().includes(value?.toLowerCase())
            ) );
             
            setModalDataWrap(f);
        } else { 
            setModalDataWrap(modalData);            
        }

    }

    const handleChoose = (value) => {
        values(value);
        setOpenModel(false);
    }

    const manageSubmit = ( v ) => {
        setOpenManage(false);
        setLoading(true); 
        const action = spiService.create;

        action({...v}).then( _ =>  {
            search();
        }).catch( err => {
            console.warn(err);
            const data = err?.response?.data;
            message.error( data?.message || "error request");
        })
        .finally( () => {
            setTimeout( () => { setLoading(false) }, 300);
        });
        setOpenManage(false);
    }

    /** setting initial component */ 
    const column = columns({handleChoose});

    const search = () =>{
        setLoading(true);
        const getdata = type === 'supplier' ? optionService.optionsSupplier : type === 'producer' ? optionService.optionsProducer : optionService.optionsAllSupplier;
        getdata().then((res) => {
            let { data } = res.data; 
            setModalData(data);
            setModalDataWrap(data);
            // console.log(modalData, data) 
        })
        .catch((err) => { 
            console.warn(err);
            const data = err?.response?.data;
            message.error( data?.message || "error request");  
            // setLoading(false);
        })
        .finally( () => setTimeout( () => { setLoading(false) }, 400));
    }
    
    useEffect( () => {
    
        if( !!openModal ){
            search();
            // console.log("modal-packages")        
        } 
    }, [openModal]);

    const handleResize = () => {
        setIsSmallScreen(window.matchMedia('(max-width: 767px)').matches);
      };
  
      useEffect(() => {
        handleResize(); // Set initial screen size
  
        window.addEventListener('resize', handleResize);
  
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []); // Empty dependency array ensures the effect runs once on mount
    return (
        <>
        <Modal
            open={openModal}
            title={capitalized( ['supplier', 'producer'].includes( type ) ? type : "suppliers" )}
            afterClose={() => handleClose() }
            onCancel={() => setOpenModel(false) } 
            maskClosable={false}
            style={{ top: 20 }}
            width={800}
            className='modal-supplier'
            
        >
            <Spin spinning={loading}>
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                    <Card style={{backgroundColor:'#f0f0f0' }}>
                        <Form form={form} layout="vertical" autoComplete="off" >
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col span={24}>
                                    <Form.Item label="ค้นหา"  >
                                        <Input suffix={<SearchOutlined />} onChange={ (e) => { handleSearch(e.target.value) } } placeholder='ค้นหา'/>
                                    </Form.Item>                        
                                </Col> 
                            </Row>
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col span={24}>
                                    <Typography.Link onClick={()=>{ setOpenManage(true); }} className='ps-1'>
                                        <span className='hover:underline underline-offset-1'>Create Supplier</span>
                                    </Typography.Link> 
                                </Col>
                            </Row>                            
                        </Form>
                    </Card>
                    <Card  style={{minHeight:'60vh'}}>
                        <Table
                            bordered
                            dataSource={modalDataWrap}
                            columns={column}
                            rowKey="id"
                            pagination={{ 
                                total:modalDataWrap?.length || 0, 
                                showTotal:(_, range) => `${range[0]}-${range[1]} of ${modalData?.length || 0} items`,
                                defaultPageSize:10,
                                pageSizeOptions:[10,15,50,100]
                            }} 
                            size='small'
                            scroll={{ x: 'max-content' }}
                        /> 
                    </Card>
                </Space> 
                { openManage &&
                <Drawer
                    destroyOnClose={true}
                    title="Create Supplier"
                    width={isSmallScreen ? '100%' : '40vw'}
                    className='supplier-drawer-class'
                    onClose={()=>{setOpenManage(false)}}
                    open={openManage} 
                    styles={{ body: { padding: '0px 24px 8px' } }}
                    getContainer={() => document.querySelector(".modal-supplier")}
                    afterOpenChange={(e)=>{
                      if(!e) { 
                        //console.log("closed")
                        setOpenManage(false)
                      }
                    }}
                >
                    <ModalSupplierManage submit={(val)=>manageSubmit(val)} /> 
                </Drawer>}                
            </Spin>
        </Modal>
        </>
    )
}
