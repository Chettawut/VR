import React from 'react'
import { Form, Input, Col, Row, Space, Button, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons';
import { CloseCircleIcon } from "../../components/icon"
import SamplePreparationService from '../../service/SamplePreparation.service';
import { capitalized } from '../../utils/util';

function SamplePreparationApprove({code, confirmed, cancel, result}) {
    const [form]  = Form.useForm();
    const spService = SamplePreparationService();
    const handlecomfirm = () => {
        form.validateFields().then( (f) => { 
            const { description } = f;
 
            spService.approved({ description, approved_result:result, spcode:code }).then( r => {

                message.success( `Sample preparation ${capitalized(result)}.` ); 
                confirmed(false);
            })
            .catch( err => {
                console.warn(err);
                const { data:{message:mes} } = err.response;
                message.error( mes || "error request"); 
            })

        });
    }

    return (
        <>
            <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative', paddingInline:"1.34rem" }} className='sample-preparation-approve' >
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}> 
                        <Form form={form} layout="vertical" autoComplete="off">
                            <Form.Item label="Remark :" name="description" style={{fontWeight:600}} >
                                <Input.TextArea rows={5} />
                            </Form.Item>
                        </Form>                            
                    </Col> 
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} style={{textAlign:'start'}} > 
                        <Button icon={<CheckCircleOutlined />} className='bn-primary-outline' onClick={() => handlecomfirm() } >ยืนยัน</Button>                      
                    </Col> 
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} style={{textAlign:'end'}} > 
                        <Button icon={<CloseCircleIcon />} danger onClick={() => cancel(false) }>ยกเลิก</Button>                             
                    </Col> 
                </Row>
            </Space>

        </>
    )
    }

export default SamplePreparationApprove