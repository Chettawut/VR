/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
// import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from 'react-to-print';

import "./est.css";
import logo from "../../../assets/images/logo_nsf.png"

import EstimationService from '../../../service/Estimation.service';
import { Button, Card, Flex, Space, Table, Typography, message } from 'antd';
import { sampleCostColumn, packingCostColumns } from './est.model';

import dayjs from "dayjs";
import { formatCommaNumber } from '../../../utils/util';
import { PiPrinterFill } from 'react-icons/pi';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';


const estservice = EstimationService();

function EstPrintPreview() {
    const { code } = useParams();
    const componentRef = useRef(null);
    const printRef = useRef(null);
    const handlePrint = useReactToPrint({
      documentTitle: "Print This Document",
      onBeforePrint: () => handleBeforePrint(),
      onAfterPrint: () => handleAfterPrint(),
      removeAfterPrint: true,
    });

    const [spData, setSpData] = useState({});
    const [spcostData, setSpcostData] = useState([]);

    const [packingCostSource, setPackingCostSource] = useState([]);
    const [productCost, setproductCost] = useState(0);
    
    const [newPageContent, setNewPageContent] = useState([]);
    const columnSpc = sampleCostColumn();
    const columnPck = packingCostColumns();

    const [loading, setLoading] = useState(false);

    const handleAfterPrint = () => { 
        setNewPageContent([]);
    }
    const handleBeforePrint = (e) => {
        console.log("before printing...")
        // const newElement = document.createElement('div');
        // newElement.id = 'new-container'; // Optional: Set an ID for the new container
        // newElement.innerHTML = 'TEST';
        // Render the new component into the new container 
    
        // Replace the old container with the new container
        // componentRef.current.innerHTML = 'TEST'; 
    }

    const handleCheckMultiPages = async () => {
        const limitPage = 1000; 
        setLoading(true);
       new Promise( r =>{
            const samples = document.getElementsByClassName("in-sample");
            const packing = document.getElementsByClassName("in-pack"); 

            const samplesPage =  [];
            const packingPage =  [];
            // console.log(samples, packing); 
            // console.log(componentRef.current);
            // let pageCount = 1;
            let hPageCheck = 0;
            let emlContent = [];
            for( let elm of samples ){
                const h = Number(window.getComputedStyle(elm).getPropertyValue('height')?.replace("px", ""));
                if( (hPageCheck + h) >  limitPage ){
                    console.log( { hPageCheck } ); 
                    samplesPage.push(emlContent); 
                    emlContent = [];
                    hPageCheck = 0;
                } else { 
                    hPageCheck += h;
                    emlContent =[...emlContent, elm];
                }
            }

            if(emlContent.length > 0 ) samplesPage.push(emlContent); 

            // pageCount = pageCount === 1 ? pageCount + 1 : pageCount;
            hPageCheck = 0;
            emlContent = [];
            for( let elm of packing ){
                const h = Number(window.getComputedStyle(elm).getPropertyValue('height')?.replace("px", ""));
                if( (hPageCheck + h) >  limitPage ){
                    console.log( { hPageCheck } );
                    packingPage.push(emlContent); 
                    emlContent = [];
                    hPageCheck = 0;
                } else { 
                    hPageCheck += h;
                    emlContent =[...emlContent, elm];
                }
            };

            if(emlContent.length > 0 ) packingPage.push(emlContent); 

            // console.log( { samplesPage, packingPage } );
            setNewPageContent([...samplesPage, ...packingPage]);
            r(true);
        }).then( res => {
            handlePrint(null, () => handlePrintMultiPages() );

            setLoading(false);
        });

        
        // const html = ReactDOMServer.renderToString(ElmContent);        
        // const head = document.getElementById("form-head");
        // const step = document.getElementById("form-body-step");
        // const parm = document.getElementById("form-body-parm");

        // const headHieght = Number(window.getComputedStyle(head).getPropertyValue('height')?.replace("px", ""));
        // const stepHieght = Number(window.getComputedStyle(step).getPropertyValue('height')?.replace("px", ""));
        // const parmHieght = Number(window.getComputedStyle(parm).getPropertyValue('height')?.replace("px", ""));
        // console.log( {headHieght, stepHieght, parmHieght} );
        // if( headHieght + stepHieght > limitPage ){
        //     parm.style.pageBreakBefore = 'always';
        // } 
        // console.log( html.toString() );

        // return componentRef.current;
    } 

    const handlePrintMultiPages = () => { 

        return printRef.current;
    }

    const handleChooseValue = (v) => {
      setSpData( {...v} );
      estservice.spcost( v?.spcode || "").then( r => {
        const { data: {spcost} } = r.data;
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
          const weight_after_lost =  Number(stp) >  1 ? amount_after_lost :weight_total * ( 1 - (lost/100) );
       
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
              sample_cost : step_total_price,
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
              sample_cost : step_total_price_after_lost,
            },
          ];
    
          if( ind < step.length - 1 )  tbdata.push( {id : `next to step ${ind+2}`} );
        }
    
        setproductCost( step_total_price_after_lost );
        setSpcostData(tbdata); 
      }).catch( err => { 
        message.error("Getting sample fail.")
        console.warn(err);
      });
    }

    useEffect( () =>  {
        const init = () => {
            estservice.get( code ).then( async res => {
              const { data : { head, detail, list } } = res.data; 
          
              handleChooseValue( head );
              const pkArr = []; 
              for( let ind in list ){
          
                const h = detail[ind];
                const v = list[ind];
                pkArr.push( { 
                  header: {...h}, 
                  source: [...v]
                }); 
              }
               
              setPackingCostSource( pkArr );
            }).catch( err => {
              console.log(err);
              message.error("Error getting infomation Estimation.")
            }) 
        }

        init();
        return () => {}
    }, []);

    const HeaderForm = () => {
        return (
            <div className='print-head' style={{height:55}}> 
                <div className='print-title flex gap-5'> 
                    <div className='grow'>
                        <img src={logo} alt="" style={{paddingInline: 6, height: 36}}  />  
                    </div>
                    <div className='grow-0' style={{width: 278}}>
                        <Flex className='mb-0'>
                            <Typography.Text className='tx-form min-w-28'>Estimate Code</Typography.Text>
                            <Typography.Text className='tx-form'>{spData?.estcode}</Typography.Text> 
                        </Flex>
                        <Flex className='mb-1'>
                            <Typography.Text className='tx-form min-w-28'>Estimate Date</Typography.Text> 
                            <Typography.Text className='tx-form'>{dayjs(spData?.created_date).format("MMM DD, YYYY")}</Typography.Text>  
                        </Flex>
                    </div>
                    <div className='grow-0' style={{width: 278}}>
                        <Flex className='mb-0'>
                            <Typography.Text className='tx-form min-w-28'>Estimate By</Typography.Text>
                            <Typography.Text className='tx-form'>{spData?.created_name}</Typography.Text> 
                        </Flex>
                        <Flex className='mb-1'>
                            <Typography.Text className='tx-form min-w-28'>Form Date</Typography.Text> 
                            <Typography.Text className='tx-form'>{dayjs().format("MMM DD, YYYY hh:mm:ss A")}</Typography.Text>  
                        </Flex>
                    </div>
                </div> 
            </div>  
        )
    }

    const FooterForm = ({page}) => {
        return (
            <div className='print-foot' style={{height:34}}>  
                <div className='print-title flex justify-end'>   
                    <Flex className='mb-0'>
                        <Typography.Text className='text-sm min-w-8'>Page</Typography.Text>
                        <Typography.Text className='text-sm' strong>{page}</Typography.Text> 
                    </Flex> 
                </div> 
            </div>   
        )
    }

    const ContentHead = () => {
        return ( 
        <div className='content-head in-sample flex flex-col'>
            <Typography.Title level={3} className='text-center uppercase !mb-0.5'>Product Estimate Cost</Typography.Title> 
            <div className='print-title flex py-3'>
                <div className='ps-3'>
                    <Flex className='mb-1.5'>
                        <Typography.Text className='text-sm min-w-48' strong>Sample Preparation No</Typography.Text>
                        <Typography.Text className='text-sm'>{spData?.spcode}</Typography.Text> 
                    </Flex>
                    <Flex className='mb-1.5'>
                        <Typography.Text className='text-sm min-w-48' strong>Sample Preparation Name</Typography.Text> 
                        <Typography.Text className='text-sm'>{spData?.spname}</Typography.Text>  
                    </Flex> 
                    <Flex className='mb-1.5'>
                        <Typography.Text className='text-sm min-w-48' strong>Sample Preparation Date</Typography.Text>
                        <Typography.Text className='text-sm'>{dayjs(spData?.spdate).format("DD/MM/YYYY")}</Typography.Text> 
                    </Flex>
                    <Flex className='mb-1.5'>
                        <Typography.Text className='text-sm min-w-48' strong>Specific Gravity</Typography.Text> 
                        <Typography.Text className='text-sm'>{formatCommaNumber(Number(spData?.specific_gravity))}</Typography.Text>  
                    </Flex>
                </div> 
            </div>  
        </div>
        )
    }

    const ContentBody = () => {
        return ( 
        <div className='content-body in-sample flex flex-col'>
            <Card 
                title={
                <>
                    <Flex align='baseline'>
                        <Typography.Text className='m-0 min-w-32 text-md font-semibold border-r'> Product Cost </Typography.Text>
                        <Typography.Text className='text-md ps-2'> {formatCommaNumber(productCost)} Baht/Kg </Typography.Text>
                    </Flex>
                </> 
                } 
                size='small' 
                bordered
            >
                <Table 
                    size='small'
                    dataSource={spcostData}
                    columns={columnSpc}
                    pagination={false}
                    rowKey="id"
                    bordered={false}
                    locale = {{ emptyText: <span>No data available, please add some data.</span> }} 
                /> 
                <div className='print-title flex'>  
                    <div className='p-3 w-full'>
                        <Flex className='mb-1.5' vertical>
                            <Typography.Text className='text-sm min-w-48' strong>Remark</Typography.Text>
                            <pre 
                                className='text-sm mb-0.5' 
                                style={{
                                    whiteSpace:'break-spaces',
                                    border: '1px solid #508ecc',
                                    padding: '0.5rem 0.5rem',
                                    minHeight: 60,
                                    outline: 'none',
                                    boxShadow: 'none',
                                    fontWeight: 400,
                                    lineHeight: '1rem',
                                }} 
                            >{spData?.remark}</pre>
                        </Flex> 
                    </div> 
                </div>                
            </Card>                
        </div>
        )
    }

    const ContentPackingHead = ({header}) => {
        return ( 
        <div className='content-head flex flex-col w-full py-3'>
            <div className='print-title flex'>
                <div className='flex w-full ps-2'>
                    <div className='flex w-1/2 flex-col'>
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}}>Fill Volume(ml)</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.fill_volume || 0))}</Typography.Text>
                        </Space>
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}}>Declared(gm/ml)</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.declared || 0))}</Typography.Text>
                        </Space>
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}}>Net weight/unit(kg)</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.netweight || 0))}</Typography.Text>
                        </Space>
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}}>Unit/carton(pcs)</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.unit_cost || 0))}</Typography.Text>
                        </Space>
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}}>Weight of other packaging/carton(gm)</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.otherweight || 0))}</Typography.Text>
                        </Space>
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}}>Gross Weight/carton(gm)</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.gross_weight_carton || 0))}</Typography.Text>
                        </Space>                    
                    </div>
                    <div className='flex w-1/2 flex-col'> 
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}}>Product Cost</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.productcost || 0))}</Typography.Text>
                        </Space>
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}}>Other Cost(Packing Set)</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.othercost || 0))}</Typography.Text>
                        </Space>                     
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}} width={124}>EX-Work cost/carton</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.exworkcost_carton || 0))}</Typography.Text>
                        </Space>                     
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}}>Margin %</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.margin || 0))} %</Typography.Text>
                        </Space>
                        <Space className='w-full leading-4 items-baseline'>
                            <Typography.Text className="tx-form" style={{ display:'block', width:208}} width={124}>EX-Work Sell price</Typography.Text>
                            <Typography.Text className="tx-form">{formatCommaNumber(Number(header?.exworksell_price || 0))}</Typography.Text>
                        </Space> 
                    </div>
                </div> 
            </div>  
        </div>
        )
    }


    const ContentPackingBody = ({data}) => {
        return ( 
        <div className='content-body in-pack flex flex-col'>
            <Card 
                title={
                <>
                    <Flex align='baseline'>
                        <Typography.Text className='m-0 min-w-48 pe-2 text-md font-semibold border-r'>{data?.header?.packingset_name}</Typography.Text>
                        <Typography.Text className='text-md ps-2'> {formatCommaNumber(Number(data?.header?.exworkcost_carton || 0))} Bath/Kg </Typography.Text>
                    </Flex>
                </> 
                } 
                size='small' 
                bordered
                className='py-3'
            >
                <ContentPackingHead header={data?.header} />
                <Table 
                    size='small'
                    dataSource={data?.source}
                    columns={columnPck}
                    pagination={false}
                    rowKey="id"
                    bordered={false}
                    locale = {{ emptyText: <span>No data available, please add some data.</span> }} 
                /> 
            </Card>                
        </div>
        )
    }

    const Pages = () => (
        <div ref={componentRef}> 
            <ContentData> 
                <ContentHead />
                <ContentBody />    
            {/* </ContentData>
            <div className='page-break'></div>
            <ContentData pageNum={2}> */}
                <Typography.Title level={3} className='content-head in-pack text-center uppercase !mb-0.5 pt-3'>Packing Estimate Cost</Typography.Title>
                { packingCostSource?.map( (data, i) => {
                    return ( 
                        <div key={i} > 
                            <ContentPackingBody data={data} />
                        </div>
                    )
                })}      
            </ContentData>
        </div>    
    )

    const ContentData = ({ children, pageNum = 0, total = 0 }) => {
        return ( 
            <div className='est-pages flex flex-col'>
                <HeaderForm />
                <div className='print-content grow'> 
                    {children} 
                </div>
                <FooterForm page={`${pageNum} of ${total}`} />             
            </div>
        )    
    }

    return (
        <>
            {/* <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24, }} spin />} fullscreen /> */}
            <div className='page-show' id="est"> 
                { loading && <Spin fullscreen indicator={<LoadingOutlined  />} /> }
                <div className="title-preview"> 
                    <Button
                        className='bn-center  bg-blue-400' 
                        onClick={() => { handleCheckMultiPages() }}
                        icon={<PiPrinterFill style={{fontSize:'1.1rem'}} />}
                    >
                        PRINT
                    </Button>
                </div>         
                <div className="layout-preview">
                    <Pages />
                </div>
                <div className='hidden'>
                    <div ref={printRef}>
                        {newPageContent?.map( (page, i) => ( 
                        <div key={i}>
                            <ContentData pageNum={i+1} total={(newPageContent.length)} > 
                                {page?.map( (eml, ind) => (<div key={ind} dangerouslySetInnerHTML={{ __html: eml.outerHTML }} ></div>) )}
                            </ContentData>
                            {i < (newPageContent.length-1) && <div className='page-break'></div>}
                        </div> 
                        ))}
                    </div>
                </div>
            </div>        
        </>


    )
}

export default EstPrintPreview