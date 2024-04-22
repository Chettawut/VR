import { Space, Tag } from "antd"; 
// import { Typography } from "antd"; 
import { Button } from "antd";
import { Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons"; 
// import dayjs from 'dayjs';
import { formatCommaNumber } from '../../utils/util';

// import { Popconfirm } from "antd";
// import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons"; 
/** get sample column */
export const accessColumn = ({handleEdit, handleDelete, handleView}) => [
  {
    title: "Packaging Name.",
    key: "pkname",
    dataIndex: "pkname",
    align: "left",  
    width: 210,
    ellipsis: {
      showTitle: false,
    },
    sorter: (a, b) => (a?.pkname || "").localeCompare(b?.pkname || ""),
    render: (v) => (
      <Tooltip placement="topLeft" title={v}>
        {v}
      </Tooltip>
    ),    
  },
  {
    title: "Packaging Name(TH).",
    dataIndex: "pknameTH",
    key: "pknameTH",  
    width: 210,
    sorter: (a, b) => (a?.pknameTH || "").localeCompare(b?.pknameTH || ""),
    ellipsis: {
      showTitle: false,
    },
    render: (v) => (
      <Tooltip placement="topLeft" title={v}>
        {v}
      </Tooltip>
    ),
  },
  {
    title: "Express Code",
    dataIndex: "expscode",
    key: "expscode",
    sorter: (a, b) => (a?.expscode || "").localeCompare(b?.expscode || ""),
  },
  {
    title: "Express Name",
    dataIndex: "expsname",
    key: "expsname", 
    width: 240,
    ellipsis: {
      showTitle: false,
    },
    sorter: (a, b) => (a?.expsname || "").localeCompare(b?.expsname || ""),
    render: (v) => (
      <Tooltip placement="topLeft" title={v}>
        {v}
      </Tooltip>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price", 
    align: 'right',
    className: '!pe-5',
    sorter: (a, b) => (a?.price || "").localeCompare(b?.price || ""),
    render: (v) => formatCommaNumber(Number(v))
  },
  {
    title: "Packaging Type",
    dataIndex: "pktype",
    key: "pktype", 
    sorter: (a, b) => (a?.pktype || "").localeCompare(b?.pktype || ""),
  },
  {
    title: "File Attaced",
    dataIndex: "file_attach",
    key: "file_attach",
    render: (data) => {
      const arr = data?.split(",") || [];
      return ( arr.length > 0 ? <Tag color="geekblue">{arr.length} files.</Tag> : <Tag color="default">empty.</Tag> )
    },
  },  
  // {
  //   title: "Update By",
  //   dataIndex: "updated_name",
  //   key: "updated_name", 
  // },
  // {
  //   title: "Update Date",
  //   dataIndex: "updated_date",
  //   key: "updated_date", 
  //   render: (v) => dayjs(v).format("DD/MM/YYYY"),
  // },
  {
    title: "Action",
    key: "operation", 
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
        {/* <Popconfirm 
          placement="topRight"
          title="Sure to delete?"  
          description="Are you sure to delete this packaging?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleDelete(record)}
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            size="small"
          />
        </Popconfirm> */}
        {/* <ButtonAttachFiles code={record.srcode} refs='Sample Request' showExpire={true} /> */}
      </Space>
    ),
  }, 
]

export const pkmaster = {
  pkcode : null,
  pkname : null,
  pknameTH : null,
  pktypeid : null,
  expscode : null,
  expsname : null,
  price : 0,
  transport : 0,
  lost : 0,
  cost : null,
  unitid : null,
  supcode : null,
  remark : null,
  dimension : null,
  weight_unit : 0,
}
