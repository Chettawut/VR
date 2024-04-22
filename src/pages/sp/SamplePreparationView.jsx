/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Drawer, message } from "antd";
import { Row, Col, Space, Descriptions, Table, Collapse, Flex } from "antd";
import { Empty, Tag, Tooltip, Popconfirm, Modal } from "antd";
import { Typography, Button } from "antd";
import { ArrowLeftOutlined, CopyOutlined,ExclamationCircleOutlined } from "@ant-design/icons";
import { BadgeSamplePreparationStatus, TagSamplePreparationApproveStatus } from '../../components/badge-and-tag/index.js';
import { CloseCircleFilledIcon } from '../../components/icon';
import { TbFileCertificate } from "react-icons/tb";

import SamplePreparationService from "../../service/SamplePreparation.service.js"; 
import { capitalized, formatCommaNumber } from "../../utils/util";
import { spColumnsView, parameterColumnView } from "./sample-preparation.model";
import { Authenticate } from '../../service/Authenticate.service.js'; 
import { SamplePreparationApprove } from "./sample-preparation.js"

import dayjs from 'dayjs';

const spService = SamplePreparationService();

export default function SamplePreparationView() {
    const { Text } = Typography;
    const navigate = useNavigate();
    const location = useLocation();

    const authService =  Authenticate();
    const [modal, contextHolder] = Modal.useModal();
    // const { startLoading, stopLoading } = useLoadingContext(); 

    const { config } = location.state || {config:null};

    const [masters, setMasters] = useState({});

    const [masterItems, setMasterItems] = useState([]);
    const [detailItems, setDetailItems] = useState([]);
    const [detailItemsActive, setDetailItemsActive] = useState([]);
    const [parameterItems, setParameterItems] = useState([]); 
    const [parameterItemsActive, setParameterItemsActive] = useState([]); 

    const [openApprove, setOpenApprove] = useState(false);

    const [titleApprove, setTitleApprove] = useState('Approve Samplepreparation');
    const [classApprove, setClassApprove] = useState('');
    const [resultApprove, setResultApprove] = useState('approved');


    const handleGetDetailData = (detail) => {
        const step = [...new Set(detail?.map( m => m.stepno))];
        let value = []; 
        for( let s of step){
          const v = detail.filter( f => f.stepno === s ); 
          if( v.length > 0 ){
            value.push(
              {
                total: Number(v[0].amount_total || 0),
                lost: Number(v[0].lost || 0),
                afterLost: Number(v[0].amount_after_lost || 0),
                details:v.map( (m, i) => (
                  { 
                    id: (i+1),
                    stcode: m.stcode,
                    stname: !m.stname ? `paste from step ${i}` : m.stname,
                    amount: Number(m.amount || 0),
                    percent: Number(m.percent || 0),
                    totalpercent: Number(m.totalpercent || 0),
                    stepno: m.stepno,
                    method: m.method,
                  } 
                )), 
                loading: false,
              }
            ); 
          }
        }
        
        return value;
    } 

    const handleCoaPrint = (code) => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = `/coa-print/${code}`;
    }

    const handleLotPrint = (code) => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = `/loi-print/${code}`;
    }

    const gettingSamplePreparationData = () => {
        spService.get(config?.code).then( async (res) => {
            const {master, detail, params, tags} = res.data.data;

            setMasters({...master});
            const tagsData = tags.map( m => m.tags);
            let i = [
                { label: 'SR No', children: master?.srcode, span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3} },
                { label: 'SP No', children: master?.spcode },
                { label: 'SP Name', children: master?.spname },
                { label: 'SP Date', children: dayjs(master?.spdate).format("DD/MM/YYYY") },
                { label: 'Previous No', children: master?.previous_code, span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 } },
                { label: 'Status', children: <BadgeSamplePreparationStatus data={master.spstatus} />, span: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 } },
                { label: 'Package', children: master.pkname},
                { label: 'Net weight', children: master.netweight,},
                { label: 'Specific Gravity', children: master.specific_gravity,},
                { 
                    label: 'Approve Status', 
                    children: <TagSamplePreparationApproveStatus result={master.approved_result} />, 
                },
                { 
                    label: 'Approve By', 
                    children: master.approved_name,
                },
                { 
                    label: 'Approve Date', 
                    children: !!master?.approved_date ? dayjs(master?.approved_date).format("DD/MM/YYYY") : "", 
                },
                { 
                    label: 'Approve Remark', 
                    labelStyle: { verticalAlign:'top' },
                    children: <><pre>{master.approved_remark}</pre></>, 
                    span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }
                },                
                { 
                    label: 'Allergenic & intolerance:', 
                    labelStyle: { verticalAlign:'top' },
                    children: master.allergen_standards, 
                    span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }
                },                
                { 
                    label: 'Storage Conditions', 
                    children: master.storage_conditions,
                    labelStyle: { verticalAlign:'top' },
                    span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }
                },                
                { 
                    label: 'Shelf Life', 
                    children: !!master?.shelf_life ? (`${master?.shelf_life} ${capitalized(master?.shelf_life_unit || "")}s`) : "",
                    span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 },
                },
                { 
                    label: 'Best Before End (BBE)', 
                    children: !!master?.bbe_date ? dayjs(master?.bbe_date).format("DD/MM/YYYY") : "",
                    span: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 },
                },                
                { 
                    label: 'Additional', 
                    children: master.additional,
                    span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 },
                },                
                { 
                    label: 'Remark', 
                    labelStyle: { verticalAlign:'top' },
                    children: <><pre>{master.description}</pre></>, 
                    span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }
                },
                { 
                    label: 'Tags/Group Sample', 
                    labelStyle: { verticalAlign:'top' },
                    children: (
                        <>
                            {tagsData.length < 1 &&<Space style={{width:'100%', justifyContent:'center'}} ><Empty description={false} className='width-100' /></Space>}
                            <Space size="2" style={{width:'100%'}} >
                                {tagsData.map( (m, i) => { 
                                    const isLongTag =  m?.length > 20;
                                    const tagElem = (
                                        <Tag key={`tag--${i}`}  color="#108ee9" style={{height:32, display:'flex', alignItems:'center'}} > 
                                            <span style={{lineHeight:'1.9rem', height:'100%'}}>{isLongTag ? `${m.slice(0, 20)}...` : m} </span> 
                                        </Tag>
                                    );
                                    return isLongTag ? <Tooltip key={`tooltip--${i}`} title={m}> {tagElem} </Tooltip> : tagElem ; 
                                }) } 
                            </Space>                      
                        </>
                    ), 
                    span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 } 
                },
            ]; 

            if( master.approved_result === 'approved' ){
                i = [
                    ...i,
                    { 
                        label: 'Options', 
                        labelStyle: { verticalAlign:'top' },
                        children: ( 
                            <Flex gap='small'>
                                <Button 
                                    style={{ width: 120 }} 
                                    className='bn-center bn-success-outline bn-bold bn-action' 
                                    size='small' 
                                    icon={<TbFileCertificate />} 
                                    onClick={() => handleCoaPrint(master.spcode)} 
                                > COA </Button>
                                <Button 
                                    style={{ width: 120 }} 
                                    className='bn-center bn-warning-outline bn-bold bn-action' 
                                    size='small' 
                                    icon={<TbFileCertificate />} 
                                    onClick={() => handleLotPrint(master.spcode)} 
                                > LOI </Button>
                            </Flex>
                        ), 
                        span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 } 
                    },
                ]
            }

            setMasterItems([...i]);

            let data = handleGetDetailData(detail); 
            let d = data.map( (m, i) => {  
                return ({ 
                    key: `${i+1}`,
                    label: `Step ${i+1}`,  
                    children: (
                    <Table 
                        dataSource={m.details}
                        columns={spColumnsView}
                        pagination={false}
                        rowKey="stcode"
                        scroll={{ x: 'max-content' }} 
                        size='small' 
                        style={{backgroundColor: '#fafafa' }}
                        summary={(_)=>(
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={2}>รวม</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} colSpan={2} className='pe-2 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                                        <Text type="danger">{ formatCommaNumber(m?.total || 0) }</Text>
                                    </Table.Summary.Cell> 
                                    <Table.Summary.Cell index={1} colSpan={1} className='pe-2 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                                        <Text type="danger">{ formatCommaNumber(m?.details.reduce( (acc, val) => acc += val?.percent || 0, 0)  * 100 ) }</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell colSpan={2} />
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={2}>สูญเสีย</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} colSpan={2} className='pe-2 text-end border-right-0' >
                                        <Text type="danger">{ formatCommaNumber(m?.lost || 0 * 100) } %</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell colSpan={3} />
                                </Table.Summary.Row>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={2}>น้ำหนักหลังสูญเสีย</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} colSpan={2} className='pe-2 text-end border-right-0'>
                                        <Text type="danger" style={{textAlign:"end"}}>{ formatCommaNumber(m?.afterLost || 0)}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell colSpan={3} />
                                </Table.Summary.Row>
                            </>
                        )}
                    />),
                    className: "collapse ant-card",
                    disabled:true,
                    showArrow: false,
                    style: { 
                        // background: "#fff",
                    }, 
                })
            });
            setDetailItemsActive(d.map( (_,i) => `${i+1}`));
            setDetailItems([...d]);    
            let p = [
                { 
                    key: '1',
                    label: 'Preparation Parameter', 
                    children:( 
                    <Table   
                        style={{backgroundColor: '#fafafa' }}
                        dataSource={params || []}
                        columns={parameterColumnView}
                        pagination={false}
                        rowKey="seq"
                        scroll={{ x: 'max-content' }} 
                        size='small' 
                    />),
                    disabled:true,
                    showArrow: false,
                },
            ];
            setParameterItemsActive(p.map( (_,i) => `${i+1}`)); 
            setParameterItems([...p]);
        })
        .catch( err => {
            console.warn(err);
            const data = err?.response?.data;
            message.error( data?.message || "error request");
        });
 
    }  

    const hendleClose = () => { 
        navigate("/sample-preparation", {replace:true});
    } 

    const handleApprove = (type) => {
        if( type === 'approve' ) {
            setClassApprove( 'approved' );
            setResultApprove( 'approved' );
            setTitleApprove(`Approve SP No ${config?.code}`);
            setOpenApprove(true);
        } else if( type === 'reject' ) {
            setClassApprove( 'rejected' );
            setResultApprove( 'not_approved' );
            setTitleApprove(`Reject SP No ${config?.code}`); 
            setOpenApprove(true);
        }
    }

    const handleConfirmApproved = (v) => {

        gettingSamplePreparationData();

        setOpenApprove(false);
    }

    const handleCancelApprove = () => {
        spService.cancel_approved( { spcode : config?.code  } ).then( _ => {
            message.info( "Sample preparation approved to canceled." );

            gettingSamplePreparationData();
        })
        .catch( err => {
            console.warn(err);
            const { message:mes } = err.response;
            message.error( mes || "error request"); 
        });
    }

    const handleCancelSamplePreparation = () => {
        spService.cancel_sample_preparation( { spcode : config?.code  } ).then( _ => {
            message.info( "Sample preparation canceled." ); 
            gettingSamplePreparationData();
        })
        .catch( err => {
            console.warn(err);
            const { data:{ message:mes } } = err.response;
            message.error( mes || "error request"); 
        });
    }

    const handleDuplicateSamplePreparation = () => {
        spService.spduplicate( { spcode : config?.code  } ).then( res => {
            message.info( "Duplicate Sample preparation success." );
            const {code} = res.data;
            const manageConfig = {title:"เพิ่ม Sample Preparation", textOk:null, textCancel:null, action:"create", code:null};
            if( !!code ) {
                modal.confirm({
                  title: `SP Code ${code}`,
                  icon: <ExclamationCircleOutlined />,
                  content: `Go to edit page ?`,
                  okText: 'Ok',
                  cancelText: 'Cancel',
                  onOk: () => {
                    navigate("/sample-preparation/manage/edit", { 
                        state: { 
                            config: {...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:code} 
                        }, 
                        replace:true 
                    } );
                  },
                  onCancel: () => gettingSamplePreparationData()
                }); 
            } else { 
                gettingSamplePreparationData();
            }

        })
        .catch( err => {
            console.warn(err);
            const { data:{ message:mes } } = err.response;
            message.error( mes || "error request"); 
        });
    }

    useEffect( ()=>{
        
        // console.log(config);
        if(!config) {
            hendleClose();
            return;
        }
        gettingSamplePreparationData();  

        return () => {}
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
            <Space gap="small" align="center" className='flex justify-start lg:justify-end md:justify-end' > 
                <div style={{display:'flex', gap:'.78rem', flexWrap:'wrap'}}>
                    <Popconfirm
                        placement="bottomRight"
                        title="Duplicate Sample Preparation"
                        description="Are you sure to duplicate?" 
                        onConfirm={handleDuplicateSamplePreparation} 
                    >
                        <Button type='primary' icon={<CopyOutlined />} >
                            Duplicate Sample Preparation
                        </Button>                            
                    </Popconfirm> 

                    {
                        masters?.spstatus === 'pending' && masters?.approved_result === 'waiting_approve' &&
                        <Popconfirm
                            placement="bottomRight"
                            title="Cancle Sample Preparation"
                            description="Are you sure to cancle sp?" 
                            onConfirm={handleCancelSamplePreparation} 
                        >
                            <Button danger type='primary'  icon={<CloseCircleFilledIcon />} >
                                Cancle Sample Preparation
                            </Button>                         
                        </Popconfirm>
                    }
                </div>
            </Space>
        </> 
    );

    const ButtonActionSrDetailBottomRight = (
        <> 
            <Space gap="small" align="center" className='flex justify-start lg:justify-end md:justify-end' > 
                { authService.getType() === 'admin' && masters.approved_result === 'waiting_approve' && masters?.spstatus === 'pending' && (
                    <Button style={{ width: 120 }} type="primary" className='bn-success'  onClick={() => handleApprove('approve')}  >
                        Approve
                    </Button>
                )}
                { authService.getType() === 'admin' && masters.approved_result === 'waiting_approve' && masters?.spstatus === 'pending' && (
                    <Button style={{ width: 120 }} type="primary" danger className='btn-danger' onClick={() => handleApprove('reject')}  >
                        Not Approve
                    </Button>
                )}
                { (authService.getType() === 'admin' && ['approved', 'not_approved'].includes(masters.approved_result) && masters.cusapproved_status !== 'Y') && (
                    <Popconfirm
                        placement="topRight"
                        title="Cancle Approved"
                        description="Are you sure to cancle approved?" 
                        onConfirm={handleCancelApprove} 
                    >
                        <Button danger className='bn-danger-outline' icon={<CloseCircleFilledIcon />} >
                            Cancle Approve
                        </Button>                        
                    </Popconfirm> 
                )}
            </Space> 
        </>

    );

    // console.log('Current count:', detailItemsActive, parameterItemsActive);
    return (
        <>
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative', paddingInline:"1.34rem" }} className='sample-preparation-view'>
            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className='px-0' >{ ButtonActionSrDetailLeft }</Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className='px-0' >{ ButtonActionSrDetailRight }</Col>
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
                activeKey={detailItemsActive}
                bordered={false} 
                style={{backgroundColor:'transparent'}}
                items={detailItems}
            /> 
 
            <Collapse 
                size="large"
                className='view-collapse-sp'
                collapsible="disabled"
                activeKey={parameterItemsActive}
                bordered={false} 
                style={{backgroundColor:'transparent'}}
                items={parameterItems}
            />    

            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className='px-0' >{ ButtonActionSrDetailLeft }</Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} className='px-0' >{ ButtonActionSrDetailBottomRight }</Col>
            </Row>              

            <Drawer title={titleApprove} placement="right" size="small" open={openApprove} onClose={()=>{ setOpenApprove(false) }} className={`panel-approve ${classApprove}`} > 
                { openApprove && (
                    <SamplePreparationApprove 
                        cancel={() => { setOpenApprove(false) } } 
                        code={config?.code} 
                        result={resultApprove}
                        confirmed={ (v) => handleConfirmApproved( v )}
                    />)} 
            </Drawer> 
        </Space>
        {contextHolder}
        </>
    )
}
