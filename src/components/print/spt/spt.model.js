import { formatCommaNumber } from "../../../utils/util";

/** get column for view sample preparation detail */
export const spColumnsView = [
    {
      title: "ลำดับ",
      key: "index",
      align: "left",
      width: '5%',
      render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
    },
    {
      title: "Code",
      key: "stcode",
      dataIndex: "stcode",
      width: '10%',
    },
    {
      title: "ชื่อส่วนผสม",
      key: "stname",
      dataIndex: "stname",
      width: '30%',
    },
    {
      title: "น้ำหนัก(g)",
      key: "amount",
      dataIndex: "amount", 
      align: "right",
      width: '10%',
      className:"field-edit pe-2",
      render: (v) => formatCommaNumber(Number( v || 0 )),
    },
    {
      title: "%",
      align: "right",
      width: '10%',
      className:"pe-2",
      key: "percent",
      dataIndex: "percent",
      render: (v) => formatCommaNumber(Number( v || 0 ) * 100,2,2),
    },
    {
      title: "%(total)",
      align: "right",
      width: '10%',
      className:"pe-2",
      key: "totalpercent",
      dataIndex: "totalpercent",
      render: (v, record, idx) => (v !== null && !!record.stname)  ? formatCommaNumber(Number( v ) * 100,2,2) : "",
    },
    {
      title: "Method",
      align: "left",
      key: "method",
      dataIndex: "method", 
      className:"field-edit ps-2",
      width: '25%',
    } 
] 

/** get column for view sample preparation parameter */

export const parameterColumnView = [
    {
      title: "Parameter Name",
      key: "paraname",
      dataIndex: "paraname", 
      align: "left", 
      width: '35%',
    },
    {
      title: "Preparation Value",
      align: "left",
      width: '20%',
      key: "preparation",
      dataIndex: "preparation",
      className:"field-edit",
    },
    {
      title: "Cut Out Value",
      align: "left",
      width: '20%',
      key: "cutout",
      dataIndex: "cutout",
      className:"field-edit",
    },
    {
      title: "Remark",
      align: "left",
      key: "remark",
      width: '25%',
      dataIndex: "remark",
      className:"field-edit",
    },
];