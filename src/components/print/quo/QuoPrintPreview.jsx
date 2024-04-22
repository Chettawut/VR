/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
// import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from 'react-to-print';

import "./quo.css";
import logo from "../../../assets/images/logo_nsf.png";
 
import { Button, Flex,  Table, Typography, message } from 'antd';
import { column} from './quo.model';

import dayjs from "dayjs";
import { formatCommaNumber } from "../../../utils/util";
import { PiPrinterFill } from 'react-icons/pi';
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from 'antd';
import QuotationService from '../../../service/Quotation.service';


const quoservice = QuotationService();

function QuoPrintPreview() {
    const { code } = useParams();
    const componentRef = useRef(null);
    const printRef = useRef(null);
    const handlePrint = useReactToPrint({
      documentTitle: "Print This Document",
      onBeforePrint: () => handleBeforePrint(),
      onAfterPrint: () => handleAfterPrint(),
      removeAfterPrint: true,
    });

    const [hData, setHData] = useState({});
    const [details, setDetails] = useState([]);
    const [banks, setBanks] = useState([]);

    // const [packingCostSource, setPackingCostSource] = useState([]); 
    
    const [newPageContent, setNewPageContent] = useState([]);
    const columnDesc = column; 

    const [loading, setLoading] = useState(false);

    const handleAfterPrint = () => { 
        setNewPageContent([]);

        console.log( banks, newPageContent );
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
 

    useEffect( () =>  {
        const init = () => {
            quoservice.get( code ).then( async res => {
              const { data : { head, detail, bank } } = res.data; 
           
            //   console.log({ head, detail, bank } ); 
              setHData( head );
              setDetails( detail );
              setBanks( bank );
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
                        <img src={logo} alt="" style={{paddingInline: 6, height: '100%'}}  />  
                    </div>
                    <div className='flex grow-0 justify-end items-center' style={{width: 278}}>
                        <Flex className='mb-0 '>
                            <Typography.Title level={3} align='end' className='m-0 min-w-28 text-end'>QUOTATION</Typography.Title> 
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

    const QuotationSummary = (rec) => {
        return <>
            <Table.Summary.Row style={{height:24}}>
                <Table.Summary.Cell index={0} colSpan={6} className='!align-top'></Table.Summary.Cell>
            </Table.Summary.Row>

            <Table.Summary.Row className='r-sum'>
                <Table.Summary.Cell index={0} colSpan={4} rowSpan={4} className='!align-top !ps-0'>
                    <Flex vertical gap={12}>
                        <Flex vertical gap={2}>
                            <Typography.Text className='tx-title' strong>Payment Condition</Typography.Text>
                            <Typography.Text className='tx-info'>{hData?.payment_condition}</Typography.Text> 
                        </Flex>
                        <Flex vertical gap={2}>
                            <Typography.Text className='tx-title' strong>Banks</Typography.Text>
                            {banks?.map( (bnk, ix) => (
                                <Flex key={ix} gap={4}>
                                    <Typography.Text className='tx-info'>{bnk?.acc_no} {bnk?.acc_name} {bnk?.bank_name}</Typography.Text> 
                                </Flex>
                            ))}
                        </Flex> 
                    </Flex>
                </Table.Summary.Cell>
                <Table.Summary.Cell className='text-summary text-end !align-top' >
                    <Typography.Text className='text-sm text-end'>Total</Typography.Text>
                </Table.Summary.Cell> 
                <Table.Summary.Cell className='text-summary text-end !align-top' >
                    <Typography.Text className='text-sm text-end'>{formatCommaNumber( Number(hData?.total_price || 0), 2, 2 )}</Typography.Text>
                </Table.Summary.Cell> 
            </Table.Summary.Row>  

            <Table.Summary.Row className='r-sum'>
                {/* <Table.Summary.Cell index={0} colSpan={4} rowSpan={4} className='!align-top'>
                    <Typography.Title level={5}>Note.</Typography.Title>
                </Table.Summary.Cell> */}
                <Table.Summary.Cell className='text-summary text-end !align-top' >
                    <Typography.Text className='text-sm text-end'>Vat</Typography.Text>
                </Table.Summary.Cell> 
                <Table.Summary.Cell className='text-summary text-end !align-top' >
                    <Typography.Text className='text-sm text-end'>{formatCommaNumber( Number(hData?.vat || 0 ))}%</Typography.Text>
                </Table.Summary.Cell> 
            </Table.Summary.Row>    

            <Table.Summary.Row className='r-sum rl'>
                {/* <Table.Summary.Cell index={0} colSpan={4} rowSpan={4} className='!align-top'>
                    <Typography.Title level={5}>Note.</Typography.Title>
                </Table.Summary.Cell> */}
                <Table.Summary.Cell className='text-summary text-end !align-top' >
                    <Typography.Text className='text-sm text-end !text-white'>Grand Total</Typography.Text>
                </Table.Summary.Cell> 
                <Table.Summary.Cell className='text-summary text-end !align-top' >
                    <Typography.Text className='text-sm text-end !text-white'>{formatCommaNumber( Number(hData?.grand_total_price || 0), 2, 2 )}</Typography.Text>
                </Table.Summary.Cell> 
            </Table.Summary.Row>

            <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2} className='!align-top'>{'\u00A0'}</Table.Summary.Cell>
            </Table.Summary.Row>

            <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4} className='!align-top !ps-0'>
                    <Flex vertical gap={12}>
                        <Flex vertical gap={2}>
                            <Typography.Text className='tx-title' strong>Remarks</Typography.Text> 
                            <pre className='tx-info m-0'>{hData?.remark}</pre> 
                        </Flex>
                    </Flex>
                </Table.Summary.Cell>
            </Table.Summary.Row>              

            <Table.Summary.Row>
                <Table.Summary.Cell index={0} className='!align-top !ps-0 !pt-8'>
                    <Flex vertical gap={8}>
                        <Flex gap={8}>
                            <Typography.Text className='tx-info' strong>Prepared By: </Typography.Text> 
                            <Typography.Text className='tx-info' >{hData?.created_name}</Typography.Text>
                        </Flex>
                        <Flex gap={8}>
                            <Typography.Text className='tx-info' strong>Date: </Typography.Text> 
                            <Typography.Text className='tx-info' >{dayjs().format("DD/MM/YYYY")}</Typography.Text>
                        </Flex>
                        <Flex gap={12}>
                            <Flex gap={8}>
                                <Typography.Text className='tx-info' strong>Tel: </Typography.Text> 
                                <Typography.Text className='tx-info' >{hData?.tel}</Typography.Text>
                            </Flex>
                            <Flex gap={8}>
                                <Typography.Text className='tx-info' strong>Email: </Typography.Text> 
                                <Typography.Text className='tx-info' >{hData?.email}</Typography.Text>
                            </Flex>                            
                        </Flex>
                    </Flex>
                </Table.Summary.Cell>
                <Table.Summary.Cell className='!align-top !p-0'>{'\u00A0'}</Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={4} className='!align-top !ps-1 !pt-8'>
                    <Flex vertical gap={8}>
                        <Flex gap={2}>
                            <Typography.Text className='tx-info' strong>Approved Buyer: </Typography.Text> 
                            <Typography.Text className='tx-info' strong>{'\u00A0'}</Typography.Text>
                        </Flex>
                        <Flex gap={2}>
                            <Typography.Text className='tx-info' strong>Date: </Typography.Text> 
                            <Typography.Text className='tx-info' strong>{'\u00A0'}</Typography.Text>
                        </Flex>
                    </Flex>
                </Table.Summary.Cell>
            </Table.Summary.Row>              
        </>
    }

    const ContentHead = () => {
        return ( 
        <div className='content-head in-sample flex flex-col'> 
            <div className='print-title flex pb-2'>
                <div className='flex ps-3 grow-0' style={{width:300}}>
                    <Flex className='mb-1.5' vertical >
                        <Typography.Text className='tx-title min-w-48 weight600' strong>Quotation By</Typography.Text>
                        <Typography.Text className='tx-info' >Nine Star Food Co., Ltd.</Typography.Text> 
                        <Typography.Text className='tx-info' >99/9 Moo8, Tambon Kongdkin, Amphoe Klaneng, Rayong 22160 (Thailand)</Typography.Text> 
                        <Typography.Text className='tx-info' >Tax ID 0225556000121 Branch 00001</Typography.Text> 
                    </Flex> 
                </div> 
                <div className='flex ps-3 grow-0' style={{width:300}}>
                    <Flex className='mb-1.5' vertical>
                        <Typography.Text className='tx-title min-w-48 weight600' strong>Quotation To</Typography.Text>
                        <Typography.Text className='tx-info'>{hData?.cusname}</Typography.Text> 
                        <Typography.Text className='tx-info'>{hData?.address}</Typography.Text> 
                        { hData?.tel && <Typography.Text className='tx-info'>Tel. {hData?.tel}</Typography.Text> }
                        { hData?.email && <Typography.Text className='tx-info'>E-mail {hData?.email}</Typography.Text> }
                        { hData?.contact && <Typography.Text className='tx-info'>Contact {hData?.contact}</Typography.Text> }
                    </Flex> 
                </div> 
                <div className='flex ps-3 grow'>
                    <Flex className='mb-1.5' vertical>
                        <Typography.Text className='tx-title min-w-48' strong>Info</Typography.Text>
                        <Flex justify='space-between'>
                            <Typography.Text className='tx-info' strong>Quotation No</Typography.Text> 
                            <Typography.Text className='tx-info'>{hData?.quotcode}</Typography.Text>  
                        </Flex>
                        <Flex justify='space-between'>
                            <Typography.Text className='tx-info' strong>Quotation Date</Typography.Text> 
                            <Typography.Text className='tx-info'>{dayjs(hData?.quotdate).format("DD/MM/YYYY")}</Typography.Text>  
                        </Flex>
                        <Flex justify='space-between'>
                            <Typography.Text className='tx-info' strong>Valid price until</Typography.Text> 
                            <Typography.Text className='tx-info'>{dayjs(hData?.dated_price_until).format("DD/MM/YYYY")}</Typography.Text>  
                        </Flex>
                        <Flex justify='space-between'>
                            <Typography.Text className='tx-info' strong>Price term</Typography.Text> 
                            <Typography.Text className='tx-info'>{hData?.price_terms}</Typography.Text>  
                        </Flex>
                        <Flex justify='space-between'>
                            <Typography.Text className='tx-info' strong>Currency</Typography.Text> 
                            <Typography.Text className='tx-info'>{hData?.currency}</Typography.Text>  
                        </Flex>
                    </Flex>
                </div> 
            </div>  
        </div>
        )
    }

    const ContentBody = () => {
        return ( 
        <div className='content-body in-sample flex flex-col'> 
                <Table 
                    size='small'
                    dataSource={details}
                    columns={columnDesc}
                    pagination={false}
                    rowKey="id"
                    bordered={false}
                    locale = {{ emptyText: <span>No data available, please add some data.</span> }}
                    onRow={(record, index)=>{ 
                        return { className: 'r-sub'}
                    }}
                    summary={QuotationSummary}
                />              
        </div>
        )
    }

    

    const Pages = () => (
        <div ref={componentRef}> 
            <ContentData> 
                <ContentHead />
                <ContentBody />
            </ContentData>
        </div>    
    )

    const ContentData = ({ children, pageNum = 1, total = 1 }) => {
        return ( 
            <div className='quo-pages flex flex-col'>
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
            <div className='page-show' id="quo"> 
                { loading && <Spin fullscreen indicator={<LoadingOutlined  />} /> }
                <div className="title-preview"> 
                    <Button
                        className='bn-center  bg-blue-400' 
                        // onClick={() => { handleCheckMultiPages() }}
                        onClick={() => { handlePrint(null, () => componentRef.current ); }}
                        icon={<PiPrinterFill style={{fontSize:'1.1rem'}} />}
                    >
                        PRINT
                    </Button>
                </div>         
                <div className="layout-preview">
                    <Pages />
                </div>
                {/* <div className='hidden'>
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
                </div> */}
            </div>        
        </>


    )
}

export default QuoPrintPreview