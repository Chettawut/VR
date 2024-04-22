import { SearchOutlined, ToolTwoTone } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import {
  Button,
  Input,
  Space,
  Table,
  Row,
  Col,
  Card,
  Modal,
  Form,
  Select,
  Badge,
} from "antd";
import Swal from "sweetalert2";
import SupplierService from "../service/SupplierService";
import { PROVINCE_OPTIONS } from "../utils/util";

function Supplier() {
  const [AllSupplier, setAllSupplier] = useState("");
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);

  useEffect(() => {
    GetSupplier();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
              height: 40,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
              height: 40,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "รหัสผู้ขาย",
      dataIndex: "supcode",
      key: "supcode",
      width: "30%",
      ...getColumnSearchProps("supcode"),
      sorter: (a, b) => a.supcode.length - b.supcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อผู้ขาย",
      dataIndex: "supname",
      key: "supname",
      width: "30%",
      ...getColumnSearchProps("supname"),
      sorter: (a, b) => a.supname.length - b.supname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "จังหวัด",
      dataIndex: "province",
      key: "province",
      width: "30%",
      ...getColumnSearchProps("province"),
      sorter: (a, b) => a.province.length - b.province.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "statussup",
      key: "statussup",
      width: "20%",
      ...getColumnSearchProps("statussup"),
      sorter: (a, b) => a.statussup.length - b.statussup.length,
      sortDirections: ["descend", "ascend"],
      render: (data) => (
        <div>
          {data === "Y" ? (
            <Badge status="success" text="เปิดการใช้งาน" />
          ) : (
            <Badge status="error" text="ปิดการใช้การ" />
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "operation",
      width: "20%",
      fixed: "right",
      render: (text) => (
        <Button
          icon={<ToolTwoTone twoToneColor="#E74C3C" />}
          style={{ cursor: "pointer" }}
          danger
          onClick={(e) => showEditModal(text.supcode)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const GetSupplier = () => {
    SupplierService.getSupplier()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllSupplier(data);
        }
      })
      .catch((err) => {});
  };

  const showAddModal = () => {
    SupplierService.getSupcode()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formAdd.setFieldValue("Addsupcode", data);
        }
      })
      .catch((err) => {});
    setOpenModalAdd(true);
  };

  const showEditModal = (data) => {
    SupplierService.getSupSupplier(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          console.log(data)
          formEdit.setFieldValue("Editsupname", data.supname);
          formEdit.setFieldValue("Editstatussup", data.statussup);
          formEdit.setFieldValue("Edittype", data.type);
          formEdit.setFieldValue("Editidno", data.idno);
          formEdit.setFieldValue("Editroad", data.road);
          formEdit.setFieldValue("Editsubdistrict", data.subdistrict);
          formEdit.setFieldValue("Editdistrict", data.district);
          formEdit.setFieldValue("Editprovince", data.province);
          formEdit.setFieldValue("Editzipcode", data.zipcode);
          formEdit.setFieldValue("Edittel", data.tel);
          formEdit.setFieldValue("Editfax", data.fax);
          formEdit.setFieldValue("Edittaxnumber", data.taxnumber);
          formEdit.setFieldValue("Editemail", data.email);
          formEdit.setFieldValue("Editsupcode", data.supcode);

          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    SupplierService.addSupplier(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetSupplier();
            setOpenModalAdd(false);
            formAdd.resetFields();
          } else {
            if (data.stcode) {
              Swal.fire({
                title: "<strong>" + data.message + "</strong>",
                html: "ผิดพลาด",
                icon: "error",
              });
            } else {
              Swal.fire({
                title: "<strong>" + data.message + "</strong>",
                html: "ผิดพลาด",
                icon: "error",
              });
            }
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
    SupplierService.editSupplier(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          await Swal.fire({
            title: "<strong>สำเร็จ</strong>",
            html: data.message,
            icon: "success",
          });

          GetSupplier();

          setOpenModalEdit(false);
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

  ////////////////////////////////

  const ModalAdd = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="เพิ่มผู้ขาย"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        width={1200}
        onOk={() => {
          formAdd
            .validateFields()
            .then((values) => {
              // formAdd.resetFields();
              // console.log(values)
              submitAdd(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={formAdd}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              รหัสผู้ขาย
              <Form.Item
                name="Addsupcode"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่รหัสผู้ขาย!",
                  },
                ]}
              >
                <Input placeholder="รหัสผู้ขาย" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
              ชื่อผู้ขาย
              <Form.Item
                name="Addsupname"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อผู้ขาย!",
                  },
                ]}
              >
                <Input placeholder="ใส่ชื่อผู้ขาย" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              ประเภท
              <Form.Item name="Addtype">
                <Select
                  style={{ height: 40 }}
                  options={[
                    { value: "ผู้ขาย", label: "ผู้ขาย" },
                    { value: "ผู้ผลิต", label: "ผู้ผลิต" },
                    { value: "ผู้ขายและผู้ผลิต", label: "ผู้ขายและผู้ผลิต" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เลขที่
              <Form.Item name="Addidno">
                <Input placeholder="เลขที่" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              ถนน
              <Form.Item name="Addroad">
                <Input placeholder="ถนน" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              ตำบล
              <Form.Item name="Addsubdistrict">
                <Input placeholder="ตำบล" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              อำเภอ
              <Form.Item name="Adddistrict">
                <Input placeholder="อำเภอ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              จังหวัด
              <Form.Item
                name="Addprovince"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุประเภท!",
                  },
                ]}
              >
                <Select style={{ height: 40 }} options={PROVINCE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              รหัสไปรษณีย์
              <Form.Item name="Addzipcode">
                <Input placeholder="รหัสไปรษณีย์" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เบอร์โทรศัพท์
              <Form.Item name="Addtel">
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เบอร์แฟ็ค
              <Form.Item name="Addfax">
                <Input placeholder="เบอร์แฟ็ค" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เลขที่ผู้เสียภาษี
              <Form.Item name="Addtaxnumber">
                <Input placeholder="เลขที่ผู้เสียภาษี" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              Email
              <Form.Item name="Addemail">
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  };

  const ModalEdit = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="แก้ไขผู้ขาย"
        okText="Edit"
        cancelText="Cancel"
        width={1200}
        onCancel={onCancel}
        onOk={() => {
          formEdit
            .validateFields()
            .then((values) => {
              // formEdit.resetFields();
              // console.log(values)
              submitEdit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={formEdit}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              รหัสผู้ขาย
              <Form.Item
                name="Editsupcode"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่รหัส!",
                  },
                ]}
              >
                <Input placeholder="รหัสผู้ขาย" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
              ชื่อผู้ขาย
              <Form.Item
                name="Editsupname"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อผู้ขาย!",
                  },
                ]}
              >
                <Input placeholder="ใส่ชื่อผู้ขาย" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              ประเภท
              <Form.Item name="Edittype">
                <Select
                  style={{ height: 40 }}
                  options={[
                    { value: "ผู้ขาย", label: "ผู้ขาย" },
                    { value: "ผู้ผลิต", label: "ผู้ผลิต" },
                    { value: "ผู้ขายและผู้ผลิต", label: "ผู้ขายและผู้ผลิต" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เลขที่
              <Form.Item name="Editidno">
                <Input placeholder="เลขที่" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              ถนน
              <Form.Item name="Editroad">
                <Input placeholder="ถนน" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              ตำบล
              <Form.Item name="Editsubdistrict">
                <Input placeholder="ตำบล" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              อำเภอ
              <Form.Item name="Editdistrict">
                <Input placeholder="อำเภอ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              จังหวัด
              <Form.Item
                name="Editprovince"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุประเภท!",
                  },
                ]}
              >
                <Select style={{ height: 40 }} options={PROVINCE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              รหัสไปรษณีย์
              <Form.Item name="Editzipcode">
                <Input placeholder="รหัสไปรษณีย์" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เบอร์โทรศัพท์
              <Form.Item name="Edittel">
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เบอร์แฟ็ค
              <Form.Item name="Editfax">
                <Input placeholder="เบอร์แฟ็ค" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เลขที่ผู้เสียภาษี
              <Form.Item name="Edittaxnumber">
                <Input placeholder="เลขที่ผู้เสียภาษี" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              Email
              <Form.Item name="Editemail">
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              สถานการใช้งาน
              <Form.Item
                name="Editstatussup"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  style={{ height: 40 }}
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
          </Row>
        </Form>
      </Modal>
    );
  };

  return (
    <>
      <div className="layout-content">
        <Button
          type="primary"
          onClick={() => {
            showAddModal();
          }}
        >
          เพิ่มผู้ขาย
        </Button>
        <ModalAdd
          open={OpenModalAdd}
          onCancel={() => {
            setOpenModalAdd(false);
          }}
        />
        <ModalEdit
          open={OpenModalEdit}
          onCancel={() => {
            setOpenModalEdit(false);
          }}
        />
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table
              size="small"
                columns={columns}
                dataSource={AllSupplier}
                rowKey="supcode"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Supplier;
