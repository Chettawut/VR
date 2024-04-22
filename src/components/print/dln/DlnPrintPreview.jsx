/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import logo from "../../../assets/images/logo_nsf.png"
import "./dln.css";
import DeliveryNoteService from '../../../service/DeliveryNote.service';
import { Modal } from 'antd';
import { Flex } from 'antd';

import { formatCommaNumber } from '../../../utils/util';
import dayjs from 'dayjs';
 

const dnService = DeliveryNoteService();
export default function DlnPrintPreview() {
    // const location = useLocation();
    const { code, print } = useParams(); 
    const [header, setHeader] = useState({});
    const [details, setDetails] = useState([]);
    useEffect( () => {  
        
        const getData = () => {
            dnService.get(code).then( (res) => {  
                const { data : { header, detail } } = res.data; 
                setHeader(header);
                setDetails(detail);
 
            }).catch( err => { 
                console.log(err);
                const { data :{ message } } = err.response
                Modal.error({
                  title: 'Error Request.',
                  content: message || 'Request Fail. Please try again.',
                  onOk: () => window.close()
                })
            });
        }
        getData();
    }, [code]);

    useEffect( () => {   
        if(Number(print) === 1 && Object.entries(header).length > 0 && details.length > 0 ) {
            setTimeout( () => window.print(), 200 );
        }
    }, []);

    return (
        <div className='page-show' id="dln"> 
            <div className="print-layout">
                <div className='docno' >
                    <span>{header.docno}</span>
                </div>
                <div className='print-head'>
                    <div className='print-logo'>
                        <img src={logo} alt="" style={{paddingInline: 6}} /> 
                    </div>
                    <p className='th-text' style={{textAlign:'center', marginBottom:2}}>NINE STAR FOOD CO., LTD.</p>
                    <p className='ts-text' style={{textAlign:'center'}}>99/9 Moo8, Tambon Kongdkin, Amphoe Klaneng, Rayong 22160</p>
                </div>
                <div className='print-head-content'> 
                    <p style={{textAlign:'center', marginBottom:5, fontWeight:700, fontSize:'15pt', color:'#000'}}>บันทึกการส่งตัวอย่าง/Sample delivery note</p>
                    <Flex>
                        <div className='h-group-text' style={{flexGrow:1}}>
                            <span className='h-label' style={{width:125}}>ลูกค้า/Customer</span>
                            <span className='h-text'> {header.cusname}</span>
                        </div>
                        <div className='h-group-text' style={{width:'56mm'}}>
                            <span className='h-label' style={{width:100}}>วันที่ส่ง/Date</span>
                            <span className='h-text'>{dayjs( header.dndate ).format("DD/MM/YYYY")}</span>
                        </div>
                    </Flex>
                    <Flex>
                        <div className='h-group-text' style={{flexGrow:1}}>
                            <span className='h-label' style={{width:125, minWidth:125}}>ติดต่อ/Contact</span>
                            <span className='h-text' style={{maxWidth:410}}>{header.contact}</span>                        
                        </div>
                        <div className='h-group-text' style={{width:'56mm'}}>
                            {/* <span className='h-label' style={{width:100}}>วันที่ส่ง/Date</span> */}
                            {/* <span className='h-text'>{dayjs( header.dndate ).format("DD/MM/YYYY")}</span> */}
                        </div>
                    </Flex>
                    <Flex>
                        <div className='h-group-text' style={{flexGrow:1}}>
                            <span className='h-label' style={{width:125, minWidth:125}}>ที่อยู่/Address</span>
                            <span className='h-text' style={{maxWidth:410}}>
                                {header.idno} {header.road} {header.subdistrict} {header.district}  {header.province} {header.zipcode} ({header.country})
                            </span>                        
                        </div>
                        <div className='h-group-text' style={{width:'56mm'}}>
                            {/* <span className='h-label' style={{width:100}}>วันที่ส่ง/Date</span> */}
                            {/* <span className='h-text'>{dayjs( header.dndate ).format("DD/MM/YYYY")}</span> */}
                        </div>
                    </Flex>
                    <Flex>
                        <div className='h-group-text' style={{flexGrow:1}}>
                            <span className='h-label' style={{width:125, minWidth:125}}>โทร/Tel</span>
                            <span className='h-text' style={{maxWidth:410}}>{header.tel}</span>                        
                        </div>
                        <div className='h-group-text' style={{width:'56mm'}}>
                            {/* <span className='h-label' style={{width:100}}>วันที่ส่ง/Date</span> */}
                            {/* <span className='h-text'>{dayjs( header.dndate ).format("DD/MM/YYYY")}</span> */}
                        </div>
                    </Flex>
                </div>
                <div className='print-content'> 
                    {/* <Flex align='flex-start' justify='center'  style={{paddingBlock:'2mm'}}> */}

                        <table id="tb-detail">
                            <colgroup>
                                <col style={{width:'12mm'}} />
                                <col style={{width:'32mm'}} />
                                <col />
                                <col style={{width:'22mm'}} />
                                {/* <col style={{width:'20mm'}} />
                                <col style={{width:'25mm'}} /> */}
                                <col style={{width:'42mm'}} />
                            </colgroup>                            
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Code</th>
                                    <th>รายละเอียดตัวอย่าง/<br />Description</th>
                                    <th>จำนวนส่ง/<br />Quantity</th>
                                    {/* <th>Approved<br />Date</th>
                                    <th>Approved<br />By</th> */}
                                    <th>หมายเหตุ/<br />Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                { details.map( ( m, i ) => (
                                    <tr key={`row-${String(i)?.padStart(4, '0')}`} >
                                        <td className='txt-l'>{i+1}</td>
                                        <td className='txt-c'>{m.stcode}</td>
                                        <td className='txt-l'>{m.stname}</td>
                                        <td className='txt-r'>
                                            { `${formatCommaNumber(Number(m.qty))}` }
                                        </td>
                                        {/* <td className='txt-c'>{`${ !!m.approved_date ? dayjs(m.approved_date).format("DD/MM/YYYY") : ''}`}</td>
                                        <td className='txt-l'>{m.approved_name}</td> */}
                                        <td className='txt-l' style={{fontSize: '7.8pt'}}>{m.remark}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th className='txt-c' >Total</th>
                                    <th className='txt-r' colSpan={3}>{ `${formatCommaNumber((details.reduce( (a, v) => a += Number(v.qty), 0)))}` }</th>
                                    {/* <th className='txt-c' >{'\u00a0'}</th>
                                    <th className='txt-c' >{'\u00a0'}</th> */}
                                    <th className='txt-c' >{'\u00a0'}</th>
                                </tr>
                            </tfoot>
                        </table>
                    <div style={{paddingTop:'5mm', width:'100%'}}> 
                        <Flex align='baseline'>
                            <span className='h-title' style={{ flexWrap:'nowrap'}} >รายละเอียดเพิ่มเติม / Additional detail:</span>
                        </Flex>                    
                        <Flex vertical>
                            <pre >
                                {(header?.remark || "  ") + " ".repeat(350 - ( (header.remark?.length || 0) > 350 ?  350 : (header.remark?.length || 0) ))}
                                {/* {" ".repeat(200)} */}
                            </pre>
                            {/* <span className='c-text' style={{ borderBottom:'1px solid #000', width:'100%'}} >{'\u00a0'}</span>
                            <span className='c-text' style={{ borderBottom:'1px solid #000', width:'100%'}} >{'\u00a0'}</span>
                            <span className='c-text' style={{ borderBottom:'1px solid #000', width:'100%'}} >{'\u00a0'}</span> */}
                        </Flex> 
                    </div>                
                </div>
                <div className='print-foot'>  
                    <Flex gap='2rem' style={{paddingTop:'5mm'}}>
                        <Flex vertical style={{width:'50%'}} gap='1.3rem'>
                            <div className='h-group-text'>
                                <span className='h-label txt-r ' style={{width:'36mm', flexWrap:'nowrap'}}>ผู้ส่งตัวอย่าง / Sender</span>
                                <span className='h-text  txt-c unline-row' >{header.created_name}</span>
                            </div>
                            <div className='h-group-text'>
                                <span className='h-label txt-r ' style={{width:'36mm', flexWrap:'nowrap'}}>Date</span>
                                <span className='h-text  txt-c unline-row'>{dayjs().format("DD/MM/YYYY")}</span>
                            </div>                            
                        </Flex>
                        <Flex vertical style={{width:'50%'}} gap='1.3rem'>
                            <div className='h-group-text'>
                                <span className='h-label txt-r ' style={{width:'40mm', flexWrap:'nowrap'}}>ผู้รับตัวอย่าง / Receiver</span>
                                <span className='h-text  txt-c unline-row'>{'\u00a0'}</span>
                            </div>
                            <div className='h-group-text'>
                                <span className='h-label txt-r ' style={{width:'40mm', flexWrap:'nowrap', justifyContent:'end'}}>Date</span>
                                <span className='h-text  txt-c unline-row'></span>
                            </div> 
                        </Flex>
  
                    </Flex> 
                </div>
            </div> 
        </div>
    )
}
