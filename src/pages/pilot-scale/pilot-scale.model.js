import { Space } from "antd"; 
// import { Typography } from "antd"; 
import { Button } from "antd";
import { Popconfirm} from "antd";
import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import dayjs from 'dayjs';
import { formatCommaNumber } from '../../utils/util';
/** get sample column */
export const accessColumn = ({handleEdit, handleDelete, handleView}) => [
  {
    title: "Pilot Scale No.",
    key: "pilotscale_code",
    dataIndex: "pilotscale_code",
    align: "left", 
  },
  {
    title: "Sample Preparation No.",
    dataIndex: "spcode",
    key: "spcode",  
  },
  {
    title: "Sample Preparation Name",
    dataIndex: "spname",
    key: "spname"
  },
  {
    title: "Package",
    dataIndex: "pkname",
    key: "pkname", 
  },
  {
    title: "Batch Size(kg)",
    dataIndex: "batchsize",
    key: "batchsize",
    align: 'right',
    className: '!pe-4'
  },
  // {
  //   title: "Request By",
  //   dataIndex: "created_name",
  //   key: "created_name", 
  // },
  // {
  //   title: "Request Date",
  //   dataIndex: "created_date",
  //   key: "created_date", 
  //   render: (v) => dayjs(v).format("DD/MM/YYYY"),
  // },
  {
    title: "Update By",
    dataIndex: "updated_name",
    key: "updated_name", 
  },
  {
    title: "Update Date",
    dataIndex: "updated_date",
    key: "updated_date", 
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: "Action",
    key: "operation",
    width: '180px',
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
        {/* <Button
          icon={<PrinterOutlined />} 
          className='bn-warning-outline'
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={(e) => handleView(record) }
          size="small"
        /> */}
        <Popconfirm 
          placement="topRight"
          title="Sure to delete?"  
          description="Are you sure to delete this sample preparation?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleDelete(record)}
          getPopupContainer={document.querySelector(".modal-packingset-group")}
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
]


export const itemsColumn = ({handlePilotScale}) => [
  {
    title: "No",
    key: "no",
    dataIndex: "no", 
    width: 90,
    onCell: (v, index) => { 
      return !v.stcode ? { 
        colSpan:7, 
        style:{ backgroundColor:'#f0f0f0', color:'#b4b5b9' }, 
        align: "center" 
      } : {} 
    },
    render: (v, record, index) => (!!record.stcode ? `${index + 1 - (Number(record.stepno) - 1)}` : <b><i>Next Step</i></b>)
  },
  {
    title: "Item Code",
    dataIndex: "stcode",
    key: "stcode",  
    onCell: (v, index) => { return !v.stcode ? { colSpan:0} : {} },
  },
  {
    title: "Item Name",
    dataIndex: "stname",
    key: "stname",
    onCell: (v, index) => { return !v.stcode ? { colSpan:0} : {} },
  },
  {
    title: "Weight (g.)",
    align: 'right',
    className: 'pe-2',
    dataIndex: "amount",
    key: "amount",
    width: 120,
    onCell: (v, index) => { return !v.stcode ? { colSpan:0} : {} },
    render:(v) => formatCommaNumber(Number(v)),
  },
  {
    title: "%",
    align: 'right',
    className: 'pe-2',
    dataIndex: "totalpercent",
    key: "totalpercent",
    width: 120,
    onCell: (v, index) => { return !v.stcode ? { colSpan:0} : {} },
    render:(v) => formatCommaNumber(Number(v) * 100),
  },
  {
    title: "Pilot Scale (g.)",
    dataIndex: "pilot_scale",
    key: "pilot_scale",
    align: 'right',
    className: 'pe-2',
    width: 120,
    onCell: (v, index) => { return !v.stcode ? { colSpan:0} : {} },
    render:(_, record) => formatCommaNumber( handlePilotScale(record) )
  },  
  {
    title: "Remark",
    dataIndex: "description",
    onCell: (v, index) => { return !v.stcode ? { colSpan:0} : {} },
    key: "description", 
  },

];

export const parameterColumn = [
  {
    title: "Parameter Name",
    key: "paraname",
    dataIndex: "paraname", 
    align: "left",  
  },
  {
    title: "Preparation Value",
    align: "left",
    width: 220,
    key: "preparation",
    dataIndex: "preparation",
    className:"field-edit",
  },
  {
    title: "Cut Out Value",
    align: "left",
    width: 220,
    key: "cutout",
    dataIndex: "cutout",
    className:"field-edit",
  },
  {
    title: "Remark",
    align: "left",
    key: "remark",
    dataIndex: "remark",
    className:"field-edit",
  },
];
