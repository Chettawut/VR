import { Typography } from "antd"; 
// import dayjs from 'dayjs';
/** get items column */
export const columns = ({handleChoose})=>{
    const Link = Typography.Link;
    return [
      {
        title: "Supplier Code",
        key: "supcode",
        dataIndex: "supcode", 
        width: 94,
        render: (v, record) => <Link className="text-select hover:underline underline-offset-1" onClick={()=>handleChoose(record)}>{v}</Link>
      },
      {
        title: "Supplier Name",
        dataIndex: "supname",
        key: "supname", 
        render: (v, record) => <Link className="text-select hover:underline underline-offset-1" onClick={()=>handleChoose(record)}>{v}</Link>
      },
      {
        title: "Supplier Type",
        dataIndex: "type",
        key: "type",
        width: 184, 
        render: (v, record) => <Link className="text-select hover:underline underline-offset-1" onClick={()=>handleChoose(record)}>{v}</Link>
      },
    ]
  };