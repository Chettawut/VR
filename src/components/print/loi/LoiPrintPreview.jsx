/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import logo from "../../../assets/images/logo_nsf.png"
import "./loi.css";
import SamplePreparationService from '../../../service/SamplePreparation.service';
import { Modal } from 'antd';
import { Flex, Space } from 'antd';
import dayjs from 'dayjs';
import { capitalized } from '../../../utils/util';
 

export default function LoiPrintPreview() {
    const spService = SamplePreparationService();
    // const location = useLocation();
    const { code } = useParams();

    const [header, setHeader] = useState({});
    const [loi, setLoi] = useState([]);
    const [allergens, setAllergens] = useState(null);

    const getData = () => {
        spService.lot(code).then( async (res) => {  
            const { data : { header, loi, allergen:{allergen} } } = res.data;

            if(!!allergen){
                const allergenArr = [...new Set(allergen.split(","))].map( srt => capitalized(srt));

                setAllergens(allergenArr.join(", "));
            }
            setHeader(header);
            setLoi(loi); 
        }).catch( err => { 
            console.log(err);
            const { data } = err.response
            Modal.error({
              title: 'Error Request.',
              content: data || 'Request Fail. Please try again.',
              onOk: () => window.close()
            })            
        });
    }
    useEffect( () => { 
        getData();
    }, [])
    return (
        <div className='page-show' id="lot"> 
            <div className="print-layout">
                <div className='print-head'>
                    <div className='print-logo'>
                        <img src={logo} alt="" style={{paddingInline: 6}} /> 
                    </div>
                    <p className='th-text' style={{textAlign:'center', marginBottom:2}}>NINE STAR FOOD CO., LTD.</p>
                    <p className='ts-text' style={{textAlign:'center'}}>99/9 Moo8, Tambon Kongdkin, Amphoe Klaneng, Rayong 22160</p>
                </div>
                <div className='print-head-content'> 
                    <p style={{textAlign:'center', marginBottom:2, fontWeight:700, fontSize:'15pt', color:'#000'}}>LIST OF INGREDIENTS</p>
                    <Flex vertical>
                        <div className='h-group-text'>
                            <span className='h-label'>Product Name </span>
                            <span className='h-text'> {header.spname}</span>
                        </div>
                        <div className='h-group-text'>
                            <span className='h-label'>Product Code </span>
                            <span className='h-text'>{header.spcode}</span>
                        </div>                 
                    </Flex>
                </div>
                <div className='print-content'> 
                    <Flex align='center' justify='center'>                      
                        <div className='sec-content h-group-text'>
                            <span className='h-title'>List of Ingredients (in descending order)</span>
                        </div>                        
                    </Flex>  
                    <Flex align='flex-start' justify='center'  style={{paddingBlock:'2mm'}}>                      
                        <div className='sec-items h-group-text' style={{flexDirection:'column', width:'16.82cm', justifyContent:'center' }}>
                            <Flex justify='flex-start'>
                                <span className='c-text' style={{width: '25mm',  fontWeight:600}}>Items</span> 
                                <span className='c-text' style={{flexGrow:1,  fontWeight:600}}>Ingredients</span>
                                <span className='c-text' style={{width: '25mm', justifyContent:'flex-end', fontWeight:600}}>%</span>
                            </Flex>
                            { loi.map( ( m, i ) => (
                                <Flex justify='start' key={`${String(i)?.padStart(4, '0')}`}>
                                    <span className='c-text' style={{width: '25mm', minWidth: '25mm' }}>{i+1}</span> 
                                    <span className='c-text' style={{flexGrow:1}}>{m.stnameEN}</span>
                                    <span className='c-text' style={{width: '25mm', justifyContent:'flex-end'}}>
                                        { `${( Number(m.percent) * 100).toFixed(2)} %` }
                                    </span>
                                </Flex>
                            ))}                            
                            <Flex justify='start'> 
                                <span className='c-text double-underline' style={{width: '100%', justifyContent:'flex-end', paddingBlock:'1rem'}}>
                                    { `${(loi.reduce( (a, v) => a += Number(v.percent), 0.00 )*100).toFixed(2)} %` }
                                </span>
                            </Flex>
                        </div>                        
                    </Flex> 
                    <div style={{position:'absolute', bottom:15}}>
                        <Space direction='vertical' size='small'> 
                            <Flex vertical>
                                <span className='h-title' >Allergen information: 
                                    <span style={{fontWeight:400, fontStyle:'italic', marginLeft:8}}>{allergens || 'none'}</span>
                                </span>
                            </Flex>
                        {
                            header.allergen_standards &&
                            <Flex vertical> 
                                <span className='c-text' >{header.allergen_standards}</span>
                            </Flex>  
                        }
                        </Space> 
                    </div>                
                </div>
                <div className='print-foot'>  
                    <Flex vertical>
                        <div className='h-group-text'>
                            <span className='h-label'>Prepared/Approved by</span>
                            <span className='h-text'> {header.approved_name} </span>
                        </div>
                        <div className='h-group-text'>
                            <span className='h-label'>Date</span>
                            <span className='h-text'> {dayjs().format("DD/MM/YYYY")} </span>
                        </div>
                    </Flex> 
                </div>
            </div> 
        </div>
    )
}
