/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Card, Form, Drawer, message, AutoComplete, Select, InputNumber } from "antd";
import { Row, Col, Space, Descriptions, Table, Typography } from "antd";
import { Input, DatePicker, Button } from "antd";
import { Collapse, theme } from 'antd';

import { 
    SearchOutlined,
    InboxOutlined, 
    ArrowLeftOutlined, 
    CaretRightOutlined, 
    PlusCircleOutlined, 
    SaveOutlined, 
    DeleteOutlined,
    CheckCircleFilled, 
} from "@ant-design/icons";
import { AiTwotoneCloseCircle } from "react-icons/ai"; 
import { spmaster, defaultParamenter } from "./sample-preparation.model.js"
import { componentsEditable, columnsParametersEditable } from "./sample-preparation.model.js";
import { formatCommaNumber } from "../../utils/util.js";

import { FileControl } from "../file-control/file-control.js";
import { TagsControl } from '../tags-control/index.js';
import { ModalCustomers } from "../../components/modal/customers/modal-customers.js"; 
// import { ModalPackages } from '../../components/modal/packages/modal-packages';
// import { ModalPackingSetSingle } from "../../components/modal/packing-set"
import { ModalPackagingSingle } from "../../components/modal/packaging/modal-packaging.js"

import { SamplePreparationTableStep } from "./sample-preparation.js";

import SamplePreparationService from "../../service/SamplePreparation.service.js";
import SampleRequestService from "../../service/SampleRequest.service.js";
import OptionService from '../../service/Options.service.js';
import dayjs from 'dayjs';


import { useSelector } from "react-redux"; 
import { reset, added, deleted, setValue } from "../../store/slices/sample-preparation.slices.js";
import { useAppDispatch } from "../../store/store.js";  
import { ModalSampleRequestDetail } from '../../components/modal/sample-request/modal-sample-request.js';
// const TextArea = Input.TextArea;

const sampleRequestService = SampleRequestService();
const spService = SamplePreparationService();
const opService = OptionService();
const refs = "Sample Preparation";

const allergenStandardsDefault = [
    {  value : "According to CODEX STAN 1-1985, REGULATION (EU) No 1169/2011" },
    {  value : "According to CODEX STAN 1-1985, NHFPC GB 7718-2011" },
    {  value : "According to MFDS : Food Labelling Standards (Notification No. 2019-97, 2019.10.28)" },
    {  value : "According to Food Allergen Labeling and Consumer Protection Act of 2004 (Public Law 108-282, Title II)" },
    {  value : "According to CODEX STAN 1-1985, Japan (CAA, 2019)" },
    {  value : "According to CODEX STAN 1-1985, According to FSANZ:Standard 1.2.3" },
    {  value : "According to CODEX STAN 1-1985, SFA 2019 Ingredients Hypersensitivity" },
    {  value : "According to CODEX STAN 1-1985, MOPH (Thailand) No. 367/2557 Labeling of  Prepackaged Foods" },
]

export default function SampleRequestForm( ) {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = theme.useToken();
    const dispatch = useAppDispatch();
    const samplePreparationReducer = useSelector((state) => state.samplePreparationSlice); 

    const { config } = location.state || {config:null};
    const [form] = Form.useForm();
    

    const [refcode, setRefcode] = useState(null);

    const [isOpenModalCustomer, setIsOpenModalCustomer] = useState(false);
    const [isOpenModalSampleRequest, setIsOpenModalSampleRequest] = useState(false);
    const [isOpenModalPackage, setIsOpenModalPackage] = useState(false);

    // const [srcodeOption, setSrcodeOption] = useState([]);
    const [parametersOption, setParametersOption] = useState([]);
    const [parametersOptionWrap, setParametersOptionWrap] = useState([]);

    const [tagsOption, setTagsOption] = useState([]);

    const [isOpenUpload, setIsOpenUpload] = useState(false); 

    // const [itemDetail, setItemDetail] = useState([]);
    const [parameters, setParameters] = useState(defaultParamenter);
    const [formDetail, setFormDetail] = useState(spmaster); 
    
    const [panelActive, setPanelActive] = useState(['1']);
    const [sampleDetails, setSampleDetails] = useState([]);

    const [submited, setSubmited] = useState(false);

    const [tag, setTag] = useState([]);
    // const [isOpenModal, setOpenModal] = useState(show); 
    // const [unitShelfLife, setUnitShelfLife] = useState("month");
    const [opStorageConditions, setOpStorageConditions] = useState([
      { value: 'Storage at ambient temperatue ( not over 40 deg C) and avoid sunlight.' }, 
    ]);



    const hendleClose = () => { 
        setTimeout( () => navigate("/sample-preparation" ), 400 ); 
    } 

    const gettingSRCode = () => {
        
        spService.spcode().then( async (res) => {
            const { data : code } = res.data;
            const year = dayjs().format("YY");
            const mon = dayjs().format("MM");
            setRefcode(`${year}-${mon}-${code}`);

            const initialValues = { ...spmaster, spcode:`${year}-${mon}-${code}-0`, spdate:dayjs() };

            setFormDetail(initialValues);
            form.setFieldsValue(initialValues);

            
        })
        .catch( err => {
            console.warn(err);
            const {message} = err.response;
            message.error( message || "error request"); 
        });
    }

    const gettingSamplePreparationData = () => {
        
        spService.get(config?.code).then( async (res) => {
            const {master, detail, params, tags} = res.data.data;
            // console.log({master, detail, params});
            const initialValues = { ...spmaster, ...master };
            initialValues.spdate  = dayjs(initialValues.spdate);

            if( !!initialValues.bbe_date  ) initialValues.bbe_date  = dayjs(initialValues.bbe_date).format("YYYY-MM-DD");

            setFormDetail(initialValues);
            form.setFieldsValue(initialValues); 
            setParameters([...params]);

            const t = tags.map(m => m.tags);
            setTag([...t]);

            dispatch(setValue({detail:detail}));
            // setItemDetail(data);
            if( !master?.bbe_date && !!master?.shelf_life_unit ) handleShelfLifeUnitChange(master?.shelf_life_unit);
        })
        .catch( err => {
            console.warn(err);
            const data = err?.response?.data;
            message.error( data?.message || "error request");
            
        });
    } 

    const handleChoosedCustomer = (value) => {
        const f = form.getFieldValue();
        const initialValues = { ...f, ...value};
        form.setFieldsValue(initialValues);
        setFormDetail(initialValues); 
    };

    const handleChoosedSampleRequest = (value) => {
        const f = form.getFieldValue();
        const initialValues = { 
            ...f, 
            srcode: value.srcode, 
            spname: value.spname, 
            pkcode: value.pkcode,
            pkname: value.pkname,
            srdetailid: !!value.id ? Number(value.id) : null,
        };
        form.setFieldsValue(initialValues);
        setFormDetail(initialValues); 
    };

    const handleChoosedPackages = (value) => {
        const f = form.getFieldValue();
        // const initialValues = { ...f, pkcode: value.id, pkname: value.packingset_name };
        const initialValues = { ...f, pkcode: value.expscode, pkname: value.pkname };
        form.setFieldsValue(initialValues); 
        setFormDetail(initialValues); 
    };

    const handleAddStep = () => {
        dispatch(added());
    }

    const handleConfirm = () => { 
        // console.log(sampleDetails);
        setSubmited(true);            
        form.validateFields().then( value => {

            if(sampleDetails.length < 1) return;

            const master = { 
                ...value, 
                pkcode : formDetail.pkcode, 
                pkname : formDetail.pkname, 
                refcode: refcode,
                srcode : formDetail.srcode,
                specific_gravity:value?.specific_gravity || null,
                srdetailid : formDetail?.srdetailid || null,
                shelf_life_unit : formDetail?.shelf_life_unit || null,
            };
            const detail = sampleDetails;
            const params = parameters;
            const tags = tag;
            master.spdate = dayjs(master.srdate).format("YYYY-MM-DD");
            
            if(config.action === "create"){
                spService.create( {master, detail, params, tags} ).then( res => { 
                    message.success("Success: Create sample requerest done.");

                    
                    hendleClose();
                })
                .catch( err =>  {
                    message.error("Error: Create sample requerest fail.");
                    
                });         
            } else {
                spService.update( {master, detail, params, tags} ).then( res => { 
                    message.success("Success: Update sample requerest done.");

                    
                    hendleClose();
                })
                .catch( err =>  {
                    message.error("Error: Update sample requerest fail.");
                    
                });
            } 
        })

    }

    const handleGetPercentTotal = () => {
        let total = 0;
        for( let rd of samplePreparationReducer ) {
            total += rd.details.reduce( (acc, val) => acc + val?.totalpercent || 0, 0);
        }
        return total;
    }

    const handleSave = (row) => { 
        const newData = (r) => { 
            const newData = [...parameters];
            
            const ind = newData.findIndex( (item) => row.seq === item?.seq );
            const item = newData[ind];
            
            newData.splice(ind, 1, {
                ...item,
                ...row,
            });
            return newData;
        } 
        setParameters([...newData()]);
    };

    const handleDelete = (code, seq) => { 
        const newData = parameters.filter((val) => val?.seq !== seq ).map( (m, i) => ({...m, seq:i+1 }));
        setParameters([...newData]);
    };

    const handleAction = (record) => { 
        return parameters.length >= 1 ? (
          <Button
            className="bt-icon"
            size='small'
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record?.paraname, record.seq)} 
          />
        ) : null
    }
    
    const handleAddParameter = () => {
        setParameters([...parameters, {
            seq:parameters.length + 1,
            paraname:`parameter ${parameters.length + 1}`,
            preparation:null,
            cutout:null,
            remark:null,
        }]);
    }

    const handleParameterChoosed = () => {
        const svalue = [...parameters];
        const nameChoose = parametersOption.filter( d => !svalue.find( f => (f.paraname === d.value) ) );

        setParametersOptionWrap([...nameChoose]); 
    }

    const handleTags = (val) => {
        setTag([...val]);
    }

    const handleShelfLifeUnitChange = (e) => {
        const { spdate, shelf_life } = form.getFieldValue();
        setFormDetail( state => ({...state, shelf_life_unit:e}) );

        if( !!spdate && !!shelf_life ) {
            const newDateAfterAdding = dayjs(spdate).add(Number(shelf_life), e);
            const nDateFormet =  newDateAfterAdding.format("YYYY-MM-DD");

            setFormDetail( state => ({...state, bbe_date:nDateFormet}) );
            form.setFieldValue("bbe_date", nDateFormet);
        } 
        
    }

    const handleShelfLifeChange = (e) => {
        const { spdate } = form.getFieldValue();
        const { shelf_life_unit } = formDetail;

        if( !!spdate && !isNaN(e) ) {
            const newDateAfterAdding = dayjs(spdate).add(Number(e), shelf_life_unit);
            const nDateFormet =  newDateAfterAdding.format("YYYY-MM-DD");

            setFormDetail( state => ({...state, bbe_date:nDateFormet}) );
            form.setFieldValue("bbe_date", nDateFormet);
        } 
        
    }


    const column = columnsParametersEditable(handleSave, {handleAction, nameOption:parametersOptionWrap});

    useEffect( ()=>{

        const initeial = async () => {
            const [
            parmptionRes,
            tagsOptionRes, 
            storageConditionsOptionRes,
            ] = await Promise.all([
                sampleRequestService.parametersOption(),
                spService.get_sptags(), 
                opService.optionsSamplePraparation({p:"storage_conditions"}),
            ]); 
            const {data:param} = parmptionRes.data;
            const {data:tags} = tagsOptionRes.data; 
            const {data:scOption} = storageConditionsOptionRes.data;
            const opn_parameter = param.map( v => ({value:v.text}));

            setParametersOption( opn_parameter );
            setParametersOptionWrap( opn_parameter );
 
            if( scOption.length > 0 ) setOpStorageConditions( scOption );
            
            const opn_tags = tags.map( v => ({value:v.text}));
            setTagsOption( opn_tags );            
        }

        if(!config) { 
            hendleClose();
            return;
        }

        if(config?.action !== "create"){
            gettingSamplePreparationData();
        }else{
            gettingSRCode();
            
        }

        initeial();
        // const res = await sampleRequestService.sampleRequestOption(); 
        // const {data} = res.data; 
        // const opn = data.map( v => ({value:v.text}));
        // setSrcodeOption( opn );

        return () => { 
            dispatch(reset()); 
         };
    }, []);
    
    useEffect( ()=>{ 
        const a = samplePreparationReducer?.filter( (f, i) => i === 0 || f.total > 0 ).map( (_, i) => `${i+1}` ); 
        setPanelActive(a);
        let detailData = [];
        for( let d of samplePreparationReducer){
            detailData = [...detailData, ...d.details.map( m => ({...m, lost:d.lost, amount_total:d.total,  amount_after_lost:d.afterLost}))];

        }        
        setSampleDetails([...detailData]); 
    }, [JSON.stringify(samplePreparationReducer)]);

    useEffect( ()=>{ 
        handleParameterChoosed();
        // console.log("paramer name choosed"); 
    }, [JSON.stringify(parameters.map( m => m.paraname ))]);

    const genExtra = (i) => ( 
      i > 0 && <DeleteOutlined
        style={{ fontSize: '16px', color: '#f00' }}
        onClick={ (event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
          let payload = { index : i }

          dispatch(deleted(payload)); 
        }}
      />
    );

    const collapseItems = (index) => { 
        const v = [{
            key: `${index + 1}`,
            label: `Step ${index+1}`,
            children: <SamplePreparationTableStep index={index} />,
            style: { 
                background: "#fff",
                borderRadius: token.borderRadiusLG,
                border: !!submited && sampleDetails.length < 1 ? '1px solid #ff4d4f' : '1px solid #fff',
            }, 
            className: "collapse ant-card",
            disabled:true,
            extra: genExtra(index)
        }]; 
        return v; 
    }
 
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
            {config?.action !== "create" && <Button style={{ width: 120 }} type="primary" icon={ <InboxOutlined /> } onClick={ () => { setIsOpenUpload(true)} } >
                อัพโหลด
            </Button>}
        </Space>
    ); 

    return (
    <> 
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative', paddingInline:"1.34rem" }} className='sample-request-modal' >
            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
               <Col span={12} style={{paddingInline:0}}>{ ButtonActionSrDetailLeft }</Col>
               <Col span={12} style={{paddingInline:0}}>{ ButtonActionSrDetailRight }</Col>
            </Row>     
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={14} md={15} lg={15} xl={15}>   
                    <Card>
                        <Form form={form} layout="vertical" autoComplete="off" > 
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col xs={24} sm={24} md={20} lg={12} xl={12}>
                                    <Form.Item label="SR No :" >
                                        <Space.Compact style={{ width: '100%' }}>
                                            <Input 
                                            readOnly 
                                            placeholder='SR No'
                                            className='input-40'
                                            value={ !!formDetail.srcode ? formDetail.srcode : ""}  
                                            suffix={(
                                                <Typography.Link 
                                                    style={{
                                                        lineHeight:'0.1rem', 
                                                        visibility:!!formDetail.srcode ? 'visible' : 'hidden' }}
                                                    onClick={() => { 
                                                        setFormDetail( (state) => ({...state, srcode:null} )) 
                                                    }}
                                                >
                                                    <AiTwotoneCloseCircle />
                                                </Typography.Link>
                                            )}                                            
                                            />
                                            <Button type="primary" className='bn-comp' icon={<SearchOutlined />} onClick={() => setIsOpenModalSampleRequest(true)} style={{minWidth:40}} ></Button>
                                        </Space.Compact> 
                                    </Form.Item>
                                </Col>                          
                                {/* <Col xs={24} sm={24} md={20} lg={6} xl={6}>
                                    <Form.Item label="ลูกค้า :" name="cuscode" >
                                        <Space.Compact style={{ width: '100%' }}>
                                            <Input readOnly placeholder='ลูกค้า' value={ !!formDetail.cuscode ? `${formDetail.cuscode} - ${formDetail.cusname}` : ""}  />
                                            <Button type="primary" icon={<SearchOutlined />} onClick={() => setIsOpenModalCustomer(true)} style={{minWidth:40}} ></Button>
                                        </Space.Compact> 
                                    </Form.Item>
                                </Col>                         */}
                                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                    <Form.Item label="Preparation Date :" name="spdate" rules={[ { required: true, message: "Please input your data!", } ]}>
                                        <DatePicker size="large" style={{ width: "100%", }} />
                                    </Form.Item>
                                </Col> 

                                <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                                    <Form.Item label="Sample No :" name="spcode" rules={[ { required: true, message: "Please input your data!", } ]} >
                                        <Input readOnly placeholder='Sample No' onChange={(e) => { setFormDetail( { ...formDetail, spcode: e.target.value }) }} />
                                    </Form.Item>                        
                                </Col>

                                <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                                    <Form.Item label="Sample Name :" name="spname" rules={[ { required: true, message: "Please input your data!", } ]} >
                                        <Input placeholder='Sample Name' />
                                    </Form.Item>                        
                                </Col> 

                                <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                                    <Form.Item label="Previous No :" name="previous_code" >
                                        <Input placeholder='Previous No' />
                                    </Form.Item>                        
                                </Col> 

                                <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                                    <Form.Item label="Package :" >
                                        <Space.Compact style={{ width: '100%', height:40 }}>
                                            <Input 
                                            readOnly 
                                            placeholder='Choose Package.' 
                                            className='input-40'
                                            value={ !!formDetail.pkname ? formDetail.pkname : ""} 
                                            suffix={(
                                                <Typography.Link 
                                                    style={{
                                                        lineHeight:'0.1rem', 
                                                        visibility:!!formDetail.pkname ? 'visible' : 'hidden' }}
                                                    onClick={() => { 
                                                        setFormDetail( (state) => ({...state, pkcode:null, pkname:null} )) 
                                                    } }
                                                >
                                                    <AiTwotoneCloseCircle />
                                                </Typography.Link>
                                            )}  
                                            />
                                            <Button type="primary" className='bn-comp' icon={<SearchOutlined />} onClick={() => setIsOpenModalPackage(true)} style={{minWidth:40}} ></Button>
                                        </Space.Compact> 
                                    </Form.Item>
                                </Col>   

                                <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                                    <Form.Item label="Net weight :" name="netweight" >
                                        <Input placeholder='Net weight'  />
                                    </Form.Item>    
                                </Col> 

                                <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                                    <Form.Item label="Specific Gravity :" name="specific_gravity" >
                                        <Input placeholder='Specific Gravity' />
                                    </Form.Item>    
                                </Col> 
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                    <Form.Item label="Remark :" name="description">
                                        <Input.TextArea  
                                            style={{ width:'100%' }}   
                                            placeholder="Enter a longer text..."  
                                            rows={8}
                                        />   
                                    </Form.Item>    
                                </Col>                                 
                            </Row>  
                        </Form>
                    </Card>                 
                </Col>                        
                <Col xs={24} sm={10} md={9} lg={9} xl={9}> 
                    <TagsControl source={tag} choose={(v) => handleTags(v) } options={tagsOption}></TagsControl>  
                </Col>
            </Row>  
            {samplePreparationReducer?.map( (item, index) => {
                return (
                <Collapse 
                    key={index}
                    collapsible={ index > 0 && item?.total === 0 ? "disabled" : "icon" } 
                    activeKey={panelActive} 
                    bordered={false}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    style={{
                        background: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                    items={collapseItems(index)}
                />)}
            )}

            {samplePreparationReducer.length < 2 && ( 
            <Row> 
                <Col span={24} style={{display:'flex', justifyContent:'center'}} className='width-100 append-step' >
                    <Button 
                        shape="circle" icon={<PlusCircleOutlined />} 
                        style={{width:'2.5rem', boxShadow:'none', lineHeight: '2.5rem'}} 
                        onClick={()=>{ handleAddStep() }}  
                    ></Button>
                </Col>
            </Row>
            )}

            {panelActive.length > 0 && ( 
            <Card>
                <Descriptions
                    title="Summary Descriptions"
                    bordered
                    column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                    items={[
                        {
                            label: 'Summary % (Total)',
                            labelStyle:{width: 180},
                            span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 },
                            children: `${formatCommaNumber( handleGetPercentTotal() * 100 )}%`,
                        },
                    ]}
                />
            </Card>
            )}

            <Card>
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} className='sample-request-modal' >
                    <Table 
                        title={() => <Typography.Title level={3} className='m-0 !text-zinc-50'>List of Parameters</Typography.Title>}
                        components={componentsEditable}
                        rowClassName={() => "editable-row"}
                        bordered
                        dataSource={parameters || []}
                        columns={column}
                        pagination={false}
                        rowKey="seq"
                        locale = {{ emptyText: <span>No data available, please add some data.</span> }}
                        scroll={{ x: 'max-content' }} size='small' 
                    />
                    <Row style={{paddingInline:14}}> 
                        <Col span={24} style={{display:'flex', justifyContent:'center'}} className='width-100 append-step' >
                            <Button 
                                shape="circle" icon={<PlusCircleOutlined />} 
                                style={{width:'2.5rem', boxShadow:'none', lineHeight: '2.5rem'}} 
                                onClick={()=>{ handleAddParameter() }}  
                            ></Button>
                        </Col>
                    </Row>   
                </Space> 
            </Card>
            <Card>
                <Form form={form} layout="vertical" autoComplete="off" > 
                    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'> 
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                            <Form.Item label="Allergenic & intolerance: " name="allergen_standards" > 
                                <AutoComplete  
                                    style={{ height:40, width:'100%' }} 
                                    options={allergenStandardsDefault}
                                    placeholder="Enter Shelf life."
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                    allowClear
                                />                             
                            </Form.Item>    
                        </Col> 

                        <Col xs={24} sm={24} md={24} lg={4} xl={4} >
                            <Form.Item label="Shelf life :" name="shelf_life" >
                                <InputNumber
                                    controls={false}
                                    onBlur={(e)=>{handleShelfLifeChange(e.target.value)}}
                                    addonAfter={(
                                    <Select 
                                     className='shelf-unit-select'
                                     value={formDetail.shelf_life_unit}
                                     onChange={(e) => handleShelfLifeUnitChange(e)}  
                                     style={{ width: 110, paddingInline:6 }}  
                                     menuItemSelectedIcon={<CheckCircleFilled />}
                                    >
                                        <Select.Option value="day">Days</Select.Option>
                                        <Select.Option value="week">Weeks</Select.Option>
                                        <Select.Option value="month">Months</Select.Option>
                                        <Select.Option value="year">Years</Select.Option>
                                    </Select>
                                    )}
                                    placeholder='Enter Shelf Life'
                                    min={0}
                                    style={{ width:'100%'}}
                                    className='input-40'
                                />   
                            </Form.Item>    
                        </Col> 

                        <Col xs={24} sm={24} md={24} lg={8} xl={8} >
                            <Form.Item label="Best Before End(BBE):" name="bbe_date" >
                                <Input placeholder='Enter Sample Date and Shelf life for set Base Before End' className='!bg-zinc-300' readOnly />  
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                            <Form.Item label="Storage Conditions :" name="storage_conditions" >
                                <AutoComplete  
                                    style={{ height:40, width:'100%' }} 
                                    options={opStorageConditions}
                                    placeholder="Enter Storage Conditions."
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                    allowClear
                                />   
                            </Form.Item>    
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                            <Form.Item label="Additional :" name="additional" >
                                <Input.TextArea placeholder="Enter Additional." allowClear />
                            </Form.Item>    
                        </Col>
                    </Row>  
                </Form>
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
                        disabled={!(panelActive.length > 0)} 
                    >ยืนยันบันทึก</Button>
                </Col>
            </Row>
        </Space> 
        
        <Drawer title="Upload" placement="right" size="large" open={isOpenUpload} onClose={()=>{ setIsOpenUpload(false) }} > 
            { isOpenUpload && (<FileControl title={`แนบไฟล์ สำหรับ ${refs} code : ${formDetail?.spcode}`} refcode = {formDetail?.spcode} refs={refs} noExpire={true} />)} 
        </Drawer>
  
        { isOpenModalCustomer && (
            <ModalCustomers show={isOpenModalCustomer} close={() => { setIsOpenModalCustomer(false) }} values={(v)=>{handleChoosedCustomer(v)}} ></ModalCustomers>
        )}
  
        { isOpenModalSampleRequest && (
            <ModalSampleRequestDetail show={isOpenModalSampleRequest} close={() => { setIsOpenModalSampleRequest(false) }} values={(v)=>{handleChoosedSampleRequest(v)}} />
        )}
        
        { isOpenModalPackage && (
            <ModalPackagingSingle show={isOpenModalPackage} close={() => { setIsOpenModalPackage(false) }} values={(v)=>{handleChoosedPackages(v)}} ></ModalPackagingSingle>
        )}
    </>)
}
