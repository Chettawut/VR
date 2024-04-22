/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Drawer, Flex, message } from "antd";
import { Row, Col } from "antd";
 
import { SaveFilled } from "@ant-design/icons"
import { ButtonBack } from '../../components/button'; 

import { shipping_expense_defualt } from './shipping-type.model';  
// import { delay } from '../../utils/util';
// import OptionService from '../../service/Options.service';
import ShippingTypeService from '../../service/ShippingTypeService'; 
// import OptionService from '../../service/Options.service';
import ShippingTypeManageForm from "./ShippingTypeManageForm";

const ldtService = ShippingTypeService();
// const opservice = OptionService();
// const opservice = OptionService();
const from = "/shipping-type" 
const ShippingTypeManage = ({config, open, close, complete}) => {  
    
    const [formHeader, setFormHeader] = useState(null); 
    const [formDetail, setFormDetail] = useState(null); 
    const [openDrawer, setOpenDrawer] = useState(false);
    // const [packageTypeOption, setPackageTypeOption] = useState([]); 
    const init = async () => { 
        if(config?.action !== "create"){
            ldtService.get(config?.code, { ignoreLoading : true }).then( async (res) => {
                const {data:{loading, shipping}} = res.data; 
                setFormHeader(loading);
                setFormDetail(shipping);
            })
            .catch( err => {
                // console.warn(err);
                const {data} = err.response;
                message.error( data?.message || "error request"); 
            });
        } else { 
            setFormDetail(shipping_expense_defualt); 
        }
    }
 
    useEffect( ()=>{   
        init(); 

        setOpenDrawer(open); 
        return () => {
            setFormHeader(null);
            setFormDetail(null);
        }
    }, [open]);

    // useEffect( () => {
    //     if(  Object.keys( formDetail ).length > 0 || config?.action === "create" ){
    //         setOpenDrawer(open); 
    //         console.log( formDetail);
    //     }

    //     return () => { setFormDetail({}) }
    // }, [JSON.stringify( formDetail )])
  

    const handleConfirm = (res) => {
        const { shippingtype, shipping } = res;
        
        const parm = { header: { id: formHeader?.id, ...shippingtype }, detail: shipping };
        const actions = config?.action !== "create" ? ldtService.update( parm ) : ldtService.create( parm );

        actions.then( async(r) => { 
            message.success("Request success."); 
            complete(false);
        })
        .catch( err => {
            console.warn(err);
            const data = err?.response?.data;
            message.error( data?.message || "error request");
        });        
    }
 
    // const SectionTop = (
    //     <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
    //         <Col span={12} className='p-0'>
    //             <Flex gap={4} justify='start'>
    //                 <ButtonBack target={from} /> 
    //             </Flex>
    //         </Col> 
    //     </Row>         
    // );

    const SectionBottom = (
        <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start'>
                    <ButtonBack target={from} />
                </Flex>
            </Col>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='end'>
                    <Button 
                        form='shippingtype-form'
                        htmlType='submit'
                        icon={<SaveFilled style={{fontSize:'1rem'}} />} 
                        type='primary' style={{ width:'9.5rem' }} 
                    >Save</Button>
                </Flex>
            </Col>
        </Row>         
    );


    return (
        <div className='shippingtype-manage xs:px-0 sm:px-0 md:px-8 lg:px-8'>
            <Drawer
                title={config?.title}
                onClose={() => { setOpenDrawer(false); }}
                open={openDrawer}
                width={668}
                className="responsive-drawer"
                getContainer={() => document.querySelector(".loadingtype-manage")}
                footer={SectionBottom}
                afterOpenChange={(e)=>{
                    if(!e) { 
                        close(false);
                    }
                }}
                maskClosable={false}
            > 
                { openDrawer && <ShippingTypeManageForm confirm={handleConfirm} load={formHeader} ship={formDetail} mode={config?.action}  /> }
            </Drawer> 
        </div>
    );
}

export default ShippingTypeManage;
