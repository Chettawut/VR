import React, { useRef, useState, useEffect } from "react";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  ToolTwoTone,
  InboxOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
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
  // Select,
  Badge,
  Typography,
  DatePicker,
  message,
  Upload,
  Drawer,
} from "antd";
import Highlighter from "react-highlight-words";

// COMPONENT
import { EditableRow, EditableCell } from "../components/table/TableEditAble";

// SERVICE
import ItemService from "../service/ItemService";
import CustomerService from "../service/CustomerService";
import SRService from "../service/SRService";

import { FileControl } from "./file-control/file-control"

const SR = () => {
  const { Text } = Typography;
  const [AllSR, setAllSR] = useState("");
  const [itemList, setItemList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [AllCustomer, setAllCustomer] = useState("");
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const dateFormat = "YYYY/MM/DD";
  // MODAL CONTROLLER
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [isShowModalItem, setIsShowModalItem] = useState(false);
  const [isShowModalCustomer, setIsShowModalCustomer] = useState(false);
  const { Dragger } = Upload;
  const searchInput = useRef(null);
  const { TextArea } = Input;
  
  useEffect(() => {
    if (isShowModalItem) fetchItem();
  }, [isShowModalItem]);

  useEffect(() => {
    GetSR();
    GetCustomer();
  }, []);
  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  const fetchItem = () => {
    ItemService.getAllItems()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setItemList(data);
        }
      })
      .catch((err) => {});
  };

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

  const props = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const columns = [
    {
      title: "SR Code",
      dataIndex: "srcode",
      key: "srcode",
      width: "20%",
      ...getColumnSearchProps("srcode"),
      sorter: (a, b) => a.srcode.length - b.srcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "SR Date",
      dataIndex: "srdate",
      key: "srdate",
      width: "20%",
      ...getColumnSearchProps("srdate"),
      sorter: (a, b) => a.srdate.length - b.srdate.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อลูกค้า",
      dataIndex: "cusname",
      key: "cusname",
      width: "20%",
      ...getColumnSearchProps("cusname"),
      sorter: (a, b) => a.cusname.length - b.cusname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะ",
      dataIndex: "srstatus",
      key: "srstatus",
      width: "20%",
      ...getColumnSearchProps("srstatus"),
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
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
          danger
          style={{ cursor: "pointer" }}
          onClick={(e) => showEditModal(text.srcode)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const defaultColumns = [
    {
      title: "ลำดับ",
      key: "index",
      align: "center",
      render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
    },
    {
      title: "รหัสสินค้า",
      key: "productCode",
      dataIndex: "productCode",
    },
    {
      title: "ชื่อสินค้า",
      key: "productName",
      dataIndex: "productName",
    },
    {
      title: "จำนวน",
      key: "productQty",
      dataIndex: "productQty",
      align: "center",
      editable: true,
      width: "10%",
    },
    {
      title: "หน่วย",
      align: "center",
      key: "productUnit",
      dataIndex: "productUnit",
    },
    {
      title: "ราคาซื้อ",
      key: "productPrice",
      dataIndex: "productPrice",
      align: "right",
      width: "10%",
    },
    {
      title: "ส่วนลด",
      key: "productDiscount",
      dataIndex: "productDiscount",
      align: "right",
      editable: true,
      width: "10%",
    },
    {
      title: "ราคาทั้งหมด",
      key: "productTotalPrice",
      dataIndex: "productTotalPrice",
      align: "right",
      render: (productTotalPrice) => productTotalPrice?.toLocaleString(),
    },
    {
      align: "center",
      key: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        selectedList.length >= 1 ? (
          <Button
            className="bt-icon"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record?.productCode)}
          />
        ) : null,
    },
  ];

  const columnscuscode = [
    {
      title: "Customer Code",
      dataIndex: "cuscode",
      key: "cuscode",
      width: "40%",
      ...getColumnSearchProps("cuscode"),
      sorter: (a, b) => a.cuscode.length - b.cuscode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Customer Name",
      dataIndex: "cusname",
      key: "cusname",
      width: "60%",
      ...getColumnSearchProps("cusname"),
      sorter: (a, b) => a.cusname.length - b.cusname.length,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const components = {
    body: { row: EditableRow, cell: EditableCell },
  };

  const columnsOrder = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleDelete = (productCode) => {
    const newData = selectedList.filter(
      (item) => item?.productCode !== productCode
    );
    setSelectedList(newData);
  };

  const handleSave = (row) => {
    if (row?.productQty > 0) {
      const newData = [...selectedList];
      const index = newData.findIndex(
        (item) => row?.productCode === item?.productCode
      );
      const item = newData[index];
      row["productTotalPrice"] =
        row?.productQty * row?.productPrice - row?.productDiscount;
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setSelectedList(newData);
    }
  };

  const handleSelectedItem = (record) => {
    const newData = {
      productCode: record?.stcode,
      productName: record?.stname,
      productQty: 1,
      productUnit: record?.unit,
      productPrice: +record?.price,
      productDiscount: 0,
      productTotalPrice: +record?.price,
    };

    setIsShowModalItem(false);
    setSelectedList([...selectedList, newData]);
  };

  const checkDupItem = (itemCode) => {
    let isDup = false;
    selectedList.map((item) => {
      if (item?.productCode === itemCode) isDup = true;
      return item;
    });
    return isDup;
  };

  const resetData = () => {
    setItemList([]);
    setSelectedList([]);
  };

  const handleCloseModal = () => {
    resetData();
    setIsOpenModalAdd(false);
    setIsOpenModalEdit(false);
  };

  const selectItemColumn = [
    {
      title: "",
      key: "tools",
      align: "center",
      render: (record) => (
        <Button
          type="primary"
          className="bt-icon"
          icon={<PlusOutlined />}
          disabled={checkDupItem(record?.stcode)}
          onClick={() => handleSelectedItem(record)}
        />
      ),
    },
    {
      title: "รหัสสินค้า",
      key: "stcode",
      dataIndex: "stcode",
      width: "100px",
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "stname",
      key: "stname",
      width: "50%",
    },
    {
      title: "ราคาต่อหน่วย",
      key: "price",
      dataIndex: "price",
      align: "right",
      render: (price) => {
        let nextPrice = parseFloat(price).toFixed(2);
        return nextPrice?.toLocaleString();
      },
    },
  ];

  const GetSR = () => {
    SRService.getSR()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllSR(data);
        }
      })
      .catch((err) => {});
  };
  const GetCustomer = () => {
    CustomerService.getAllCustomer()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllCustomer(data);
        }
      })
      .catch((err) => {});
  };

  const showAddModal = () => {
    SRService.getSRcode()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          // console.log(data.replaceAll('"', ''))
          formAdd.setFieldValue("Add_srcode", data.replaceAll('"', ""));
        }
      })
      .catch((err) => {});
    setIsOpenModalAdd(true);
  };

  const showEditModal = (data) => {
    SRService.getSupSR(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formEdit.setFieldValue("Edit_srcode", data.srcode);
          formEdit.setFieldValue("Edit_srdate", dayjs(data.srdate, dateFormat));
          formEdit.setFieldValue("Edit_stcode", data.stcode);

          setIsOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    // ==== CALL API TO CREATE SR HERE ==== //
    console.log("selectedList ==> ", selectedList);
    resetData();
    setIsOpenModalAdd(false);

    // SRService.addSR(dataform)
    //   .then(async (res) => {
    //     let { status, data } = res;
    //     if (status === 200) {
    //       if (data.status) {
    //         await Swal.fire({
    //           title: "<strong>สำเร็จ</strong>",
    //           html: data.message,
    //           icon: "success",
    //         });

    //         GetItem();
    //         setOpenModalAdd(false);
    //         formAdd.resetFields();
    //       } else {
    //           Swal.fire({
    //             title: "<strong>" + data.message + "</strong>",
    //             html: "ผิดพลาด",
    //             icon: "error",
    //           });
    //       }
    //     }
    //   })
    //   .catch((err) => {});
  };

  // const submitEdit = (dataform) => {
  //   // UserService.editUser(dataform)
  //   //   .then(async (res) => {
  //   //     let { status, data } = res;
  //   //     if (status === 200) {
  //   //       if (data.status === '1') {
  //   //         await Swal.fire({
  //   //           title: "<strong>สำเร็จ</strong>",
  //   //           html: data.message,
  //   //           icon: "success",
  //   //         });
  //   //         GetUser();
  //   //         setOpenModalAdd(false);
  //   //       } else {
  //   //         // alert(data.message)
  //   //         Swal.fire({
  //   //           title: "<strong>ผิดพลาด!</strong>",
  //   //           html: data.message,
  //   //           icon: "error",
  //   //         });
  //   //       }
  //   //     }
  //   //   })
  //   //   .catch((err) => {});
  // };

  return (
    <>
      <div className="layout-content">
        <div>
          <Text type="danger">กำลังปรับปรุง</Text>
        </div>
        <Button type="primary" onClick={() => showAddModal()}>
          เพิ่ม Sample Request
        </Button>

        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table size="small" columns={columns} dataSource={AllSR} />
            </Card>
          </Col>
        </Row>
      </div>
      {/* Modal Add */}
      <Modal
        open={isOpenModalAdd}
        title="เพิ่ม Sample Request"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCloseModal}
        onOk={() => {
          formAdd
            .validateFields()
            .then((values) => {
              // console.log(values)
              submitAdd(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        width={1000}
        maskClosable={false}
      >
        <Card style={{ marginBottom: "1rem" }}>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={5}>
              รหัส SR :
              <Form.Item
                name="Add_srcode"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={5}>
              วันที่ :
              <Form.Item
                name="Add_srdate"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={5}>
              รหัสลูกค้า :
              <Form.Item
                name="Add_cuscode"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={20} xl={17}>
              ชื่อลูกค้า :
              <Form.Item
                name="Add_cusname"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={4} xl={2}>
              <Button
                type="primary"
                style={{
                  marginTop: 22,
                  width: 55,
                }}
                icon={<SearchOutlined />}
                onClick={() => setIsShowModalCustomer(true)}
              ></Button>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                name="Add_description"
                rules={[
                  {
                    required: true,
                    message: "Please input your data!",
                  },
                ]}
              >
                รายละเอียด :
                <TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Row gutter={[16, 0]}>
          <Col
            style={{ marginBottom: 16 }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <Space gap="small" align="center" wrap="wrap">
              <Button
                style={{
                  width: 120,
                }}
                type="primary"
                icon={
                  <PlusOutlined
                    style={{
                      fontSize: "16px",
                    }}
                  />
                }
                onClick={() => setIsShowModalItem(true)}
              >
                Add item
              </Button>
              <Button
                style={{
                  width: 120,
                }}
                type="primary"
                icon={
                  <InboxOutlined
                    style={{
                      fontSize: "17px",
                    }}
                  />
                }
                onClick={showDrawer}
              >
                Upload
              </Button>
              <Drawer
                title="Upload"
                placement="right"
                onClose={onClose}
                open={openDrawer}
                size="large"
              >
                <Form.Item>
                  <FileControl title={`แนบไฟล์ สำหรับ Code : `} refCode = {'0001'} refTable="srmaster" noExpire={true} />
                </Form.Item>
              </Drawer>
            </Space>
          </Col>
        </Row>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={selectedList}
          columns={columnsOrder}
          pagination={false}
          rowKey="productCode"
        />
      </Modal>
      {/* Modal Edit */}
      <Modal
        open={isOpenModalEdit}
        title="แก้ใข Sample Request"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCloseModal}
        onOk={() => {
          formEdit
            .validateFields()
            .then((values) => {
              // console.log(values)
              submitAdd(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        width={1000}
        maskClosable={false}
      >
        <Card style={{ marginBottom: "1rem" }}>
          <Form
            form={formEdit}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={5}>
                รหัส SR :
                <Form.Item
                  name="Edit_srcode"
                  rules={[
                    {
                      required: true,
                      message: "Please input your data!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={5}>
                วันที่ :
                <Form.Item
                  name="Edit_srdate"
                  rules={[
                    {
                      required: true,
                      message: "Please input your data!",
                    },
                  ]}
                >
                  <DatePicker
                    size="large"
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={5}>
                รหัสลูกค้า :
                <Form.Item
                  name="Edit_cuscode"
                  rules={[
                    {
                      required: true,
                      message: "Please input your data!",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={20} xl={17}>
                ชื่อลูกค้า :
                <Form.Item
                  name="Edit_cusname"
                  rules={[
                    {
                      required: true,
                      message: "Please input your data!",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={4} xl={2}>
                <Button
                  type="primary"
                  style={{
                    paddingLeft: 7,
                    marginTop: 22,
                    width: 55,
                  }}
                  icon={<SearchOutlined />}
                  onClick={() => setIsShowModalCustomer(true)}
                ></Button>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name="Edit_description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your data!",
                    },
                  ]}
                >
                  รายละเอียด :
                  <TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Row gutter={[16, 0]}>
          <Col
            style={{ marginBottom: 16 }}
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <Space gap="small" align="center" wrap="wrap">
              <Button
                style={{
                  width: 120,
                }}
                type="primary"
                icon={
                  <PlusOutlined
                    style={{
                      fontSize: "16px",
                    }}
                  />
                }
                onClick={() => setIsShowModalItem(true)}
              >
                Add item
              </Button>
              <Button
                style={{
                  width: 120,
                }}
                type="primary"
                icon={
                  <InboxOutlined
                    style={{
                      fontSize: "17px",
                    }}
                  />
                }
                onClick={showDrawer}
              >
                Upload
              </Button>
              <Drawer
                title="Upload"
                placement="right"
                onClose={onClose}
                open={openDrawer}
              >
                <Form.Item>
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibited
                      from uploading company data or other banned files.
                    </p>
                  </Dragger>
                </Form.Item>
              </Drawer>
              <Button
                style={{
                  width: 120,
                }}
                type="primary"
                danger
                icon={
                  <DeleteOutlined
                    style={{
                      fontSize: "17px",
                    }}
                  />
                }
                // onClick={() => setIsShowModalItem(true)}
              >
                Delete
              </Button>
            </Space>
          </Col>
        </Row>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={selectedList}
          columns={columnsOrder}
          pagination={false}
          rowKey="productCode"
        />
      </Modal>
      {/* Modal เลือกสินค้า */}
      <Modal
        open={isShowModalItem}
        title="เลือกสินค้า"
        onCancel={() => setIsShowModalItem(false)}
        footer={<Button onClick={() => setIsShowModalItem(false)}>ปิด</Button>}
      >
        <Table
          rowClassName={() => "editable-row"}
          bordered
          dataSource={itemList}
          columns={selectItemColumn}
          rowKey="stcode"
        />
      </Modal>
      {/* Modal เลือกลูกค้า */}
      <Modal
        open={isShowModalCustomer}
        title="เลือกลูกค้า"
        onCancel={() => setIsShowModalCustomer(false)}
        footer={
          <Button onClick={() => setIsShowModalCustomer(false)}>ปิด</Button>
        }
      >
        <Table
          columns={columnscuscode}
          dataSource={AllCustomer}
          rowKey="supcode"
          onRow={(record) => {
            return {
              onClick: () => {
                if (isOpenModalAdd) {
                  formAdd.setFieldValue("Add_cuscode", record.cuscode);
                  formAdd.setFieldValue("Add_cusname", record.cusname);
                } else if (isOpenModalEdit) {
                  formEdit.setFieldValue("Edit_cuscode", record.cuscode);
                  formEdit.setFieldValue("Edit_cusname", record.cusname);
                }
                setIsShowModalCustomer(false);
              },
            };
          }}
        />
      </Modal>
    </>
  );
};

export default SR;
