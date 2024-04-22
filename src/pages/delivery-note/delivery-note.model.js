import { Popconfirm, Space } from "antd"; 
// import { Typography } from "antd"; 
import { Button } from "antd";
// import { Popconfirm} from "antd";
import { 
  DeleteOutlined,
  EditOutlined,
  PrinterOutlined, QuestionCircleOutlined, 
  // QuestionCircleOutlined, 
  // DeleteOutlined 
} from "@ant-design/icons"; 
import dayjs from 'dayjs';
 
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";

/** get sample column */
export const accessColumn = ({handleEdit, handleDelete, handleView}) => [
    {
      title: "Delivery Note No.",
      key: "dncode",
      dataIndex: "dncode",
      align: "left",
      sorter: (a, b) => (a?.dncode || "").localeCompare(b?.dncode || ""),
      width: '90px',
    },
    {
      title: "Delivery Date.",
      dataIndex: "dndate",
      key: "dndate",
      sorter: (a, b) => (a?.dndate || "").localeCompare(b?.dndate || ""),
      render: (v) => dayjs(v).format("DD/MM/YYYY"),
      width: '110px',
    },
    {
      title: "Sample Request Code",
      dataIndex: "srcode",
      key: "srcode",
      sorter: (a, b) => (a?.srcode || "").localeCompare(b?.srcode || ""),
      width: '110px',
    },
    {
      title: "Sample Name",
      dataIndex: "spresult",
      key: "spresult", 
      sorter: (a, b) => (a?.spresult || "").localeCompare(b?.spresult || ""),
      render: (v) => ( <div className="sm-name" dangerouslySetInnerHTML={{ __html: v }} ></div> )
    },
    {
      title: "Custemer",
      dataIndex: "cuscode",
      key: "cuscode",
      sorter: (a, b) => (a?.cuscode || "").localeCompare(b?.cuscode || ""),
      render: (_, record) => `${record.cuscode} - ${record.cusname}`,
      width: '20%',
    },
    {
      title: "Request Date",
      dataIndex: "created_date",
      key: "created_date", 
      width: '110px',
      sorter: (a, b) => (a?.created_date || "").localeCompare(b?.created_date || ""),
      render: (v) => dayjs(v).format("DD/MM/YYYY"),
    },
    {
      title: "Action",
      key: "operation",
      width: '90px',
      fixed: 'right',
      render: (text, record) => (
        <Space >
          <Button
            icon={<EditOutlined />} 
            className='bn-primary-outline'
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onClick={(e) => handleEdit(record) }
            size="small"
          />
          <Button
            icon={<PrinterOutlined />} 
            className='bn-warning-outline'
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onClick={(e) => handleView(record) }
            size="small"
          />
          <Popconfirm 
            placement="topRight"
            title="Sure to delete?"  
            description="Are you sure to delete this sample preparation?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record)}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
              size="small"
            />
          </Popconfirm>
          {/* <ButtonAttachFiles code={record.srcode} refs='Sample Request' showExpire={true} /> */}
        </Space>
      ),
    },    
];

/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

/** get column for edit table parameter */
export const detailColumns = ({ handleAction }) => {
  return [
    {
      title: "No.",
      key: "index",
      align: "left",
      width: 80,
      render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
    },
    {
      title: "Code",
      align: "left",
      width: 160,
      key: "stcode",
      dataIndex: "stcode",
    },
    {
      title: (<>รายละเอียดตัวอย่าง/Description</>),
      align: "left",
      key: "stname",
      dataIndex: "stname",
    },
    {
      title: (<>จำนวนส่ง/Quantity</>),
      align: "right",
      width: 160,
      editable: true,
      required: false,
      key: "qty",
      dataIndex: "qty",
      className:"field-edit pe-2",
      type:'input',
    },
    {
      title: (<>Appreve Date</>),
      align: "left",
      width: 120,
      key: "approved_date",
      dataIndex: "approved_date",
      render:(v) => dayjs(v).format("DD/MM/YYYY")
    },
    {
      title: (<>Appreve By</>),
      align: "left",
      width: 120,
      key: "approved_name",
      dataIndex: "approved_name",
    },
    {
      title: "Remark",
      align: "left",
      key: "remark",
      width: 210,
      dataIndex: "remark",
      editable: true,
      required: false, 
      type:'input',
      className:"field-edit",
    },
    {
      title: "ตัวเลือก",
      align: "center",
      key: "operation",
      dataIndex: "operation",
      render: (_, record, idx) => handleAction(record),
      width: '90px',
      fixed: 'right',
    },
  ]
};

export const columnsDetailsEditable = (handleSave, {handleAction, nameOption} ) =>{
  const col = detailColumns({handleAction, nameOption});
  return col.map((col, ind) => {
      if (!col.editable) { return col; }
      return {
          ...col,
          onCell: (record) => {
            // console.log(record);
            return {
              record,
              editable: col.editable,
              dataIndex: col.dataIndex,
              title: col.title,
              handleSave,
              fieldType: !!col?.textArea,
              required: !!col?.required,
              type: col?.type || 'input',
              autocompleteOption: col.autocompleteOption
            }
          },
      };
  }); 
}