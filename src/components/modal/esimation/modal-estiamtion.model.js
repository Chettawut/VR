import { 
  // Button, 
  // Flex, 
  // Popconfirm, 
  Tooltip, 
  Typography } from "antd"; 
import { formatCommaNumber } from "../../../utils/util";
/** get items column */
export const columns = ({handleChoose, handleEdit, handleDeleted})=>{
    const Link = Typography.Link;
    const LChoose = ({children, record}) => (
      <Link 
      className="text-select" 
      onClick={()=>handleChoose(record)} 
      >{children}</Link>
    );
    return [
      {
        title: "Product Code",
        key: "spcode",
        dataIndex: "spcode", 
        render: (v, record) => <LChoose record={record}>{v}</LChoose>
      },
      {
        title: "Product Name",
        key: "spname",
        dataIndex: "spname",
        ellipsis: {
          showTitle: false,
        },
        width:'30%',
        render: (v, record) => <LChoose record={record}> <Tooltip placement="topLeft" title={v}>{v}</Tooltip></LChoose>
      },
      {
        title: "Estimate Cost",
        dataIndex: "estcode",
        key: "estcode",  
        width: 180,
        render: (v, record) => <LChoose record={record}>{v}</LChoose>
      },
      {
        title: "Packing",
        dataIndex: "packingset_name",
        key: "packingset_name",
        width:'30%',
        render: (v, record) => <LChoose record={record}>{v}</LChoose>
      },
      {
        title: "Ex-work cost",
        dataIndex: "exworkcost_carton",
        key: "exworkcost_carton",
        align: 'right',
        className: '!pe-4',
        width: 120,
        fixed: 'right',
        render: (v, record) => <LChoose record={record}>{formatCommaNumber(Number(v || 0))}</LChoose>
      },
    ]
};