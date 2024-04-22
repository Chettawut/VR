import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import logo from "../../../assets/images/logo_nsf.png"
import "./coa.css";
import SamplePreparationService from '../../../service/SamplePreparation.service';
import { Modal } from 'antd';
import { Flex, Space } from 'antd';
import dayjs from 'dayjs';
import { capitalized } from '../../../utils/util';
 

const spService = SamplePreparationService();
export default function CoaPrintPreview() {
    // const location = useLocation();
    const { code } = useParams();

    const [header, setHeader] = useState({});
    const [coa, setCoa] = useState([]);
    const [parmeter, setParameter] = useState([]);
    const [allergens, setAllergens] = useState(null);

    const getBBE = (header) => {
        const { spdate, shelf_life, shelf_life_unit } = header; 

        if( !!spdate && !!shelf_life ) {
            const newDateAfterAdding = dayjs(spdate).add(Number(shelf_life), shelf_life_unit);
            const bbe_date = newDateAfterAdding.format("YYYY-MM-DD");

            setHeader(state => ({...state, bbe_date}));

            return bbe_date;
        } return null;
    }

    useEffect( () => { 
        const getData = () => {
            spService.coa(code).then( async (res) => {  
                const { data : { header, coa, parm, allergen:{allergen} } } = res.data;
                if(!!allergen){
                    const allergenArr = [...new Set(allergen.split(","))].map( srt => capitalized(srt));
    
                    setAllergens(allergenArr.join(", "));
                }
                setHeader(header);
                setCoa(coa);
                setParameter(parm);
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
    
        getData();
    }, [code])
    return (
        <div className='page-show' id="coa"> 
            <div className="print-layout">
                <div className='print-head'>
                    <div className='print-logo'>
                        <img src={logo} alt="" style={{paddingInline: 6}} /> 
                    </div>
                    <p className='th-text' style={{textAlign:'center', marginBottom:2}}>NINE STAR FOOD CO., LTD.</p>
                    <p className='ts-text' style={{textAlign:'center'}}>99/9 Moo8, Tambon Kongdkin, Amphoe Klaneng, Rayong 22160</p>
                </div>
                <div className='print-head-content'> 
                    <p style={{textAlign:'center', marginBottom:2, fontWeight:700, fontSize:'15pt', color:'#000'}}>SAMPLE COA</p>
                    <Flex vertical>
                        <div className='h-group-text'>
                            <span className='h-label'>Product Name </span>
                            <span className='h-text'>{header.spname}</span>
                        </div>
                        <div className='h-group-text'>
                            <span className='h-label'>Sample No </span>
                            <span className='h-text'>{header.spcode}</span>
                        </div>
                        <div className='h-group-text'>
                            <span className='h-label'>Sample Lot Date </span>
                            <span className='h-text'> {dayjs(header.spdate).format("DD/MM/YYYY")}</span>
                        </div>
                        <div className='h-group-text'>
                            <span className='h-label'>Best Before End (BBE) </span>
                            <span className='h-text'> 
                                {!!header.bbe_date ? dayjs(header.bbe_date).format("DD/MM/YYYY") : getBBE(header)}
                            </span>
                        </div>
                        <div className='h-group-text'>
                            <span className='h-label'>Package</span>
                            <span className='h-text'> {header.pkname}</span>
                        </div>                  
                    </Flex>
                </div>
                <div className='print-content'> 
                    <Flex align='center'>
                        <div className='sec-item h-group-text'>
                            <span className='h-title'>Ingredients: In Descending order</span>
                        </div>                        
                        <div className='sec-parm h-group-text'>
                            <span className='h-title'>Physical & Chemical</span>
                            <span className='h-title'>parameters:</span>
                        </div>                        
                    </Flex>  
                    <Flex align='flex-start' style={{paddingBlock:'2mm'}}>
                        <div className='sec-item h-group-text'>
                            { coa.map( ( m, i ) => (
                                <Flex justify='start' key={`${String(i)?.padStart(4, '0')}`}>
                                    <span className='c-text' style={{width:'94mm'}}>{m.stnameEN}</span>
                                    <span className='c-text'>{m.res}</span> 
                                </Flex>
                            )) }
                        </div>                        
                        <div className='sec-parm h-group-text'>
                            <Flex justify='space-between'>
                                <span className='c-text' style={{textDecoration:'underline'}}>Parameter</span> 
                                <span className='c-text' style={{textDecoration:'underline', width: '20mm', justifyContent:'center'}}>Result</span> 
                            </Flex>
                            { parmeter.map( ( m, i ) => (
                                <Flex justify='start' key={`${String(i)?.padStart(4, '0')}`}>
                                    <span className='c-text' style={{flex:'1 auto'}}>{m.paraname}</span>
                                    <span className='c-text' style={{paddingRight: '4.6mm', width: '20mm', justifyContent:'flex-end'}}>{m.cutout || 0}</span> 
                                </Flex>
                            )) }                            
                            <Flex justify='start'>
                                <span className='c-text' style={{flex:'1 auto'}}>Net weight (gm)</span>
                                <span className='c-text' style={{paddingRight: '4.6mm', width: '20mm', justifyContent:'flex-end'}}>{header.netweight}</span>
                            </Flex>
                        </div>                        
                    </Flex> 
                    <div style={{position:'absolute', bottom:15}}>
                        <Space direction='vertical' size='small'> 
                            {   (!!allergens ||!!header.allergen_standards ) &&
                                <Flex vertical> 
                                    <span className='h-title' >Allergen information: 
                                        { !!allergens && <span style={{fontWeight:400, fontStyle:'italic', marginLeft:8}}>{allergens}</span> }
                                    </span>
                                    {
                                        !!header.allergen_standards &&
                                        <Flex vertical> 
                                            <span className='c-text' >{header.allergen_standards}</span>
                                        </Flex>  
                                    }
                                </Flex>                                
                            } 
                            {
                                !!header.shelf_life &&
                                <Flex vertical>
                                    <span className='h-title'>Shelf life</span>
                                    <span className='c-text'>{header.shelf_life} {header.shelf_life_unit}</span>
                                </Flex> 
                            }            
                            {
                                !!header.storage_conditions &&
                                <Flex vertical>
                                    <span className='h-title' >Storage Conditions</span>
                                    <span className='c-text' >{header.storage_conditions}</span>
                                </Flex> 
                            }       
                            {
                                header.additional &&
                                <Flex vertical>
                                    <span className='h-title' >Additional</span>
                                    <span className='c-text' >{header.additional}</span>
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
                        <div className='h-group-text'>
                            <span className='h-label'>Note</span>
                            <span className='h-text'></span>
                        </div>
                    </Flex> 
                </div>
            </div> 
        </div>
    )
}
