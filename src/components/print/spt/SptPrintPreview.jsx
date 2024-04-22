import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import logo from "../../../assets/images/logo_nsf.png"
import "./spt.css";

import dayjs from "dayjs";
import { spColumnsView, parameterColumnView } from "./spt.model"

import SamplePreparationService from '../../../service/SamplePreparation.service';
import { Button, Card, Space, Table, Typography } from 'antd';
import { formatCommaNumber } from '../../../utils/util';
import { PiPrinterFill } from "react-icons/pi";
const spService = SamplePreparationService();
function SptPrintPreview() {
    const { code } = useParams();
    const componentRef = useRef(null);
    const printRef = useRef(null);
    const handlePrint = useReactToPrint({
      documentTitle: "Print This Document",
      onBeforePrint: () => handleBeforePrint(),
      onAfterPrint: () => console.log("after printing..."),
      removeAfterPrint: true,
    });

    const [header, setHeader] = useState({});
    const [stepData, setStepData] = useState([]);
    const [parmData, setParmData] = useState([]);

    const handleBeforePrint = (e) => {
        // const newElement = document.createElement('div');
        // newElement.id = 'new-container'; // Optional: Set an ID for the new container
        // newElement.innerHTML = 'TEST';
        // Render the new component into the new container 
    
        // Replace the old container with the new container
        // componentRef.current.innerHTML = 'TEST'; 
    }

    const handleCheckMultiPages = () => {
        const limitPage = 930;

        const head = document.getElementById("form-head");
        const step = document.getElementById("form-body-step");
        const parm = document.getElementById("form-body-parm");
        // const othr = document.getElementById("form-body-other");

        let headHieght = Number(window.getComputedStyle(head).getPropertyValue('height')?.replace("px", ""));
        let stepHieght = Number(window.getComputedStyle(step).getPropertyValue('height')?.replace("px", ""));
        let parmHieght = Number(window.getComputedStyle(parm).getPropertyValue('height')?.replace("px", ""));
        // let othrHieght = Number(window.getComputedStyle(othr).getPropertyValue('height')?.replace("px", ""));
        // console.log( {headHieght, stepHieght, parmHieght, othrHieght} );
        if( headHieght + stepHieght + parmHieght > limitPage ){
            parm.style.pageBreakBefore = 'always';
            headHieght = 0;
            stepHieght = 0;
        }

        // if( headHieght + stepHieght + parmHieght + othrHieght > limitPage ){
        //     othr.style.pageBreakBefore = 'always';
        // }

        printRef.current = componentRef.current

        return printRef.current;
    } 

    const PrintComponent = () => {
      return (
        <div className="sp-page-form" ref={componentRef}> 
            <table style={{width:'100%', fontFamily:'inherit'}}>
                <thead>
                    <tr>
                        <th><PrintHeaderPage /></th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="form-head">
                        <td><HeaderData /></td>
                    </tr>
                    <tr id="form-body-step">
                        <td><BodyData /></td>
                    </tr>
                    <tr id="form-body-parm">
                        <td><BodyDataParameter /></td>
                    </tr> 
                    {/* <tr id="form-body-other">
                        <td><BodyDataOther /></td>
                    </tr>  */}
                </tbody> 
            </table>
        </div>
      );
    };

    const HeaderData = () => {
      return (
        <div className='head-data'>
            <div className='text-center'> 
                <Typography.Title level={3} className='uppercase mb-0.5'>Sample Preparation</Typography.Title>  
            </div>
            <div className='flex'>
                <div className='flex w-1/2 flex-col'>
                    <Space className='w-full items-baseline'>
                        <Typography.Text strong style={{ display:'block', width:128}} width={124}>Preparation Date</Typography.Text>
                        <Typography.Text>{dayjs(header?.spdate).format("DD/MM/YYYY")}</Typography.Text>
                    </Space>
                    <Space className='w-full items-baseline'>
                        <Typography.Text strong style={{ display:'block', width:128}}>Sample Code</Typography.Text>
                        <Typography.Text>{header.spcode}</Typography.Text>
                    </Space>
                    <Space className='w-full items-baseline'>
                        <Typography.Text strong style={{ display:'block', width:128}}>Sample Name</Typography.Text>
                        <Typography.Text>{header.spname}</Typography.Text>
                    </Space>
                    <Space className='w-full items-baseline'>
                        <Typography.Text strong style={{ display:'block', width:128}} width={124}>Request By</Typography.Text>
                        <Typography.Text>{header.created_name}</Typography.Text>
                    </Space>                     
                </div>
                <div className='flex w-1/2 flex-col'>
                    <Space className='w-full items-baseline'>
                        <Typography.Text strong style={{ display:'block', width:128}}>Customer</Typography.Text>
                        <Typography.Text>{header.cusname}</Typography.Text>
                    </Space>
                    <Space className='w-full items-baseline'>
                        <Typography.Text strong style={{ display:'block', width:128}}>Packaging</Typography.Text>
                        <Typography.Text>{header.pkname}</Typography.Text>
                    </Space>
                    <Space className='w-full items-baseline'>
                        <Typography.Text strong style={{ display:'block', width:128}}>Net Weight</Typography.Text>
                        <Typography.Text>{header.netweight}</Typography.Text>
                    </Space>
                    <Space className='w-full items-baseline'>
                        <Typography.Text strong style={{ display:'block', width:128}}>Approved By</Typography.Text>
                        <Typography.Text>{header.approved_name}</Typography.Text>
                    </Space>                     
                </div>
            </div>
            <div className='flex'>
                <div className='flex w-full flex-col'>
                    <Space className='w-full items-baseline'> 
                        <Typography.Text strong style={{ display:'block', width:128}}>Remark</Typography.Text>
                        <Typography.Text>{header.description}</Typography.Text>
                        {/* <pre 
                            className='text-sm mb-0.5' 
                            style={{
                                fontFamily: 'inherit',
                                whiteSpace:'break-spaces',
                                border: '0px solid #508ecc',
                                padding: '0',
                                minHeight: 20,
                                outline: 'none',
                                boxShadow: 'none',
                                fontWeight: 400,
                                lineHeight: '1.2rem',
                                color: '#000'
                            }} 
                        >{header?.description?.trim()}</pre>*/}
                    </Space>
                </div>
            </div>
        </div> 
      );
    }; 

    const BodyData = () => {
      return (
        <div className='body-data'> 
          { stepData.map( ( step, ind ) => (
            <Card 
                key={ind} 
                title={<div><Typography.Text strong className='uppercase text-white'>Step {ind + 1} Of Sample Preparation </Typography.Text></div>}
                bordered={false}
            >
                <Table 
                    columns={spColumnsView}
                    dataSource={step}
                    pagination={false}
                    bordered={false}
                    rowKey="id"
                    summary={(_) => <SummaryStepData data={step} />}
                />
            </Card> 
            ))
          }
        </div>
      );
    };

    const BodyDataParameter = () => {
      return (
        <div className='body-data'>
            <Card 
                title={<div><Typography.Text strong className='uppercase text-white'>Parameter Of Sample Preparation</Typography.Text></div>}
                bordered={false}
            >
                <Table 
                    columns={parameterColumnView}
                    dataSource={parmData}
                    pagination={false}
                    bordered={false}
                    rowKey="id"
                />
            </Card>  
        </div>
      );
    };

    // const BodyDataOther = () => {
    //   return (
    //     <div className='body-data'>
    //         <Card 
    //             title={<div><Typography.Text strong className='uppercase text-white'>Remark</Typography.Text></div>}
    //             bordered={false}
    //         >
    //             <pre 
    //             className='text-sm mb-0.5' 
    //             style={{
    //                 fontFamily: 'inherit',
    //                 whiteSpace:'break-spaces',
    //                 border: '0px solid #508ecc',
    //                 padding: '0.5rem',
    //                 minHeight: 20,
    //                 outline: 'none',
    //                 boxShadow: 'none',
    //                 fontWeight: 400,
    //                 lineHeight: '1.2rem',
    //                 color: '#000'
    //             }} 
    //             >{header?.description?.trim()}</pre>
    //         </Card>  
    //     </div>
    //   );
    // };

    const SummaryStepData = ({data}) => { 
        return (
            <>
            <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>รวม</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={2} className='pe-2 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                    <Typography.Text type="danger" className='underline decoration-double underline-offset-2' style={{fontSize:'10pt'}}>
                        { formatCommaNumber(Number( data[0]?.amount_total || 0 ) ) }
                    </Typography.Text>
                </Table.Summary.Cell> 
                {/* <Table.Summary.Cell index={1} colSpan={1} className='pe-2 text-end border-right-0' style={{borderRigth:"0px solid"}} >
                    <Typography.Text type="danger">{ formatCommaNumber(Number( data[0]?.totalpercent || 0 ) * 100 ) }</Typography.Text>
                </Table.Summary.Cell> */}
                <Table.Summary.Cell colSpan={3} />
            </Table.Summary.Row>
            <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>สูญเสีย</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={2} className='pe-2 text-end border-right-0' >
                    <Typography.Text type="danger" className='underline decoration-double underline-offset-2' style={{fontSize:'10pt'}}>
                        { formatCommaNumber(Number( data[0]?.lost || 0 ) ) } %
                    </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={3} />
            </Table.Summary.Row>
            <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>น้ำหนักหลังสูญเสีย</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={2} className='pe-2 text-end border-right-0'>
                    <Typography.Text type="danger" className='underline decoration-double underline-offset-2' style={{fontSize:'10pt'}}>
                        { formatCommaNumber(Number( data[0]?.amount_after_lost || 0 ))}
                    </Typography.Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={3} />
            </Table.Summary.Row>            
            </>
            
        )
    }

    const PrintHeaderPage = () => {
        return (
            <div className='flex width-100 items-end head-page pt-4' style={{height: 32}}> 
                <div className='flex w-full'>
                    <img src={logo} alt="" style={{paddingInline: 6, paddingBlock: 3, width:64}} />
                </div> 
                <div className='flex w-full'>
                    <Space className='w-full items-baseline justify-end' >
                        <Typography.Text strong style={{ fontSize:'9pt'}}>Form Date</Typography.Text>
                        <Typography.Text style={{ fontSize:'9pt'}}>{dayjs().format("MMM DD, YYYY")}</Typography.Text>
                    </Space>
                </div> 
            </div>
        )
    }
 

    useEffect(() => {
      if (componentRef.current) {
        const computedStyle = window.getComputedStyle(componentRef.current);
        const heightWithUnit = computedStyle.getPropertyValue('height');
    
        console.log('Component height:', heightWithUnit);
      }
    }, []);

    useEffect( () => {
        const init = () => {
            spService.get(code).then( async (res) => {
                const {master, detail, params, tags} = res.data.data;
                setHeader( master );
                setParmData( params );

                const step = [...new Set(detail.map( d => d.stepno ))];
                const arrData = [];

                for( let s of step ) arrData.push( detail.filter( d => d.stepno === s) );

                setStepData( arrData );
                setParmData( params );
                console.log({master, detail, params, tags});
            });

        }
        init();
    }, [code])

    return ( 
        <div className='page-show' id="spt">
            <div className="title-preview"> 
                <Button
                    className='bn-center  bg-blue-400' 
                    onClick={() => { handlePrint(null, () => handleCheckMultiPages() ) }}
                    icon={<PiPrinterFill style={{fontSize:'1.1rem'}} />}
                >
                    PRINT
                </Button>                
            </div> 
            <div className='print-layout-page'>
                <PrintComponent />
            </div>
            <div className='hidden'>
                <div ref={printRef}></div>
            </div>
        </div> 
    );
}

export default SptPrintPreview