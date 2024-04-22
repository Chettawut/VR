/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Space, Row, Col, Flex } from 'antd';
import { Card, message, Modal } from 'antd';
import { Form, Typography } from 'antd';
import { Input, Button, DatePicker, Table, Radio } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, SaveOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import ModalCustomers from '../../components/modal/customers/ModalCustomers';
import ModalItems from '../../components/modal/items/ModalItems';
import ModalSampleRequest from '../../components/modal/sample-request/ModalSampleRequest';

// import { BsUiChecks } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";
// import { FaExclamationTriangle } from "react-icons/fa";

import { formatCommaNumber } from '../../utils/util';
import { componentsEditable, columnsDetailsEditable } from "./delivery-note.model";

import DeliveryNoteService from "../../service/DeliveryNote.service.js";

import dayjs from 'dayjs';
import { TbFileSearch } from 'react-icons/tb';

const dnService = DeliveryNoteService();
function DeliveryNoteManage() {
  const { Text } = Typography;
  const [modal, contextHolder] = Modal.useModal();

  const navigate = useNavigate();
  const location = useLocation();

  const { config } = location.state || {config:null};
  const [form] = Form.useForm();

  const [smValue, setSmValue] = useState();

  const [formDetail, setFormDetail] = useState({});

  const [openModalCustomer, setOpenModalCustomer] = useState(false);
  const [openModalItems, setOpenModalItems] = useState(false);
  const [openModalSampleRequest, setOpenModalSampleRequest] = useState(false);

  // const [itemsData, setItemsData] = useState([]);
  const [detailData, setDetailData] = useState([]);
 
  const options = [
    {
      label: 'Choose Product With Sample Request(SR)',
      value: '1',
    },
    {
      label: 'Choose Product Manual',
      value: '2',
    }, 
  ];
  // const [headerMaster, setHeaderMaster] = useState({});
  const hendleClose = (data) => {
    form.resetFields();
    setFormDetail({});
    modal.confirm({
      title: `ยืนยันการสั่งปริ้น`,
      icon: <ExclamationCircleOutlined />,
      content: `ต้องการดำเนินการปริ้น Delivery note หรือไม่ ?`,
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      onOk: () => {
        const newWindow = window.open('', '_blank');
        newWindow.location.href = `/dln-print/${data?.id}/1`;

        navigate("/delivery-note", {replace:true});
      },
      onCancel: () => navigate("/delivery-note", {replace:true})
    });      
    
} 

  const handleChoosOption = ({type, target: {value} }) => {
    if(!value) { 
      return;
    }
      const methodItems = (v) => {
      setSmValue(v);
      switch( v ){
        case '1' : setOpenModalSampleRequest(true); break;
        case '2' : setOpenModalItems(true); break;
        default : return;
      }
    }
    
    if( !!smValue && smValue !== value ) {
      modal.confirm({
        title: `วิธีการดึงข้อมูลสิ้นค้าเปลี่ยนแปลง`,
        icon: <ExclamationCircleOutlined />,
        content: `ต้องการดำเนินการต่อหรือไม่ ?`,
        okText: 'ยืนยัน',
        cancelText: 'ยกเลิก',
        onOk: () => {
          setDetailData([]);
          methodItems(value);
        },
      });     
    } else methodItems(value);
  }

  const handleChoosedCustomer = (value) => {
    const f = form.getFieldValue();
    const initialValues = { ...f, cuscode: value.cuscode, cusname: value.cusname};
    form.setFieldsValue(initialValues);
    setFormDetail(initialValues); 
  }; 

  const handleChooseItems = (value) => {
    //setItemsData(value); 

    const item = value.map( (m) => ({
      ...m,
      qty: m?.qty || 1
    }));

    setDetailData( item );
    const initialValues = { ...formDetail, srcode: null }; 
    setFormDetail(initialValues); 
  }; 

  const handleChoosedSampleRequest = (value) => {
    const f = form.getFieldValue();
    const initialValues = { ...f, srcode: value.srcode, cuscode: value.cuscode, cusname: value.cusname };
    form.setFieldsValue(initialValues);
    setFormDetail(initialValues); 

    dnService.getItemsWithSr(value.srcode).then(  res => {
      const { data } = res.data;
      const item = data.map( (m) => ({
        ...m,
        qty: m?.qty || 1
      }));

      setDetailData( item );
    })
    .catch( err => {
      message.error("Error: Update sample requerest fail.");
    });
  };  

  const handleConfirm = (e) => {
        // console.log(sampleDetails);
        // setSubmited(true);          
        if(detailData.length < 1) {
          message.warning("Please select Product.");
          return;
        }  
        form.validateFields().then( value => {  
            const header = { ...formDetail, ...value };
            const detail = detailData; 
            header.dndate = dayjs(header.dndate).format("YYYY-MM-DD"); 

            if(config.action === "create"){
                dnService.create({header,  detail }).then( res => { 
                    const {data} = res.data;
                    message.success("Success: Create sample requerest done.");
                    hendleClose(data);
                })
                .catch( err =>  {
                    message.error("Error: Create sample requerest fail.");
                });         
            } else {
                dnService.update({header,  detail }).then( res => { 
                  const {data} = res.data;
                  message.success("Success: Update sample requerest done."); 
                  hendleClose(data);
                })
                .catch( err =>  {
                    message.error("Error: Update sample requerest fail.");
                });
            } 
        })
  }

  const handleSave = (row) => {
    const { key } = row;
    const newData = (r) => {
        const itemDetail  = [...detailData];
        const newData = [...itemDetail];
        
        const ind = newData.findIndex( (item) => row?.stcode === item?.stcode );
        const item = newData[ind < 0 ? 0 : ind]; 
        newData.splice(ind < 0 ? 0 : ind, 1, {
          ...item,
          ...row,
        });
        return newData;
    }
    setDetailData([...newData(row)]);
  };

  const handleDelete = (code) => {
    const itemDetail  = [...detailData];
    const newData = itemDetail.filter (
        (item) => item?.stcode !== code
    );
    setDetailData([...newData]);
    //setItemsData([...newData]);
  };

  const handleAction = (record) =>{
    const itemDetail  = [...detailData];
    return itemDetail.length >= 1 ? (
        <Button
          className="bt-icon"
          size='small'
          danger
          icon={<RiDeleteBin5Line style={{fontSize: '1rem', marginTop: '3px' }} />}
          onClick={() => handleDelete(record?.stcode)}
          disabled={!record?.stcode}
        />
      ) : null
  }

  const column = columnsDetailsEditable(handleSave, {handleAction})

  useEffect( ()=> {
    const initeial = () => {
      if(config.action !== "create"){
        dnService.get( config?.code || "").then(  res => {
          const { data:{ detail, header} } = res.data;
          
          const init = {...header, dndate: dayjs(header.dndate || null) }
          form.setFieldsValue(init);
          setFormDetail(init); 
          setDetailData( detail );
        }).catch( err => {
          message.error("Error: Get deleivery fail.");
        })
      }

    }
    
    
    initeial();

  }, [form, config]);

  const ButtonActionLeft = (
    <Space gap="small" align="center" style={{display:"flex", justifyContent:"start"}} > 
        <Button style={{ width: 120 }} icon={ <ArrowLeftOutlined /> } onClick={ () => { navigate("/delivery-note", {replace:true}); } } >
            กลับ
        </Button>
    </Space>
  );

  const ButtonActionBottomRight = (
    <Space gap="small" align="center" style={{display:"flex", justifyContent:"start"}} >
      <Button 
          icon={<SaveOutlined style={{fontSize:'1rem'}} />} 
          type='primary' style={{ width:'9.5rem' }} 
          onClick={()=>{ handleConfirm() }} 
      >ยืนยันบันทึก</Button>
    </Space>    
  );

  return (
    <div className='delivery-note-manage'>
      <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
          <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
             <Col span={12} style={{paddingInline:0}}>{ ButtonActionLeft }</Col>
             {/* <Col span={12} style={{paddingInline:0}}>  </Col> */}
          </Row>          
          <Card style={{backgroundColor:'#f0f0f0' }}>
            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0 items-center'>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Flex align='center' justify='start'>
                    <Typography.Title level={3} className='m-0'>Product for Delivery</Typography.Title>
                  </Flex>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Flex align='center' justify='end'>
                    { !!formDetail.dncode ? <Typography.Title level={4} className='m-0'>Delivery No: {formDetail.dncode}</Typography.Title>
                      :<div onClick={(v) => handleChoosOption(v)}>
                         <Radio.Group options={options} value={smValue} optionType="button" buttonStyle="solid" /> 
                       </div>
                    }
                  </Flex>
                </Col>
              </Row>             
          </Card>
          <Card style={{backgroundColor:'#f0f0f0' }}>
            <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >  
              <Form form={form} layout="vertical" autoComplete="off" >
                <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                    {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item label="Product :" rules={[ { required: true, message: "Please choose data!", } ]} >
                        <div onClick={(v) => handleChoosOption(v)}>
                          <Radio.Group options={options} value={smValue} optionType="button" buttonStyle="solid" /> 
                        </div>
                      </Form.Item>                
                    </Col> */}
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Customer :" name='cuscode' rules={[ { required: true, message: "Please choose data!", } ]} >
                        <Space.Compact style={{ width: '100%' }}>
                            <Input readOnly placeholder='ชื่อลูกค้า' value={ !!formDetail.cuscode ? `${formDetail.cuscode} - ${formDetail.cusname}` : ""}  />
                            <Button type="primary" icon={<SearchOutlined />} onClick={() => setOpenModalCustomer(true)} style={{minWidth:40}} ></Button>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item label="Delivery Date :" name="dndate" rules={[ { required: true, message: "Please input your data!", } ]}>
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
              <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Table 
                      components={componentsEditable}
                      rowClassName={() => "editable-row"}
                      bordered
                      dataSource={detailData}
                      columns={column}
                      pagination={false}
                      rowKey="stcode"
                      scroll={{ x: 'max-content' }} 
                      size='large'
                      locale = {{ emptyText: <span>No data available, please add some data.</span> }}
                      summary={(v)=>(
                        <>
                          <Table.Summary.Row>
                              <Table.Summary.Cell index={0} colSpan={2}>รวม</Table.Summary.Cell>
                              <Table.Summary.Cell index={1} colSpan={2} className='text-summary text-end border-right-0 pe-summary' >
                                  <Text type="danger" className='double-underline'>{ formatCommaNumber(v.reduce( (a,v) => a += Number(v?.qty || 0), 0) || 0) }</Text>
                              </Table.Summary.Cell> 
                          </Table.Summary.Row>
                        </>
                      )}
                  />
                </Col>
              </Row>
              <Row> 
                <Col span={12} style={{display:'flex', justifyContent:'start'}} >
                    {ButtonActionLeft}
                </Col>
                <Col span={12} style={{display:'flex', justifyContent:'end'}} >
                    {ButtonActionBottomRight}
                </Col>
              </Row>              
            </Space>
          </Card>
      </Space>      


      { openModalCustomer && (
          <ModalCustomers show={openModalCustomer} close={() => { setOpenModalCustomer(false) }} values={(v)=>{handleChoosedCustomer(v)}} ></ModalCustomers>
      )}
  
      { openModalItems && (
          <ModalItems show={openModalItems} close={() => { setOpenModalItems(false) }} values={(v)=>{handleChooseItems(v)}} selected={detailData}  ></ModalItems>
      )}

      { openModalSampleRequest && (
          <ModalSampleRequest show={openModalSampleRequest} close={() => { setOpenModalSampleRequest(false) }} values={(v)=>{handleChoosedSampleRequest(v)}} ></ModalSampleRequest>
      )}

      {contextHolder}
    </div>
  )
}

export default DeliveryNoteManage