/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Drawer, message, Popconfirm } from "antd";
import { Row, Col, Space, Descriptions, Table, Collapse } from "antd";
import { Typography, Button } from "antd";
import { ArrowLeftOutlined,CloseCircleFilled ,RetweetOutlined } from "@ant-design/icons";
import { BadgeSampleRequestStatus } from '../../components/badge-and-tag/index.js';
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import SRService from "../../service/SRService.js";
// import { formatCommaNumber } from "../../utils/util.js";
import { samplecolumnView } from "./sample-request.model.js";

import dayjs from 'dayjs';
 

export default function SampleRequestView() {
    const { Paragraph } = Typography;
    const navigate = useNavigate();
    const location = useLocation();
    const { config } = location.state || {config:null};

    const [masterData, setMasterData] = useState({});

    const [masterItems, setMasterItems] = useState([]);
    const [detailItems, setDetailItems] = useState([]); 

    const gettingSamplePreparationData = () => {
        
        SRService.get(config?.code).then( async (res) => {
            const {master, detail} = res.data.data;
            setMasterData(master);
            let i = [
                { label: 'SR No', children: master?.srcode}, 
                { label: 'Sample Date', children: dayjs(master?.spdate).format("DD/MM/YYYY"), span: { md:2, lg: 2, xl: 2, xxl: 2 } }, 
                { label: 'Due Date', children: dayjs(master?.duedate).format("DD/MM/YYYY") }, 
                { label: 'Customer', children: `${master.cuscode} - ${master.cusname}`, span: { md:2, lg: 2, xl: 2, xxl: 2 } }, 
                { label: 'Status', children: <BadgeSampleRequestStatus data={master.srstatus} />, span:{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }},
                { 
                    label: 'Description', 
                    labelStyle: { verticalAlign:'top' }, 
                    children:(
                    <Paragraph style={{margin:'0px'}}>
                        <pre 
                            style={{
                                fontWeight:500,  
                                fontSize: 'clamp(0.8rem, 0.7vw, 1rem)',
                                backgroundColor:'transparent',
                                border:'none',
                                margin:0, padding:0
                            }}
                        >{master.description}</pre>
                    </Paragraph>
                    ), 
                    span:{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }
                },
            ]; 
            setMasterItems([...i]); 
            let d = [
                { 
                    key:'1',
                    label: 'Sample Request', 
                    children: (
                    <Table   
                        style={{backgroundColor: '#fafafa' }}
                        dataSource={detail || []}
                        columns={samplecolumnView}
                        pagination={false}
                        rowKey="seq"
                        scroll={{ x: 'max-content' }} 
                        size='small' 
                    />),
                    disabled:true,
                    showArrow: false,
                },
            ];
            setDetailItems([...d]);
           
        })
        .catch( err => {
            console.warn(err);
            const data = err?.response?.data;
            message.error( data?.message || "error request");
           
        });
    }   

    const hendleClose = () => { 
        navigate("/sample-request", {replace:true});
    } 


    const handleCancelSampleRequest = () => {
        SRService.set_status({code:masterData.srcode, status:'cancel'}).then( _ => { 
            message.success("cancel sr done.");
            hendleClose();
        }).catch( err => {
            console.warn( err );
            const data = err?.response?.data;
            message.error( data?.message || "error request");
        })
    }

    const handleRependingSampleRequest = () => {
        SRService.set_status({code:masterData.srcode, status:'pending'}).then( _ => { 
            message.success("repending sr done.");
            hendleClose();
        }).catch( err => {
            console.warn( err );
            const data = err?.response?.data;
            message.error( data?.message || "error request");
        })
    } 

    const handleCompletedSampleRequest = () => {
        SRService.set_status({code:masterData.srcode, status:'complete'}).then( _ => { 
            message.success("complete sr done.");
            hendleClose();
        }).catch( err => {
            console.warn( err );
            const data = err?.response?.data;
            message.error( data?.message || "error request");
        })
    }

    useEffect(()=>{
        gettingSamplePreparationData();

    }, []);

    /** settimg child component */
    const ButtonActionSrDetailLeft = (
        <Space gap="small" align="center" style={{display:"flex", justifyContent:"start"}} > 
            <Button style={{ width: 120 }} icon={ <ArrowLeftOutlined /> } onClick={ () => { hendleClose(); } } >
                กลับ
            </Button>
        </Space>
    );
    const ButtonActionSrDetailRight = (
        <>
            <Space gap="small" align="center" style={{display:"flex", justifyContent:"end"}} > 
                <div style={{display:'flex', gap:'.78rem'}}>
                    {
                        ['cancel', 'complete'].includes(masterData?.srstatus) &&
                        <Popconfirm
                            placement="bottomRight"
                            title="Restatus to Pending"
                            description="Are you sure to next revision?" 
                            onConfirm={handleRependingSampleRequest} 
                        >
                            <Button type='primary' icon={<RetweetOutlined />} >
                                Repending Sample Request
                            </Button>                            
                        </Popconfirm>                         
                    }

                    {
                        ['pending'].includes(masterData?.srstatus) &&
                        <Popconfirm
                            placement="bottomRight"
                            title="Set status Completed"
                            description="Are you sure to next revision?" 
                            onConfirm={handleCompletedSampleRequest} 
                        >
                            <Button className='bn-success bn-center !text-white hover:!border-transparent' icon={<IoCheckmarkDoneCircle style={{fontSize:16}} />} >
                                Completed Sample Request
                            </Button>                            
                        </Popconfirm>
                    }


                    {
                        ['pending', 'complete'].includes(masterData?.srstatus) &&
                        <Popconfirm
                            placement="bottomRight"
                            title="Cancle Sample Request"
                            description="Are you sure to cancle sp?" 
                            onConfirm={handleCancelSampleRequest} 
                        >
                            <Button danger type='primary'  icon={<CloseCircleFilled />} >
                                Cancle Sample Request
                            </Button>                         
                        </Popconfirm>
                    }
                </div>
            </Space>
        </> 
    );
    // const ButtonActionSrDetailRight = (
    //     <Space gap="small" align="center" style={{display:"flex", justifyContent:"end"}} > 
    //         {config?.action !== "create" && <Button style={{ width: 120 }} type="primary" icon={ <InboxOutlined /> } onClick={ () => { setIsOpenUpload(true)} } >
    //             อัพโหลด
    //         </Button>}
    //     </Space>
    // );

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative', paddingInline:"1.34rem" }} className='sample-preparation-view'>
            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                <Col span={12} style={{paddingInline: '0px'}}>{ ButtonActionSrDetailLeft }</Col>
                <Col span={12} style={{paddingInline: '0px'}}>{ ButtonActionSrDetailRight }</Col>
            </Row>        

            <Descriptions 
                bordered
                column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
                items={masterItems} 
            /> 
 
            <Collapse 
                size="large"
                className='view-collapse-sp'
                collapsible="disabled"
                activeKey={detailItems.map( (_,i) => `${i + 1}`)} 
                bordered={false} 
                style={{backgroundColor:'transparent'}}
                items={detailItems}
            />              
           
        </Space>

    )
}
