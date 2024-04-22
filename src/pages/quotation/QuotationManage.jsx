/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { AutoComplete, Button, DatePicker, Drawer, Form, Input, InputNumber, Modal, Select, Table, Typography, message } from 'antd'; 
import { Card, Col, Divider, Flex,Row, Space } from 'antd'; 
import { FaBoxesPacking } from "react-icons/fa6";

import OptionService from "../../service/Options.service";
import QuotationService from '../../service/Quotation.service';
import { BankFilled, LeftOutlined, SaveFilled, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import ModalCustomers from '../../components/modal/customers/ModalCustomers';

import { quotationForm, bankListColumn, productColumn, quotationTerm } from "./quotation.model"
import { ModalBanks } from '../../components/modal/banks/modal-banks';
import QuotationManageForm from './QuotationManageForm';
import dayjs from "dayjs";
import { delay, formatCommaNumber } from '../../utils/util';
import { ButtonBack } from '../../components/button';
import { useLocation, useNavigate } from 'react-router-dom';

import {   LuPrinter } from "react-icons/lu";
const opservice = OptionService();
const quservice = QuotationService();

const paymentCond = [
  "30 days after BL date by T/T",
  "100% T/T upon shipment advice",
  "100 % T/T against copy of documents",
  "50% desposit and balance T/T against copy of documents",
  "30% desposit and balance T/T against copy of document",
  "100 % advance",
  "credit 30 days",
  "credit 15 days",
  "50% deposit and balance when delivery",
];
const currencies = [ "THB", "USD" ];

const mngConfig = {title:"", textOk:null, textCancel:null, action:"create", code:null};
const productFormName = 'product-form';
const gotoFrom = "/quotation";
function QuotationManage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { config } = location.state || {config:null};

  const [form] = Form.useForm();

  const [manageConfig, setManageConfig] = useState(mngConfig);
  const [submited, setSubmited] = useState(false);

  /** Modal handle */
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openBanks, setOpenBanks] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);

  /** Quotation state */
  const [quotCode, setQuotCode] = useState(null);

  /** Banks Data State */
  const [quotBanks, setQuotBanks] = useState([]);

  /** Detail Data State */
  const [quotDetails, setQuotDetails] = useState([]);
  
  // const [banksOption, setBanksOption] = useState([]);
  const [payConditionOptions, setPayConditionOptions] = useState([]);
  const [currenciesOptions, setCurrenciesOptions] = useState([]);

  const [formDetail, setFormDetail] = useState(quotationForm);

  const cardStyle = {backgroundColor:'#f0f0f0', height: 'calc(100% - (25.4px + 1rem))' };

  const handleSummaryPrice = (record) =>{
    if( form.getFieldValue("vat") === undefined ) form.setFieldValue("vat", formDetail.vat);
    const vat = form.getFieldValue("vat");
    
    const total_price = record?.reduce( (ac, v) => ac += Number( v?.total_amount || 0), 0);
    const grand_total_price = parseFloat((total_price / ( 1 - ( Number( vat || 0) / 100 ))).toFixed(2));
    
    const newData = {...formDetail, vat, total_price, grand_total_price};
     
    setFormDetail( newData );
  }

  const handleVat = (e) => {
    handleSummaryPrice(quotDetails);
  }

  const handleCalculatePrice = (day, date) => {
      const newDateAfterAdding = dayjs( date || new Date()).add(Number(day), 'day');
      const nDateFormet =  newDateAfterAdding.format("YYYY-MM-DD");

      setFormDetail( state => ({...state, dated_price_until:nDateFormet}) );
      form.setFieldValue("dated_price_until", nDateFormet);    
  }

  const handleValidPriceUntil = (e) => {
    const { quotdate } = form.getFieldsValue();
    if(  !isNaN(e) ) {
      handleCalculatePrice( e, (quotdate || new Date()) );
    }     
  }

  const handleQuotDate = (e) => {
    const { valid_price_until } = form.getFieldsValue();
    if( !!valid_price_until && !!e ) {
      handleCalculatePrice( (valid_price_until || 0), (e || new Date()) );
    }
  }

  /** Function modal handle */
  const handleChoosedCustomer = (val) => {
    const fvalue = form.getFieldsValue();
    const addr = [
      (!!val?.idno ? `${val.idno} ` : ""), 
      (!!val?.road ? `${val?.road} ` : ""), 
      (!!val?.subdistrict ? `${val.subdistrict} ` : ""),
      (!!val?.district ? `${val.district} ` : ""),
      (!!val?.province ? `${val.province} ` : ""),
      (!!val?.zipcode ? `${val.zipcode} ` : ""),
      (!!val?.country ? `(${val.country})` : ""),
    ];
    const customer = {
      ...val,
      address: addr.join(""),
      tel: val?.tel?.replace(/[^(0-9, \-, \s, \\,)]/g, '')?.trim()
    }
    
    setFormDetail( state => ({...state, ...val}));
    form.setFieldsValue({...fvalue, ...customer });
  }

  const handleChoosedBanks = ( val ) => {
    console.log( val ); 
    setQuotBanks( val );
  }

  /** Function handle banks */
  const handleBanksRemove = ( record ) => {
    const banks  = [...quotBanks];
    const newData = banks.filter(
        (item) => item?.acc_no !== record?.acc_no
    );
    setQuotBanks([...newData]);
    //setItemsData([...newData]);
  }

  /** Function handle quotation Detail ( Product ) */
  const handleQuotationDetailRemove = (record) => {
    const details  = [...quotDetails];
    const newData = details.filter(
        (item) => item?.id !== record?.id
    );
    setQuotDetails([...newData]);
    handleSummaryPrice([...newData]);
    //setItemsData([...newData]);     
  }

  const handleQuotationDetailEdit = (record) => {
    setManageConfig( s => ({...s, title:"Edit Quotation detail list",  action:"edit", data:record }));
    setOpenProducts( true );     
  }

  const handleConfirmProduct = (val) => {
    const prod = quotDetails;
    const dataDuplicate = prod.findIndex( prd => prd.id === val.id );

    if( dataDuplicate > -1 ){
      const newData = prod.map( prd => {
        if ( prd?.id === val.id ){
          prd = {...prd, ...val};
  
          return prd;
        } else return prd;
      });
      setQuotDetails(newData);
      handleSummaryPrice(newData);
    }else {
      const newData = [...prod, val];
      setQuotDetails(newData);
      handleSummaryPrice(newData);
    }

    setOpenProducts(false);
  } 

  const handleConfirm = () =>{
    form.validateFields().then((v) => { 
      setSubmited(true);
      if( quotBanks.length < 1 ) throw new Error("Bank required");
      if( quotDetails.length < 1 ) throw new Error("Detail required");

      const head = {...formDetail, ...v, quotdate: dayjs(v.quotdate).format("YYYY-MM-DD")};
      const detail = quotDetails;
      const bank = quotBanks;

      const parm = { head, detail, bank};
      const actions = config?.action !== "create" ? quservice.update : quservice.create ;
      actions(parm).then( r => {
        handleClose().then( r => {
          message.success("Request Quotation success."); 
        });
      }).catch( err => {
        message.error("Request Quotation fail.")
        console.warn(err);      
      })      
      if( bank.length < 0 ) handleClose();
    }).catch( err => { 
      Modal.error({ title: 'This is an error message', content: 'Please enter require data', });
    });
  }

  const handleClose = async () => {
    navigate(gotoFrom, {replace:true});
    await delay(300);
    console.clear();
  }

  const handlePrint = () => {
    const newWindow = window.open('', '_blank');
    newWindow.location.href = `/quo-print/${formDetail.quotcode}`;
  };

  /** setting column table */
  const bankcolumns = bankListColumn({handleRemove:handleBanksRemove});
  const prodcolumns = productColumn({handleRemove:handleQuotationDetailRemove, handleEdit:handleQuotationDetailEdit})

  
  useEffect( () => {
    const initial = async () => {
      if( config?.action !== "create" ){
        const res = await quservice.get(config?.code).catch( error => message.error("get Quotation data fail.") );
        const { data:{ head, detail, bank }} = res.data;
        const { quotcode, quotdate } = head;
        setFormDetail( head );
        setQuotDetails( detail );
        setQuotBanks( bank );
        setQuotCode( quotcode ); 
        form.setFieldsValue( { ...head, quotdate: dayjs(quotdate) } );

        // setTimeout( () => {  handleCalculatePrice(head?.valid_price_until, head?.dated_price_until) }, 200);
        // handleChoosedCustomer(head);
      } else {
        const {data:code} = (await quservice.code().catch(e=>{ message.error("get Quotation code fail.") })).data;
        setQuotCode( code );
        const ininteial_value = {...formDetail, quotcode:code, quotdate: dayjs(new Date())};
        setFormDetail(ininteial_value); 
        form.setFieldsValue( ininteial_value );
      } 



      const [
        // quotCodeRes,
        // bankOptnRes,
        payConditionRes,
        currencyRes,
      ] = await Promise.all([ 
        // quservice.code(),
        // opservice.optionsBanks(),
        opservice.optionsQuotation({p:'pay-condition'}),
        opservice.optionsQuotation({p:'currency'}),
      ]); 
      
      // setQuotCode( quotCodeRes.data?.data );
      // setBanksOption( bankOptnRes.data.data );

      setPayConditionOptions( [ ...new Set([...payConditionRes.data?.data, ...paymentCond])].map( v => ({value:v}) )  );
      setCurrenciesOptions( [ ...new Set([...currencyRes.data?.data, ...currencies])].map( v => ({value:v}) ) );
    }

    initial();
    return () => { }
  }, []);


  const SectionCustomer = ( 
    <>
      <Space size='small' direction='vertical' className='flex gap-2' >
        <Row gutter={[8, 8]} className='m-0'>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item name='cuscode' htmlFor="cuscode-1" label='Customer Code' className='!mb-1' rules={[{ required: true, message: 'Missing Loading type', }]}> 
              <Space.Compact style={{ width: '100%' }}>
                  <Input readOnly placeholder='เลือก ลูกค้า' id="cuscode-1" value={formDetail.cuscode} className='!bg-white' />
                  <Button type="primary" icon={<SearchOutlined />} onClick={() => setOpenCustomer(true)} style={{minWidth:40}} ></Button>
              </Space.Compact>                 
            </Form.Item> 
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item name='cusname' label='Customer Name' className='!mb-1'> 
              <Input placeholder='Customer Name.' readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item name='address' label='Customer Address' className='!mb-1'> 
              <Input placeholder='Customer Address.' readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item name='contact' label='Customer Contact' className='!mb-1'> 
              <Input placeholder='Customer Contact.' readOnly/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item name='tel' label='Customer Tel' className='!mb-1'> 
              <Input placeholder='Customer Tel.' readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Space>
    </> 
  );

  const SectionQuotation = (
    <>
      <Space size='small' direction='vertical' className='flex gap-2' >
        <Row gutter={[8, 8]} className='m-0'>
          <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item name='valid_price_until' label='Valid price until' className='!mb-1' rules={[{ required: true, message: 'Missing Valid price until'}]} > 
              <InputNumber placeholder='Valid price until (Day)' controls={false} min={0} className='input-40 w-full' onChange={handleValidPriceUntil} />                
            </Form.Item> 
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item name='dated_price_until' label='Valid price until date' className='!mb-1'>
              <Input placeholder='Customer Valid price until date.' readOnly value={formDetail?.dated_price_until} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} md={6} lg={6} xl={6} xxl={6}>
            <Form.Item name='currency' label='Currency' className='!mb-1' rules={[{ required: true, message: 'Missing Currency' }]}> 
              <AutoComplete 
                style={{ height:40, width:'100%' }}
                options={currenciesOptions}
                // onSearch={handleSearch}
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                allowClear 
                placeholder='Enter Loading type Name.'
              /> 
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} md={6} lg={6} xl={6} xxl={6}>
            <Form.Item name='rate' label='Rate' className='!mb-1' rules={[{ required: true, message: 'Missing Rate' }]}> 
              <InputNumber placeholder='Enter Rate.' controls={false} min={0} className='input-40 w-full' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item name='price_terms' label='Price Term' className='!mb-1' rules={[{ required: true, message: 'Missing Price Term' }]}> 
              <Select
                  showSearch
                  autoClearSearchValue
                  style={{ height:40, width:'100%' }}
                  options={quotationTerm} 
                  optionFilterProp="children"
                  filterOption={(input, option) => {  
                    const val = input?.toLowerCase();
                    return ( option.label?.toLowerCase() ?? '').includes(val)
                  }} 
                  optionLabelProp="label"
                  allowClear 
                  placeholder='Enter Price Term.'              
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item name='payment_condition' label='Payment Condition' className='!mb-1' rules={[{ required: true, message: 'Missing Payment Condition' }]}> 
              <AutoComplete 
                style={{ height:40, width:'100%' }}
                options={payConditionOptions}
                // onSearch={handleSearch}
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                allowClear 
                placeholder='Enter Loading type Name.'
              />
            </Form.Item>
          </Col>  
        </Row>
      </Space>
    </> 
  );

  const SectionBanks =( 
    <>
      <Space size='small' direction='vertical' className='flex gap-2' >
        <Row gutter={[8, 8]} className='m-0' align='middle'>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Typography.Title level={4} className='m-0 !text-zinc-400'>Banks for Quotation</Typography.Title>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Flex justify='end'>
              <Button className='bn-success-outline bn-center' icon={<BankFilled />} onClick={()=> setOpenBanks(true) } >Choose Bank</Button> 
            </Flex>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Table
              columns={bankcolumns}
              dataSource={quotBanks}
              locale = {{ emptyText: <span>No data available, please choose data.</span> }}
              size='small'
              rowKey='acc_no'
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row> 
      </Space>
    </> 
  );

  const SectionProduct = ( 
    <>
      <Space size='small' direction='vertical' className='flex gap-2' >
        <Row gutter={[8, 8]} className='m-0' align='middle'>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Typography.Title level={4} className='m-0 !text-zinc-400'>Products for Quotation</Typography.Title>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Flex justify='end'>
              <Button className='bn-success-outline bn-center' icon={<FaBoxesPacking />} onClick={()=> {
                form.validateFields().then( (v) => { 
                  setManageConfig( s => ({...s, title:"Adding Quotation detail list",  action:"create" }));
                  setOpenProducts( true ); 
                }).catch( err => { 
                  Modal.error({ title: 'This is an error message', content: 'Please enter require data', });
                });

              }}>Choose Product</Button> 
            </Flex>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Table
              columns={prodcolumns}
              dataSource={quotDetails}
              locale = {{ emptyText: <span>No data available, please choose data.</span> }}
              size='small'
              rowKey='id'
              pagination={false}
              scroll={{ x: 'max-content' }}
              summary={(record) => {
                return (<>
                 {quotDetails.length > 0 && (
                  <>
                  <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4} ></Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align='end' className='!pe-4'>Total</Table.Summary.Cell>
                      <Table.Summary.Cell className='!pe-4 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                        <Typography.Text type="danger">{ formatCommaNumber(Number(formDetail?.total_price || 0)) }</Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell >Baht</Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4} ></Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align='end' className='!pe-4'>Vat</Table.Summary.Cell>
                      <Table.Summary.Cell className='!pe-4 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                        <Form.Item name="vat" className='!m-0'>
                          <InputNumber className='width-100 input-30 text-end' controls={false} min={0} onFocus={(e)=>{ e.target.select() }} onChange={handleVat} />
                        </Form.Item>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell >%</Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4} ></Table.Summary.Cell>
                      <Table.Summary.Cell index={4} align='end' className='!pe-4'>Grand Total</Table.Summary.Cell>
                      <Table.Summary.Cell className='!pe-4 text-end border-right-0' style={{borderRigth:"0px solid"}} > 
                        <Typography.Text type="danger">{ formatCommaNumber(Number(formDetail?.grand_total_price || 0)) }</Typography.Text> 
                      </Table.Summary.Cell>
                      <Table.Summary.Cell >Baht</Table.Summary.Cell>
                  </Table.Summary.Row>  
                  </>                
                )}
                </>);
              }}
            />
          </Col>
        </Row> 
      </Space>
    </> 
  );

  const SectionOther = (<>
    <Space size='small' direction='vertical' className='flex gap-2' >
      <Row gutter={[8,8]} className='m-0'>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} >
          <Form.Item className='' name='remark' label='Remark' >
            <Input.TextArea placeholder='Enter Remark' rows={4}  />
          </Form.Item>
        </Col>
      </Row>    
    </Space> 
  </>)

  ///** button */

  const SectionTop = (
    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
      <Col span={12} className='p-0'>
          <Flex gap={4} justify='start'>
            <ButtonBack target={gotoFrom} /> 
          </Flex>
      </Col>
      <Col span={12} style={{paddingInline:0}}>  
          <Flex gap={4} justify='end'>
            { !!formDetail.quotcode && 
              <Button 
                icon={<LuPrinter />} 
                onClick={()=>{handlePrint()}} 
                className='bn-center !bg-orange-400 !text-white !border-transparent' 
              >PRINT ESTIMATE COST</Button>
            }
          </Flex>  
      </Col>
    </Row>         
  );
  
  const SectionBottom = (
    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
      <Col span={12} className='p-0'>
        <Flex gap={4} justify='start'>
            <ButtonBack target={gotoFrom} />
        </Flex>
      </Col>
      <Col span={12} style={{paddingInline:0}}>
        <Flex gap={4} justify='end'>
            <Button 
            className='bn-center justify-center'
            icon={<SaveFilled style={{fontSize:'1rem'}} />} 
            type='primary' style={{ width:'9.5rem' }} 
            onClick={()=>{ handleConfirm() }} 
            >Save</Button>
        </Flex>
      </Col>
    </Row>
  );

  const SectionDrawerButtonBottom = (
    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
        <Col span={12} className='p-0'>
            <Flex gap={4} justify='start'>
                <Button  
                    icon={<LeftOutlined style={{fontSize:'1rem'}} />} 
                    style={{ width:'9.5rem' }}
                    className='bn-center'
                    onClick={()=>setOpenProducts(false)}
                >Back</Button>
            </Flex>
        </Col>
        <Col span={12} className='p-0'>
            <Flex gap={4} justify='end'>
                <Button 
                    form={productFormName}
                    htmlType='submit'
                    icon={<SaveOutlined style={{fontSize:'1rem'}} />} 
                    type='primary' style={{ width:'9.5rem' }} 
                >Save</Button>
            </Flex>
        </Col>
    </Row>         
  );  

  return (
    <div className='quotation-manage'>
    <div id="quotation-manage" className='px-0 sm:px-0 md:px-8 lg:px-8'>
      <Space direction='vertical' className='flex gap-4'>
        {SectionTop}
          <Form form={form} layout='vertical'className='width-100' autoComplete='off' >
            <Card title={<>
              <Row className='m-0 py-3 sm:py-0' gutter={[12,12]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Typography.Title level={3} className='m-0' >QUOTATION NO : {quotCode}</Typography.Title> 
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  <Flex gap={10} align='center' className='justify-start sm:justify-end'>
                    <Typography.Title level={3} className='m-0' >QUOTATION DATE : </Typography.Title>
                    <Form.Item name="quotdate" className='!m-0'>
                      <DatePicker className='input-40' allowClear={false} onChange={handleQuotDate} />
                    </Form.Item>
                  </Flex> 
                </Col>
              </Row>
            </>} >
                <Row className='m-0' gutter={[12,12]}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Divider orientation="left" className='!mb-3 !mt-1'> Customer </Divider>
                    <Card style={cardStyle} > 
                      {SectionCustomer}
                    </Card>          
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <Divider orientation="left" className='!mb-3 !mt-1'> Quotations Details </Divider>
                    <Card  style={cardStyle} > 
                      {SectionQuotation}
                    </Card>         
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Divider orientation="left" className='!mb-3 !mt-1'> Quotations Banks </Divider>
                    <Card  style={cardStyle} className={`border-spacing-1 ${(submited && quotBanks.length < 1 ? 'border-red-500' : 'border-transparent')}`} > 
                      {SectionBanks}
                    </Card>         
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Divider orientation="left" className='!mb-3 !mt-1'> Quotations Products </Divider>
                    <Card  style={cardStyle} className={`border-spacing-1 ${(submited && quotDetails.length < 1 ? 'border-red-500' : 'border-transparent')}`}> 
                      {SectionProduct}
                    </Card>         
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <Divider orientation="left" className='!mb-3 !mt-1'> Quotations Other </Divider>
                    <Card  style={cardStyle} > 
                      {SectionOther}
                    </Card>         
                  </Col>
                </Row>
            </Card>
          </Form> 
        {SectionBottom}        
      </Space>

    </div>

    { openCustomer && (
        <ModalCustomers show={openCustomer} close={() => setOpenCustomer(false)} values={(v)=>{handleChoosedCustomer(v)}} ></ModalCustomers>
    )}

    { openBanks && (
        <ModalBanks show={openBanks} close={() => setOpenBanks(false)} values={(v)=>{handleChoosedBanks(v)}} selected={quotBanks} ></ModalBanks>
    )}
    <Drawer
        title={manageConfig?.title}
        onClose={() => { setOpenProducts(false); }}
        open={openProducts}
        width='40vw'
        // style={{transform: 'translateX(0px)'}}
        className="responsive-drawer"
        getContainer={() => document.querySelector(".quotation-manage")}
        footer={SectionDrawerButtonBottom}
        afterOpenChange={(e)=>{
          if(!e) { 
            //console.log("closed")
          }
        }}
        maskClosable={false}
        push={false}
    > 
        { openProducts && (
        <QuotationManageForm 
          confirm={handleConfirmProduct} 
          formName={productFormName}
          mode={manageConfig?.action} 
          config={manageConfig} 
          source={form.getFieldsValue()}
          list={quotDetails}
        /> )}
    </Drawer>     
    </div>
  )
}

export default QuotationManage