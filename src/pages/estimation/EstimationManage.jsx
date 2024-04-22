/* eslint-disable react-hooks/exhaustive-deps */
import React, {   useEffect, useState } from 'react';
import { Card, Collapse, Descriptions, Dropdown, Empty, Form, Input, InputNumber, Table, Typography, message } from 'antd';
import { Button, Col, Flex, Row, Space, Divider } from 'antd';
import { ButtonBack } from '../../components/button';
import { SaveFilled, SettingOutlined } from '@ant-design/icons';
import { TbFileSearch } from 'react-icons/tb';
import { LuPackageSearch, LuPrinter } from "react-icons/lu";
import { TiDelete } from "react-icons/ti";

import { ModalSamplePreparation } from "../../components/modal/sample-preparation/modal-sample-preparation";
import { ModalPackingSet } from "../../components/modal/packing-set"
import EstimationTable from './EstimationTable';

import { sampleCostColumn, collapseSetting } from "./estimation.model";

import EstimationService from '../../service/Estimation.service';
import { delay, formatCommaNumber } from '../../utils/util';

import dayjs from 'dayjs'; 

import EsContext from '../../store/context/estimation-context'
import { useLocation, useNavigate } from 'react-router-dom';

const estservice =  EstimationService();

const columnSpc = sampleCostColumn();

const esActive = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const packSelect = [];
// const defaultList = ['labour cost', 'overhead', 'packing cost'];
function EstimationManage() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const [form] = Form.useForm();
  const { config } = location.state || {config:null};
  
  const [openSPModal, setOpenSPModal] = useState(false);
  const [openPackingSetModal, setOpenPackingSetModal] = useState(false);

  const [spData, setSpData] = useState({});
  const [spCostData, setSpCostData] = useState({});
  const [spcostTbData, setSpcostTbData] = useState([]);
  // const [packingCostSource, setPackingCostSource] = useState([]);
  const [packingCostSource, setPackingCostSource] = useState([]);
  const [packingSetData, setPackingSetData] = useState([]);
  // const [packingCostActive, setPackingCostActive] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  
  // const [descriptionValue, setDescriptionValue] = useState(null);
  const [productCost, setproductCost] = useState(0);

  const [esResult, setEsResult] = useState({});
  // const [esResultChange, setEsResultChange] = useState([]);

  const [choosed, setChoosed] = useState(false); 

  const handleChooseValue = (v) => {
    setSpData( state => ({...state, ...v}) );
    estservice.spcost( v?.spcode || "").then( r => {
      const { data: {spcost} } = r.data;
      setSpCostData(spcost); 
      handleEstimateSampleCost(spcost);
    }).catch( err => {
      setChoosed(false);
      message.error("Getting sample fail.")
      console.warn(err);
    });
  }

  const handleChoosePackingSet = (value) => {
    console.clear();
    // console.log(packSelect, value )
    const newValue = packSelect.length < 1 ? value : value.filter( f => {  
      let a = !packSelect.find( d =>  d === f?.id);  
      return a; 
    });

    if( newValue.length < 1 ) return;

    const arrId = newValue.map( m => m?.id );

    packSelect.splice(0, packSelect.length);
    value.forEach( ( d ) => packSelect.push(d.id) );
    
    setPackingSetData( value );
    estservice.packingsetCost( `${arrId?.join(',')}` ).then( r => { 
      const { data:{ packing } } = r.data; 
      const pkArr = [];  
      for( let v of packing ){
        const pksid = [ ...new Set(v.map( m => m.packingsetid)) ];
        const h = value.find( d => Number(d.id) === Number(pksid) ); 
        const { labour_cost, overhead, packing_labour_cost } = h;
        pkArr.push( { 
          header: {...h, margin: 25 }, 
          source: [
            ...v.map( m => {
              const c = ( Number(m?.price || 0) + Number(m?.transport || 0) ) / (1 - ( Number( m?.lost || 0 ) / 100 ) );
              return {
                ...m, 
                cost:parseFloat(c).toFixed(2),
                cost_carton: parseFloat(c *  Number( m?.pcs_carton || 0).toFixed(2)),
                weight_carton: parseFloat(Number(m?.weight_unit || 0) *  Number( m?.pcs_carton || 0).toFixed(2))
              }
            }), 
            ...([
              {name:"Labour cost", val:Number(labour_cost)},
              {name:"Overhead", val:Number(overhead)},
              {name:"Packing labour cost", val:Number(packing_labour_cost)},
            ].map( (m, i) => (
            {
              id: `next-${packing?.length + (i+1)}`,
              packingsetid: h?.packingsetid,
              pcs_carton: h?.unit_cost,
              pkcode: null,
              pkname: m.name,
              price: m.val,
              transport: null,
              lost: null,
              weight_unit: 0,
              weight_carton:0,
              cost: m.val,
              cost_carton: m.val *  Number( h?.unit_cost || 0)
            })))
          ]
        });
      }

      setPackingCostSource( state => [ ...state, ...pkArr ] );

    }).catch( err => {
      message.error("Getting sample fail.")
      console.warn(err);
    });
    // const item = value.map( (m) => ({
    //   ...m,
    //   lost:Number( m?.lost || 0 ) * 100,
    //   transport:Number(m?.transport || 0),
    //   cost:Number( m?.cost || ( Number(m?.price || 0) + Number(m?.transport || 0) ) / (1 - (Number( m?.lost || 0 )) ) || 0 ),
    //   pcs_carton: m?.pcs_carton || null,
    // })); 
    
    // setListDetail( item ); 
  }; 

  const handleClose = async () => {
    navigate("/estimation", {replace:true});
    await delay(300);
    console.clear();
  }

  const handleEstimateSampleCost = (spcost) => {
    const step = [ ...new Set(spcost.map( m => m.stepno )) ];

    let step_total_price = 0;
    let step_total_price_after_lost = 0;
    let tbdata = [];

    for( let ind in step ){
      const stp = step[ind];
      const d = spcost.filter( d => d.stepno === stp );
      const lost = Number( d[0]?.lost || 0 ); 
      const amount_total = Number( d[0]?.amount_total || 0 );
      const amount_after_lost = Number( d[0]?.amount_after_lost || 0 );
      const weight_total = Number(stp) >  1 ? amount_total : d?.reduce( (a, v) =>  a + Number(v?.amount || 0) * Number( v?.multiply || 0), 0);
      const weight_after_lost =  Number(stp) >  1 ? amount_after_lost : weight_total * ( 1 - (lost/100) );
   
      for( let i in d ){
        let f = d[i]; 
        if( Number(stp) >  1 && Number(i) === 0 ) {
          f.stcode = `Step ${Number(stp)}`; 
          f.stname = `Paste from step ${Number(stp) - 1}`; 
          f.price = step_total_price_after_lost;
          f.yield = 100;
          f.multiply = 1;
        }

        const cost = ( ( Number(f?.amount || 0) / ( Number( f?.yield || 1 ) / 100 ) ) / weight_after_lost ) * Number( f?.price || 0 ); 
        
        
        d[i] = {
          ...f,
          spno: Number(i)+1,
          weight_in_process : Number(f?.amount || 0) * Number( f?.multiply || 0),
          sample_cost: cost,
        };  
      };

      step_total_price = d?.reduce( (a, v) =>  a + parseFloat(Number(v?.sample_cost || 0).toFixed(2)), 0);    
      step_total_price_after_lost = step_total_price / ( 1 - (lost/100) );
      tbdata = [
        ...tbdata,
        ...d,
        {
          id : `${stp}-total`,
          stname : `Total`,
          weight_in_process : weight_total,
          sample_cost : step_total_price
        },
        {
          id : `${stp}-lost`,
          stname : `Lost`,
          weight_in_process : lost,
        },
        {
          id : `${stp}-after`,
          stname : `Weight After Lost`,
          weight_in_process : weight_after_lost,
          sample_cost: step_total_price_after_lost,
        },
      ];

      if( ind < step.length - 1 )  tbdata.push( {id : `next to step ${ind+2}`} );
    }

    setproductCost( step_total_price_after_lost );
    setSpcostTbData(tbdata);
    
    setChoosed(true);
  }

  const handleConfirm = () => {
    const { remark } = form.getFieldValue();
    const head = {
      estcode: spData?.estcode,
      spname : spData.spname,
      spcode : spData.spcode,
      product_cost : productCost,
      specific_gravity : spData.specific_gravity,
      remark : remark,
    } 
 
    if( Object.keys( esResult ).length < 1 ){ 
      message.error("Please select Packing for Estimate Cost")
      return;
    }

    // console.log( Object.keys( esResult ), esResult);
    const detail = Object.values(esResult).map( item => {
      const { header, estimation } = item;
      return {
        packingsetid : header.id,
        fill_volume : header.fill_volume,
        declared : header.declared,
        margin : header.margin,
        unit_cost : header.unit_cost,
        gross_weight_carton : header.gross_weight_carton,
        ...estimation,
      }
    })

    const list = Object.values(esResult).map( item => {
      const { source, header } = item;
      return [ ...(source.map( m => ({...m, packingsetid:header.id}))) ]
    });

    const sample = { ...spCostData };

    // console.log({head, detail, list});
    const actions = config?.action !== "create" ? estservice.update( {head, detail, list, sample} ) : estservice.create( {head, detail, list, sample} );
    actions.then( r => {
      handleClose().then( r => {
        message.success("Request Estimate Cost success.");

      });
    }).catch( err => {
      message.error("Request Estimate Cost fail.")
      console.warn(err);      
    })
  } 
  
  const handlePrint = () => {
    const newWindow = window.open('', '_blank');
    newWindow.location.href = `/est-print/${spData.estcode}`;
  };

  const TableSpcost = () => {
    return (
      <Table 
        size='small'
        dataSource={spcostTbData}
        columns={columnSpc}
        pagination={false}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        locale = {{ emptyText: <span>No data available, please add some data.</span> }}
      />
    )
  }

  const spcostItems = () => {
    return [
      {
        key: '1',
        label: (
          <>
            <Flex align='baseline'>
              <Typography.Text className='m-0 min-w-32 text-md text-gray-500 font-semibold border-r'> Product Cost </Typography.Text>
              <Typography.Text className='text-md text-gray-500 ps-2 '> {formatCommaNumber(productCost)} Bath/Kg </Typography.Text>
            </Flex>
          </>
        ),
        children: <TableSpcost />,
        showArrow: false
      },
    ]
  } 

  const dsItems = () => {
    const master = spData;
    return [
      { 
        label: 'Sample Preparation No.', 
        labelStyle: { verticalAlign:'top', maxWidth:205, minWidth:120 },
        contentStyle: { verticalAlign:'top', minWidth:'20vw' },
        children: master.spcode, 
        span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 } 
      },
      { 
        label: 'Sample Preparation Date.', 
        labelStyle: { verticalAlign:'top', maxWidth:205, minWidth:120 },
        style: { verticalAlign:'top', minWidth:'20vw' },
        children: !!master.spdate && dayjs(master.spdate).format("DD/MM/YYYY"), 
        span: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 } 
      },      
      { 
        label: 'Sample Preparation Name.', 
        labelStyle: { verticalAlign:'top', maxWidth:205, minWidth:120 },
        children: master.spname, 
        span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 } 
      },
      { 
        label: 'Specific Gravity.', 
        labelStyle: { verticalAlign:'top', maxWidth:205, minWidth:120 }, 
        children: (
          <InputNumber 
          min={0}
          onChange={(e) => { setSpData( (state) => ({ ...state, specific_gravity: e})) } } 
          value={spData?.specific_gravity || 0} 
          controls={false} 
          placeholder='Enter Specific Gravity.'
          // className={ !spData?.specific_gravity && `border-1 border-rose-600` }
          style={{ width: '100%' }}
          />
        ) , 
        span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 },
      },
    ]
  }

  const packingItems = () => {
    
    const item = packingCostSource.map( ( m, i ) => { 
      const { header, source } = m;
      return { 
        key: i, 
        label: ( 
          <Flex align='baseline'>
            <Typography.Text className='m-0 min-w-44 text-md text-gray-500 font-semibold border-r !pe-3 tracking-wide'> {header?.packingset_name} </Typography.Text>
            {!!esResult[`${i}-packing-${header?.id}`] && 
            <Typography.Text className='text-md text-gray-500 ps-2 '> 
              {formatCommaNumber(esResult[`${i}-packing-${header?.id}`]?.estimation?.exworksell_price || 0)} Baht
            </Typography.Text>}
          </Flex>     
        ), 
        children: (
          <EsContext.Provider value={{product:spData}}>
            <EstimationTable 
              index={i}
              source={source} 
              header={header} 
              product={ {...spData, product_cost:productCost} } 
              change={ (e, index) => {
                const { header:h } = e;
                if( Object.keys(h).length === 0 ) return;
                //  console.log( h?.id, h);

                // setPackingCostSource( state => {
                //   return state.map( (item, i) => i === index ? { ...item, source : s } : item  )
                // })
                setEsResult( state => ({ ...state, [`${index}-packing-${h?.id}`] : e }) );
              }} 
            /> 
          </EsContext.Provider>
        ), 
        extra:genExtra(i),
      };   
    }); 

    
    return item;
  }

  const dropdownCollopsePackingSetItems = (index = 0) => {
    const del = (ind) =>{
      const item = packingCostSource.find( (_, d) => d === ind);
      const { header } = item;

      const itemDetail  = [...packingCostSource];
      const newData = itemDetail.filter ( (item, i) => item.header?.id !== header?.id ).map( (m) => {
        const { header:h } = m;
        const idx = itemDetail.findIndex( d => d.header.id === h.id );
        return {
          ...m,
          header: {...esResult[`${idx}-packing-${h?.id}`]?.header},
          source: [...esResult[`${idx}-packing-${h?.id}`]?.source]
        } 
      });
      setPackingCostSource([...newData]); 

      // setPackingCostSource( state => state?.filter( (_, i) => ind !== i) );
      setPackingSetData( state => state?.filter( (_, i) => ind !== i) );
      packSelect.splice(ind, 1);
      // console.log( esResult, ind );
      setEsResult( state => {
        delete state[`${index}-packing-${header?.id}`];
        const newState = {} 
        for(let nd in Object.keys(state) ){
          const k = Object.keys(state)[nd];
          const { header:h } = state[k];
          newState[`${nd}-packing-${h?.id}`] = state[k];
        }
        return newState;
      }); 
    }
    return [
      {
        key: '1',
        label: (
          <Typography.Link onClick={()=>del(index)}>
            <Flex align='center' gap={4} >
              <TiDelete style={{fill: "red"}} /> 
              <Typography.Text> Delete Packing Set</Typography.Text>
            </Flex>
          </Typography.Link>
        ),
      }
    ]
  }

  const genExtra = (i) => (
    <Dropdown
      menu={{ items : dropdownCollopsePackingSetItems(i) }}
      placement="bottomRight" 
      arrow={{ pointAtCenter: true, }}
    >
      <SettingOutlined />
    </Dropdown> 
  );

  const settingCollopseSpcost = () => collapseSetting('header', [1], spcostItems(), {bordered:false });
  const settingCollopsePackingSet = () => collapseSetting('header', esActive, packingItems(), {bordered:true, expandIconPosition:"end" });
 

  const init = (code)  => {
    estservice.get( code ).then( async res => {
      const { data : { head, detail, list, sample } } = res.data;

      if( sample.length > 1){
        handleEstimateSampleCost( sample );

        setSpData( head );
        setSpCostData( sample );
      } else {

        handleChooseValue( head );
      } 


      const pkArr = []; 
      for( let ind in list ){

        const h = detail[ind];
        const v = list[ind];
        pkArr.push( { 
          header: {...h}, 
          source: [...v]
        }); 
      } 
      packSelect.splice(0, packSelect.length);
      detail.forEach( ( d ) => packSelect.push(d.packingsetid) );

      setPackingSetData( [...detail.map( m => ({...m,  id:m.packingsetid}))] );
      setPackingCostSource( pkArr );
      setTimeout( ()  => {
        form?.setFieldValue("remark" , head.remark );
      }, 480);
    }).catch( err => {
      console.log(err);
      message.error("Error getting infomation Estimation.")
    })    
  }

  useEffect( () => {
    // esActive.splice(0, esActive.length);
    const max = Math.max( ...esActive )
    if( packingCostSource.length > 0 && packingCostSource.length % (max - 1) === 0 ){
        for( let i = 1; i <= 10; i++) esActive.push(max+i)
    } 
  }, [ packingCostSource.length ]);

  useEffect( () => {
    // esActive.splice(0, esActive.length);
    if(!config) { 
      handleClose();
      return;
    }

    if(config?.action !== "create"){
      init(config.code);
    }
    return () => { 
      setChoosed(false);

      packSelect.splice(0, packSelect.length);
    }
  }, []);

  const SectionTop = (
    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
      <Col span={12} className='p-0'>
          <Flex gap={4} justify='start'>
            <ButtonBack target="/estimation" /> 
          </Flex>
      </Col>
      <Col span={12} style={{paddingInline:0}}>  
          <Flex gap={4} justify='end'>
            { !!spData.estcode && 
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
            <ButtonBack target="/estimation" />
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

  const SectionChooseProduct = (
    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0 items-center'>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
        <Flex align='center' className='justify-center md:justify-start lg:justify-start xl:justify-start'>
          <Typography.Title level={3} className='m-0'>Estimate Cost for Sample</Typography.Title>
        </Flex>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
        <Flex align='center' className='justify-center md:justify-end lg:justify-end xl:justify-end'>
          <Button  className='bn-center bn-primary-outline' icon={<TbFileSearch style={{fontSize:'1.34rem'}} />} onClick={() => setOpenSPModal(true) } >
            Select Sample Preparation
          </Button> 
        </Flex>
      </Col>
    </Row>     
  );

  const SectionChoosePackingSet = (
    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0 items-center'>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
        <Flex align='center' className='justify-center md:justify-start lg:justify-start xl:justify-start'>
          <Typography.Title level={3} className='m-0'>Packing Set of Product</Typography.Title>
        </Flex>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
        <Flex align='center' className='justify-center md:justify-end lg:justify-end xl:justify-end'>
          <Button  
            className='bn-center bn-primary-outline' 
            icon={<LuPackageSearch style={{fontSize:'1.34rem'}} />} 
            onClick={() => setOpenPackingSetModal(true) }
            disabled={!productCost}
          >
            Select Packing Set
          </Button> 
        </Flex>
      </Col>
    </Row>     
  );

  const SectionDescription = (
    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0 items-center'>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
        <Flex vertical align='top' className='justify-start md:justify-start lg:justify-start xl:justify-start width-100'>
          <Form form={form} layout='vertical' >
            <Form.Item name="remark" label="Description:">
              <Input.TextArea 
                rows={5} 
                placeholder='Enter Desctions' 
                // value={spData.remark}  
                // onChange={(e) => { setSpData( state => ( { ...state, remark: e.target.value } )) }}
              />
            </Form.Item>
          </Form> 

        </Flex>
      </Col> 
    </Row>     
  );
  
  return (
    <>
      <div id="estimation-manage" className='px-0 sm:px-0 md:px-8 lg:px-8'>
        <Space direction='vertical' className='flex gap-4' >
          {SectionTop}
          <Divider orientation="left" className='!my-0' >Product</Divider>
          <Card style={{backgroundColor:'#f0f0f0' }}> 
            {SectionChooseProduct}
          </Card> 
          { choosed ? 
            <>

              <Descriptions 
                bordered
                column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
                items={dsItems()} 
              />

              <Collapse className='bk-layout' {...settingCollopseSpcost()}  />

              <Divider orientation="left" className='!my-0' >Packing</Divider>
              <Card style={{backgroundColor:'#f0f0f0' }}> 
                {SectionChoosePackingSet}
              </Card>

              {packingCostSource.length > 0 && <Collapse className='bk-layout' {...settingCollopsePackingSet()}  />}
              <Card style={{backgroundColor:'#f0f0f0' }}> 
                {SectionDescription}
              </Card>
              {SectionBottom} 
            </> 
          : <Empty image={false} imageStyle={{display:'none'}} description={false}>Empty data for estimation. Please choose product.</Empty> }
        </Space> 

        { openSPModal && <ModalSamplePreparation show={openSPModal} close={() => setOpenSPModal(false)} values={handleChooseValue}  /> }

        { openPackingSetModal && 
          <ModalPackingSet 
            show={openPackingSetModal} 
            close={() => setOpenPackingSetModal(false)} 
            values={(v)=>{handleChoosePackingSet(v)}} 
            selected={packingSetData} 
          /> }
      </div>
    </>
  )
  

}

export default EstimationManage