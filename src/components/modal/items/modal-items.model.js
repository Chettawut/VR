/** get items column */
import { TagItemTypes } from "../../badge-and-tag";
export const columns = ()=>{
  return [
    {
      title: "รหัสสินค้า",
      key: "stcode",
      dataIndex: "stcode", 
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "stname",
      key: "stname",
    },
    {
      title: "ชื่อสินค้า(EN)",
      dataIndex: "stnameEN",
      key: "stnameEN",
    },
    {
      title: "ชนิดสินค้า",
      dataIndex: "typename",
      key: "typename",
      render: (h)=><TagItemTypes data={h} />,
    },
  ]
};