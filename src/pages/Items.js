import { SearchOutlined, ClearOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import {Button,Input,Table,Row,Col,Card,Modal,Form,Select,Space,Tabs,Badge,InputNumber} from "antd";
import {Flex,Collapse,message,Typography,Tag,Tooltip} from "antd";
import Swal from "sweetalert2";
import ItemService from "../service/ItemService";
import ItemTypeService from "../service/ItemTypeService";

import { MdPostAdd } from "react-icons/md";

import { FileControl } from "../pages/file-control/file-control";
import { items } from "../model/items.model";
import { formatCommaNumber } from "../utils/util.js";
import { ModalUnit } from "../components/modal/unit/modal-unit.js";
import { ModalSupplier } from "../components/modal/supplier/modal-supplier.js";

const Items = () => {
  const { TextArea } = Input;
  const [AllItem, setAllItem] = useState("");
  const [option, setOption] = useState([]);
  const [optionValue, setOptionValue] = useState();
  const [form] = Form.useForm();
  const [activeSearch, setActiveSearch] = useState([]);

  const [openModalManage, setOpenModalManage] = useState(false);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มประเภทสินค้า",
    confirmText: "Create",
  });

  const [isShowModalSupcode, setIsShowModalSupcode] = useState(false);
  const [isShowModalProcode, setIsShowModalProcode] = useState(false);
  const [isShowModalUnit, setIsShowModalUnit] = useState(false);

  const [formAdd] = Form.useForm();
  const [formManage] = Form.useForm();

  const [itemsDetail, setItemsDetail] = useState(items);

  const [disableUpload, setDisableUpload] = useState(true);
  const [stcode, setStcode] = useState(null); 
 

  useEffect(() => {
    GetItem({});
    GetType();
  }, []);

  const GetItem = (data) => {
    ItemService.getItem(data).then( res => {
        const {data} = res.data;

        setAllItem(data);
    }).catch( err => {
        console.log(err);
        message.error("Request error!");
    });
  }
  
  const GetType = () => {
    ItemTypeService.getAllItemsType()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setOption(data);
        }
      })
      .catch((err) => {});
  };

  const CollapseItemSearch = () => {
    return (
      <>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Item Code" name="stcode" onChange={handleSearch}>
              <Input placeholder="Enter Item Code." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Item Name (TH)" name="stname" onChange={handleSearch}>
              <Input placeholder="Enter Item Name." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Item Name (EN)" name="stnameEN" onChange={handleSearch}>
              <Input placeholder="Enter English Name." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Express Code" name="express_code" onChange={handleSearch}>
              <Input placeholder="Enter Express Code." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="มาตรฐาน Halal" name="halal" >
            <Select
                  placeholder="สถานะมาตรฐาน Halal"
                  style={{ height: 38 }}
                  onChange={handleSearch}
                  options={[
                    {
                      value: "N",
                      label: <Badge status="error" text="ไม่มี" />,
                    },
                    {
                      value: "Y",
                      label: <Badge status="success" text="มี" />,
                    },                   
                  ]}
                />
            </Form.Item>
          </Col>
          
          {/* <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Request Date." name="created_date">
              <RangePicker
                placeholder={["From Date", "To date"]}
                style={{ width: "100%", height: 40 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Request By." name="created_by">
              <Input placeholder="Enter First Name or Last Name." />
            </Form.Item>
          </Col> */}
        </Row>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={8} md={12} lg={12} xl={12}>
            {/* Ignore */}
          </Col>
          <Col xs={24} sm={8} md={12} lg={12} xl={12}>
            <Flex justify="flex-end" gap={8}>
              <Button
                type="primary"
                size="small"
                className="bn-action"
                htmlType="submit"
                icon={<SearchOutlined />}
                onClick={() => handleSearch()}
              >
                Search
              </Button>
              <Button
                type="primary"
                size="small"
                className="bn-action"
                danger
                icon={<ClearOutlined />}
                onClick={() => handleClear()}
              >
                Clear
              </Button>
            </Flex>
          </Col>
        </Row>
      </>
    );
  };

  const handleClear = () => {
    form.resetFields();

    handleSearch();
  };


  const handleSearch = () => {
    form.validateFields().then( v => {
        const data = {...v}; 

        GetItem(data);
    }).catch( err => {
        console.warn(err);
    })
 }

  const heandleCheckCode = (code) => {
    setDisableUpload(!code);
    setStcode(code);
  };

  const columns = [
    {
      title: "Item Code",
      dataIndex: "stcode",
      key: "stcode",
      sorter: (a, b) => (a?.stcode || "").localeCompare(b?.stcode || ""),
      width: 140,
    },
    {
      title: "Express Code",
      dataIndex: "express_code",
      key: "express_code",
      sorter: (a, b) => (a?.express_code || "").localeCompare(b?.express_code || ""),
      width: 140,
    },
    {
      title: "Item Name(TH)",
      dataIndex: "stname",
      key: "stname",
      width: "25%",
      sorter: (a, b) => (a?.stname || "").localeCompare(b?.stname || ""),
      ellipsis: { showTitle: false, },
      render: (v) => <Tooltip placement="topLeft" title={v}>{v}</Tooltip>,
    },
    {
      title: "Item Name(EN)",
      dataIndex: "stnameEN",
      key: "stnameEN",
      width: "25%",
      sorter: (a, b) => (a?.stnameEN || "").localeCompare(b?.stnameEN || ""),
      ellipsis: { showTitle: false, },
      render: (v) => <Tooltip placement="topLeft" title={v}>{v}</Tooltip>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "!pe-4",
      align:'right',
      sorter: (a, b) => (a?.price || "").localeCompare(b?.price || ""),
      render:(v)=>formatCommaNumber( Number(v || 0))
    },
    {
      title: "File Attaced",
      dataIndex: "file_attach",
      key: "file_attach",
      width: 120,
      render: (data) => {
        const arr = data?.split(",") || [];
        return ( arr.length > 0 ? <Tag color="geekblue">{arr.length} files.</Tag> : <Tag color="default">empty.</Tag> )
      },
    },      
    // {
    //   title: "Item Type",
    //   dataIndex: "typename",
    //   key: "typename",
    //   width: "20%",
    // },    
    // {
    //   title: "สถานะการใช้งาน",
    //   dataIndex: "statusitem",
    //   key: "statusitem",
    //   width: "20%",
    //   render: (data) => data === "Y" ? <Badge status="success" text="เปิดการใช้งาน" /> :  <Badge status="error" text="ปิดการใช้การ" />,
    // },
    {
      title: "Action",
      key: "operation",
      width: 120,
      fixed: "right",
      render: (text) => (
        <Button
          icon={<EditOutlined />} 
          className='bn-primary-outline'
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={(e) => showEditModal(text.id)}
          size="small"
        />
      ),
    },
  ].filter((item) => !item.hidden); 

  const showEditModal = (data) => {
    document.body.style = "overflow: hidden !important;";
    ItemService.getSupItem(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setItemsDetail(data);
          setActionManage({
            action: "edit",
            title: "แก้ไขประเภทสินค้า",
            confirmText: "Edit",
          });
          setOpenModalManage(true);
          setDisableUpload(!data.stcode);
          setStcode(data.stcode);
          formManage.setFieldsValue({...data}); 
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    ItemService.addItem(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetItem();
            setOpenModalManage(false);
            formAdd.resetFields();
            formManage.resetFields();
          } else {
            Swal.fire({
              title: "<strong>" + data.message + "</strong>",
              html: "ผิดพลาด",
              icon: "error",
            });
          }
        } else {
          // alert(data.message)
          Swal.fire({
            title: "<strong>ผิดพลาด!</strong>",
            html: data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {});
  };

  const submitEdit = (dataform) => {
    ItemService.editItem({ ...itemsDetail, ...dataform })
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetItem();
            formAdd.resetFields();
            formManage.resetFields();
            setOpenModalManage(false);
          } else {
            // alert(data.message)
            Swal.fire({
              title: "<strong>ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
        } else {
          // alert(data.message)
          Swal.fire({
            title: "<strong>ผิดพลาด!</strong>",
            html: data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {});
  };

  const onModalManageClose = async () => {
    setItemsDetail({});
    formManage.resetFields();
    setOpenModalManage(false);
    setDisableUpload(true);
    document.body.style = "overflow: visible !important;";
  };
  ////////////////////////////////

  const itemsManage = [
    /////////////////////////////// Tab 1 ///////////////////////////////////////////
    {
      key: "1",
      label: "ข้อมูลสินค้า",
      children: (
        <Form form={formManage} layout="vertical" autoComplete="off" >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Form.Item name="stcode" rules={[{ required: true, message: "กรุณาใส่รหัสสินค้าใหม่!" }]} label="รหัสสินค้า" >
                <Input placeholder="ใส่รหัสสินค้า" onChange={(e) => { heandleCheckCode(e.target.value); }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
              <Form.Item name="stname" label="ชื่อสินค้า" rules={[{ required: true, message: "กรุณาใส่ชื่อสินค้าใหม่!" }]} >
                <Input placeholder="ใส่ชื่อสินค้า" />
              </Form.Item>
            </Col>
          </Row>          
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="stnamedisplay"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อสินค้าที่แสดงผลใหม่!",
                  },
                ]}
                label="ชื่อสินค้าที่แสดงผล"
              >
                <Input placeholder="ใส่ชื่อสินค้าที่แสดงผล" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="stnameEN"
                label="ชื่อสินค้าภาษาอังกฤษ(EN)"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อสินค้าภาษาอังกฤษ(EN) ใหม่!",
                  },
                ]}
              >
                <Input placeholder="ใส่ชื่อสินค้าภาษาอังกฤษ(EN)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="express_code"
                label="Express code"
              >
                <Input
                  placeholder="Express code"
                  onChange={(e) => {
                    heandleCheckCode(e.target.value);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item label='หน่วย' name="unit" rules={[{ required: true, message: "กรุณาใส่หน่วยสินค้าใหม่!" }]} htmlFor="unit-1" >
                <Space.Compact style={{ width: '100%' }}>
                    <Input readOnly placeholder='Choose Unit.' value={itemsDetail?.unit} id="unit-1" />
                    <Button 
                        type="primary" 
                        className='bn-primary' 
                        icon={<SearchOutlined />} 
                        style={{minWidth:40}}
                        onClick={() => setIsShowModalUnit(true)}
                    ></Button>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="typecode" label="ประเภท"  rules={[ { required: true, message: "กรุณาใส่ประเภทสินค้าใหม่!" }, ]} >
                <Select
                  size={"large"}
                  value={optionValue}
                  onChange={(value) => setOptionValue(value)}
                  options={option.map((item) => ({
                    value: item.typecode,
                    label: item.typename,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item label='รหัสผู้ขาย' name="supcode" htmlFor="supcode-1" >
                <Space.Compact style={{ width: '100%' }}>
                    <Input readOnly placeholder='ใส่รหัสผู้ขาย' value={itemsDetail?.supcode} id="supcode-1" />
                    <Button 
                        type="primary" 
                        className='bn-primary' 
                        icon={<SearchOutlined />} 
                        style={{minWidth:40}}
                        onClick={() => setIsShowModalSupcode(true)}
                    ></Button>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="supname" label="ชื่อผู้ขาย">
                <Input readOnly placeholder="ใส่ชื่อผู้ขาย" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item label='รหัสผู้ผลิต' name="procode" htmlFor="procode-1" >
                <Space.Compact style={{ width: '100%' }}>
                    <Input readOnly placeholder='ใส่รหัสผู้ผลิต' value={itemsDetail?.procode} id="procode-1" />
                    <Button 
                        type="primary" 
                        className='bn-primary' 
                        icon={<SearchOutlined />} 
                        style={{minWidth:40}}
                        onClick={() => setIsShowModalProcode(true)}
                    ></Button>
                </Space.Compact>
              </Form.Item> 
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item name="proname" label="ชื่อผู้ผลิต">
                <Input readOnly placeholder="ใส่ชื่อผู้ผลิต" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    /////////////////////////////// Tab 2 ///////////////////////////////////////////
    {
      key: "2",
      label: "รายละเอียดสินค้า",
      children: (
        <Form
          form={formManage}
          layout="vertical"
          // initialValues={{ ...itemsDetail }}
          defaultValue={{ multiply: "1" }}
          autoComplete="off"
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="price" label="ราคาขาย">
                <Input addonAfter="บาท" placeholder="ใส่ราคาขาย" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="halal" label="มาตรฐาน Halal">
              <Select
                  placeholder="สถานะมาตรฐาน Halal"
                  style={{ height: 38 }}
                  options={[
                    {
                      value: "N",
                      label: <Badge status="error" text="ไม่มี" />,
                    },
                    {
                      value: "Y",
                      label: <Badge status="success" text="มี" />,
                    },                   
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="halal_cert" label="Halal Certified">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="multiply" label="ตัวคูณน้ำหนัก">
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="ใส่ตัวคูณน้ำหนัก"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="yield" label="Yield">
                <Input name="yield" addonAfter="%" placeholder="ใส่ค่า Yield" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="enumber" label="E-number">
                <Input placeholder="ใส่ E-number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="allergen" label="สารก่อภูมิแพ้">
                <Input placeholder="ใส่สารก่อภูมิแพ้" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="purpose" label="วัตถุประสงค์">
                <Input placeholder="ใส่วัตถุประสงค์" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="country" label="ประเทศหรือแหล่งกำเนิด">
                <Input placeholder="ใส่ประเทศหรือแหล่งกำเนิด" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="status" label="สถานะการใช้งาน">
                <Select
                  placeholder="ใส่สถานะการใช้งาน"
                  style={{ height: 38 }}
                  options={[
                    {
                      value: "Y",
                      label: <Badge status="success" text="เปิดการใช้งาน" />,
                    },
                    {
                      value: "N",
                      label: <Badge status="error" text="ปิดการใช้งาน" />,
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="feature" label="ลักษณะสินค้า">
                <TextArea rows={4} placeholder="ใส่ลักษณะสินค้า" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8} >
              <Form.Item name="remarks" label="Remark">
                <TextArea rows={4} placeholder="ใส่ Remarks สินค้า" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ),
    },
    /////////////////////////////// Tab 3 ///////////////////////////////////////////
    {
      key: "3",
      label: "เพิ่มเติม",
      disabled: disableUpload,
      children: (
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24}>
            <FileControl
              title={`แนบไฟล์ สำหรับ Item code : ${stcode || "error"}`}
              refcode={stcode}
              refs="Items"
            />
          </Col>
        </Row>
      ),
    },
  ];

  const FormSearch = (
    <Collapse
      size="small"
      onChange={(e) => {
        setActiveSearch(e);
      }}
      activeKey={activeSearch}
      items={[
        {
          key: "1",
          label: (
            <>
              <SearchOutlined />
              <span> Search</span>
            </>
          ),
          children: CollapseItemSearch(),
          showArrow: false,
        },
      ]}
      // bordered={false}
    />
  );

  const ModalManage = () => {
    return (
      <Modal
        open={openModalManage}
        title={actionManage.title}
        okText={actionManage.confirmText}
        cancelText="Cancel"
        style={{ top: 20 }}
        width={1000}
        afterClose={() => formManage.resetFields()}
        onCancel={() => onModalManageClose()}
        onOk={() => {
          formManage
            .validateFields()
            .then((values) => {
              if (actionManage.action === "add") {
                submitAdd(values);
              } else if (actionManage.action === "edit") {
                submitEdit(values);
              }
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Card title="มูลสินค้า">
          <Tabs defaultActiveKey="1" items={itemsManage} />
        </Card>
      </Modal>
    );
  };

  const TitleTable = (
    <Flex className='width-100' align='center'>
        <Col span={12} className='p-0'>
            <Flex gap={4} justify='start' align='center'>
              <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Items</Typography.Title>
            </Flex>
        </Col>
        <Col span={12} style={{paddingInline:0}}>
            <Flex gap={4} justify='end'>
                  <Button  
                  size='small' 
                  className='bn-action bn-center bn-primary-outline justify-center'  
                  icon={<MdPostAdd style={{fontSize:'1.13rem'}} />} 
                  onClick={() => {
                    setActionManage({ action: "add", title: "เพิ่มสินค้า", confirmText: "Create", });
                    setOpenModalManage(true);
                  }}>
                      Create Item
                  </Button>
            </Flex>
        </Col>  
    </Flex>
  );    
  return (
    <>
      <div className='layout-content px-3 sm:px-5 md:px-5'>
        <div className="pilot-scale-access">
          <Space direction="vertical" size="middle" style={{ display: "flex", position: "relative" }} >
            <Form form={form} layout="vertical" autoComplete="off">
              {FormSearch}
            </Form>
            <Card>
              <Row gutter={[8,8]} className='m-0'>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Table title={() => TitleTable}  size="small" columns={columns} dataSource={AllItem} rowKey="stcode"  scroll={{ x: 'max-content' }}/>
                </Col>
              </Row>
            </Card>
          </Space>
        </div>
      </div>

      {/* Modal จัดการสินค้า */}
      {openModalManage && ModalManage()}

      {/* Modal เลือกรหัสผู้ขาย */}
      {isShowModalSupcode && (
        <ModalSupplier type="supplier" show={isShowModalSupcode} close={() => { setIsShowModalSupcode(false) }} values={(record)=>{
          formManage.setFieldValue("supcode", record.supcode);
          formManage.setFieldValue("supname", record.supname);       
          setItemsDetail((prev) => ({ ...prev, supcode: record?.supcode, supname:record?.supname }));
        }} />
      )}

      {/* Modal เลือกรหัสผู้ผลิต */}
      {isShowModalProcode && (
        <ModalSupplier type="producer" show={isShowModalProcode} close={() => { setIsShowModalProcode(false) }} values={(record)=>{
          formManage.setFieldValue("procode", record.supcode);
          formManage.setFieldValue("proname", record.supname);       
          setItemsDetail((prev) => ({ ...prev, procode: record?.supcode, proname:record?.supname }));
        }} />
      )}

      {/* Modal เลือกหน่วย */}
      {isShowModalUnit && ( 
        <ModalUnit show={isShowModalUnit} close={() => { setIsShowModalUnit(false) }} values={(record)=>{ 
          setItemsDetail((prev) => ({ ...prev, unit: record?.unit })); 
          formManage.setFieldValue("unit", record?.unit);
        }} />
      )}
    </>
  );
};

export default Items;
