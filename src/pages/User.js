import { ClearOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react"; 
import { Button, Input, Space, Table } from "antd";
import { Row, Col, Card, Modal, Form, Select, Flex, Typography, Collapse } from "antd";
import Swal from "sweetalert2";
import UserService from "../service/UserService";
import { userdata } from "../model/userdata.model";
import { MdPostAdd } from "react-icons/md";
function User() {
  const [AllUser, setAllUser] = useState("");
  const [OpenModalResetPassword, setOpenModalResetPassword] = useState(false);
  const [userdataDetail, setUserdataDetail] = useState(userdata);
  const [actionManage, setActionManage] = useState({
    action: "add",
    title: "เพิ่มผู้ใช้งาน",
    confirmText: "ยืนยัน",
  });
  // const [formAdd] = Form.useForm();
  const [formReset] = Form.useForm();  
  const [formManage] = Form.useForm();
  const [form] = Form.useForm();

  const [openModalManage, setOpenModalManage] = useState(false);
  const [activeSearch, setActiveSearch] = useState([]);

  useEffect(() => {
    GetUser();
  }, []);
 
  const columns = [
    {
      title: "User Code",
      dataIndex: "unitcode",
      key: "unitcode",
      hidden: "true",
      width: "10%",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "15%",
      sorter: (a, b) => a.username.length - b.username.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อ",
      dataIndex: "firstname",
      key: "firstname", 
      sorter: (a, b) => a.firstname.length - b.firstname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "นามสกุล",
      dataIndex: "lastname",
      key: "lastname",
      sorter: (a, b) => a.lastname.length - b.lastname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "เบอร์โทร",
      dataIndex: "tel",
      key: "tel",
      width: "15%",
      sorter: (a, b) => a.tel.length - b.tel.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
      width: "15%",
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
      width: 120,
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      key: "operation",
      width: 90,
      fixed: "right",
      render: (text) => (
        <Space > 
          <Button
            icon={<EditOutlined />} 
            className='bn-primary-outline'
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onClick={(e) => showEditModal(text.code) }
            size="small"
          />
        </Space> 
      ),
    },
  ].filter((item) => !item.hidden);

  const GetUser = ( parm = {}) => {
    UserService.getUser(parm)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllUser(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    document.body.style = "overflow: hidden !important;";
    UserService.getSupUser(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setUserdataDetail(data);
          formManage.setFieldsValue(data);
          setActionManage({ action: "edit", title: "แก้ไขผู้ใช้งาน", confirmText: "แก้ใข" });
          setOpenModalManage(true);
          // formReset?.setFieldValue("resetcode", data.code);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    UserService.addUser(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            handleSearch();
            setOpenModalManage(false);
            formManage.resetFields();
          } else {
            // alert(data.message)
            Swal.fire({
              title: "<strong>ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
        }
      })
      .catch((err) => {});
  };

  const submitEdit = (dataform) => {
    UserService.editUser({ ...userdataDetail, ...dataform })
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            handleSearch();
            setOpenModalManage(false);
            formManage.resetFields();
          } else {
            // alert(data.message)
            Swal.fire({
              title: "<strong>ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
        }
      })
      .catch((err) => {});
  };

  const onModalManageClose = async () => {
    setUserdataDetail({});
    formManage.resetFields();
    setOpenModalManage(false);
  };
  ////////////////////////////////

  const ModalManage = () => {
    return (
      <Modal
        open={openModalManage}
        title={actionManage.title}
        okText={actionManage.confirmText}
        cancelText="ยกเลิก"
        onCancel={() => onModalManageClose()}
        width={1000}
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
        <Form form={formManage} layout="vertical" autoComplete="off">
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
              <Form.Item name="username" rules={[ { required: true, message: "กรุณาใส่ชื่อผู้ใช้!", } ]} label="Username" >
                <Input
                  disabled={actionManage.action === "edit"}
                  size="small"
                  placeholder="Username"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} style={ actionManage.action === "add" ? { display: "inline" } : { display: "none" } } > 
              <Form.Item name="password" rules={[ {required: actionManage.action === "add", message: "กรุณาใส่รหัสผ่าน!" } ]} label="Password" >
                <Input.Password
                  disabled={actionManage.action === "edit"}
                  size="small"
                  placeholder="Password"
                  style={{ height: 40 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} style={ actionManage.action === "edit" ? { display: "inline" } : { display: "none" } } > 
              <Form.Item rules={[{ required: true, message: "กรุณาใส่รหัสผ่าน!" }]} label="Password" >
                <Input.Password                  
                  disabled={actionManage.action === "edit"}
                  size="small"
                  defaultValue="12345678"
                  style={{ height: 40 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4} style={ actionManage.action === "edit" ? { display: "inline" } : { display: "none" } } >
              <Form.Item label="รีเซ็ต Password"> 
                <Button style={{ width: 100}} onClick={() => { setOpenModalResetPassword(true); }} >
                  Reset
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
              <Form.Item name="firstname" rules={[ { required: true,  message: "กรุณาใส่ชื่อจริง!" } ]} label="ชื่อจริง" >
                <Input placeholder="ชื่อจริง" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
              <Form.Item name="lastname" rules={[ { required: true, message: "กรุณาใส่ชื่อนามสกุล!" } ]} label="นามสกุล" >
                <Input placeholder="นามสกุล" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>  
              <Form.Item name="type" rules={[ { required: true,  message: "กรุณาระบุประเภท!" } ]} label="ตำแหน่ง" >
                <Select
                  style={{ height: 40 }}
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "พนักงานขาย", label: "พนักงานขาย" },
                    { value: "ธุรการ", label: "ธุรการ" },
                    { value: "จัดซื้อ", label: "จัดซื้อ" },
                    { value: "ช่าง", label: "ช่าง" },
                    { value: "กรรมการ", label: "กรรมการ" },
                    { value: "ผู้จัดการสาขา", label: "ผู้จัดการสาขา" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
              <Form.Item name="tel" label="เบอร์โทรศัพท์">
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}> 
              <Form.Item name="email" label="อีเมล">
                <Input placeholder="อีเมล" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  };

  const CollapseItemSearch = () => {
    return (
      <>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="User Name" name="username" onChange={handleSearch}>
              <Input placeholder="Enter User Name." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="First Name" name="firstname" onChange={handleSearch}>
              <Input placeholder="Enter First Name." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Last Name" name="lastname" onChange={handleSearch}>
              <Input placeholder="Enter Last Name." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Tel" name="tel" onChange={handleSearch}>
              <Input placeholder="Enter Tel." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
            <Form.Item label="Email" name="email" onChange={handleSearch}>
              <Input placeholder="Enter Email." />
            </Form.Item>
          </Col>
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

        GetUser(data);
    }).catch( err => {
        console.warn(err);
    })
  }

  const FormSearch = (
    <Collapse
      size="small"
      onChange={(e) => { setActiveSearch(e); }}
      activeKey={activeSearch}
      items={[
        {
          key: "1",
          label: ( <> <SearchOutlined /> <span> Search</span> </> ),
          children: CollapseItemSearch(),
          showArrow: false,
        },
      ]}
      // bordered={false}
    />
  );

  const TitleTable = (
    <Flex className='width-100' align='center'>
        <Col span={12} className='p-0'>
            <Flex gap={4} justify='start' align='center'>
              <Typography.Title className='m-0 !text-zinc-800' level={3}>List of Users</Typography.Title>
            </Flex>
        </Col>
        <Col span={12} style={{paddingInline:0}}>
            <Flex gap={4} justify='end'>
              <Button  
              size='small' 
              className='bn-action bn-center bn-primary-outline justify-center'  
              icon={<MdPostAdd style={{fontSize:'1.13rem'}} />} 
              onClick={() => {
                setActionManage({ action: "add", title: "เพิ่มผู้ใช้งาน", confirmText: "เพิ่ม" });
                setOpenModalManage(true);
              }}>
                  Create user
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
            <Card bordered={false} className="criclebox cardbody h-full">
              <Row gutter={[8,8]} className='m-0'>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Table size="small" rowKey="code" title={()=>TitleTable} columns={columns} dataSource={AllUser} />
                </Col>
              </Row>
            </Card>
          </Space>
        </div>
      </div>

      {OpenModalResetPassword && (
        <Modal
          open={OpenModalResetPassword}
          title="แก้ไขรหัสผ่าน"
          width={500}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
          onOk={() => {
            UserService.resetPassword( formReset.getFieldValue("resetpassword"), userdataDetail?.code || "" ).then(async (res) => {
              let { status, data } = res;
              if (status === 200) {
                if (data.status) {
                  await Swal.fire({
                    title: "<strong>สำเร็จ</strong>",
                    html: data.message,
                    icon: "success",
                  });

                  setOpenModalResetPassword(false);
                } else {
                  // alert(data.message)
                  Swal.fire({
                    title: "<strong>ผิดพลาด!</strong>",
                    html: data.message,
                    icon: "error",
                  });
                }
              }
            }).catch((err) => {});
          }}
          onCancel={() => setOpenModalResetPassword(false)}
        >
          <Form form={formReset} layout="vertical" name="form_in_modal" initialValues={{ modifier: "public" }} >
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={16} lg={16} xl={24}> 
                <Form.Item name="resetpassword" label="รหัสผ่านใหม่">
                  <Input.Password placeholder="ใส่รหัสผ่านใหม่" />
                </Form.Item>
                {/* <Form.Item name="resetcode" > <Input type="hidden"  /> </Form.Item> */}
              </Col>
            </Row>
          </Form>
        </Modal>
      )}

      {openModalManage && ModalManage()}
    </>
  );
}

export default User;
