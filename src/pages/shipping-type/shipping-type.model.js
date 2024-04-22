import { 
  // Badge, 
  Space, 
  // Typography 
} from "antd";
import { Button } from "antd";
// import { PrinterOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import { EditOutlined } from "@ant-design/icons"; 
import dayjs from 'dayjs';
import { formatCommaNumber } from "../../utils/util";

export const accessColumn = ({handleEdit, handleDelete, handleView}) => [
    {
      title: "Shipping type",
      key: "shippingtype_name",
      dataIndex: "shippingtype_name",
      align: "left",
      sorter: (a, b) => (a?.shippingtype_name || "").localeCompare(b?.shippingtype_name || ""),
    },
    // {
    //   title: "Quantity",
    //   dataIndex: "qty",
    //   key: "qty",
    //   align: "right",
    //   className: "!pe-4",
    //   width: '10%',
    //   sorter: (a, b) => (a?.qty || "").localeCompare(b?.qty || ""),
    //   render: (v) => formatCommaNumber(Number( v || 0)),
    // },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      className: "!pe-4",
      width: '10%',
      sorter: (a, b) => (a?.price || "").localeCompare(b?.price || ""),
      render: (v) => formatCommaNumber( Number( v || 0) ),
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      key: "created_date",
      width: '12%',
      sorter: (a, b) => (a?.created_date || "").localeCompare(b?.created_date || ""),
      render: (_, head) =>  dayjs(head.created_date).format("DD/MM/YYYY")
    },
    {
      title: "Action",
      key: "operation",
      width: '60px',
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
        </Space>
      ),
    },    
]; 

export const shipping = {
    shipping_name: null,
    qty: 0,
}

export const shipping_expense_defualt = [
  { expense_name : "THC", },
  { expense_name : "B/L", },
  { expense_name : "transport", },
  { expense_name : "gate charge", },
  { expense_name : "lift", },
  { expense_name : "pallet", },

];