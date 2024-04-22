import { Flex, Space, Tag, Typography } from "antd"; 
// import { Typography } from "antd"; 
import { Button } from "antd";
import { Popconfirm } from "antd";
import { EditOutlined, QuestionCircleOutlined, DeleteOutlined, PrinterOutlined, TagsFilled } from "@ant-design/icons"; 
import dayjs from 'dayjs';
import { EditableCell, RowDrag } from "../../components/table/TableEditAble";
import { formatCommaNumber } from "../../utils/util";
/** get sample column */
export const accessColumn = ({handleEdit, handleDelete, handleView}) => [
  {
    title: "Estimate Code.",
    key: "estcode",
    dataIndex: "estcode",
    align: "left",  
    sorter: (a, b) => (a.estcode).localeCompare(b.estcode),
    width:160,
  },
  {
    title: "Sample No",
    dataIndex: "spcode",
    key: "spcode",
    sorter: (a, b) => (a.spcode).localeCompare(b.spcode),
    width:160, 
  },
  {
    title: "Sample Name",
    dataIndex: "spname",
    key: "spname",
    sorter: (a, b) => (a.spname).localeCompare(b.spname),
  },
  {
    title: "Tags",
    dataIndex: "tag",
    key: "tag",   
    width: '20%',
    render: (data) => {
      const tags = JSON.parse(data)?.map((str, i) =>
        <Tag icon={<TagsFilled />} color="#3b5999" key={i} className="m-0">
          {str}
        </Tag>
      );

      return <>
        <Flex wrap="wrap" gap={2}>{tags}</Flex>
      </>
    },
  },
  // {
  //   title: "Packing Set",
  //   dataIndex: "packingset_name",
  //   key: "packingset_name",Z
  // },
  // {
  //   title: "Request By",
  //   dataIndex: "created_name",
  //   key: "created_name", 
  //   width: '15%',
  //   ellipsis: {
  //     showTitle: false,
  //   },
  //   render: (v) => (
  //     <Tooltip placement="topLeft" title={v}>
  //       {v}
  //     </Tooltip>
  //   ), 
  // },
  {
    title: "Sample Date",
    dataIndex: "spdate",
    key: "spdate", 
    width: 160,
    sorter: (a, b) => (a.spdate).localeCompare(b.spdate),
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: "Estimate Cost Date",
    dataIndex: "created_date",
    key: "created_date", 
    width: 160,
    sorter: (a, b) => (a.created_date).localeCompare(b.created_date),
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: "Action",
    key: "operation", 
    fixed: 'right',
    width: 90,
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
        </Popconfirm>
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
  cost : 0,
  unitid : null,
  supcode : null,
  remark : null,
}

/** export component for edit table */
export const componentsEditable = {
  body: { row: RowDrag, cell: EditableCell },
};

/** get column for edit table parameter */
export const editColumns = ({ handleAction }) => {
  return [
    {
      width:40,
      key: 'sort',
    },    
    {
      title: "Packaging Name",
      ellipsis: true,
      editable: true,
      required: false,
      className:'field-edit max-w-52 require-value',
      key: "pkanme",
      dataIndex: "pkname", 
      align: "left", 
    },   
    {
      title: "Price",
      width: '9%',
      align: 'right',
      editable: true,
      required: false,
      key: "price",
      dataIndex: "price",
      className:"field-edit !pe-3",
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Transport</>),
      align: "right",
      width: '9%',
      editable: true,
      required: false,
      key: "transport",
      dataIndex: "transport",
      className:"field-edit !pe-3",
      type:'input',
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Lost(%)</>),
      align: "right",
      width: '9%',
      editable: true,
      required: false,
      key: "lost",
      dataIndex: "lost",
      className:"field-edit !pe-3",
      type:'input',
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },    
    {
      title: (<>Pcs/Carton</>),
      align: "right",
      width: '9%',
      editable: true,
      required: false,
      key: "pcs_carton",
      dataIndex: "pcs_carton",
      className:"field-edit !pe-3",
      type:'input',
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },      
    {
      title: (<>Weight/Unit</>),
      align: "right",
      width: '9%', 
      key: "weight_unit",
      editable: true,
      required: false,
      dataIndex: "weight_unit",
      className:"field-edit !pe-3",
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Cost/Unit</>),
      align: "right",
      width: '9%', 
      key: "cost",
      dataIndex: "cost",
      className:"field-edit !pe-3",
      render: (_, record) => {
        const v = (Number(record?.price || 0 ) + Number(record?.transport || 0 )) / ( 1 - (Number(record?.lost || 0 )/100));
        return formatCommaNumber(Number( v || 0 ))
      }
    },
    {
      title: (<>Weight/Carton</>),
      align: "right",
      width: '9%',
      key: "weight_carton",
      dataIndex: "weight_carton",
      className:"field-edit !pe-3",
      render: (_, record) => { 
        const v = Number(record?.weight_unit || 0 ) *  Number( record?.pcs_carton || 0)
        return formatCommaNumber(Number( v || 0 ))
      }
    },
    {
      title: (<>Cost/Carton</>),
      align: "right",
      width: '9%',
      key: "cost_carton",
      dataIndex: "cost_carton",
      className:"field-edit !pe-3",
      render: (_, record) => {
        const cost = (Number(record?.price || 0 ) + Number(record?.transport || 0 )) / ( 1 - (Number(record?.lost || 0 )/100))
        const v = cost *  Number( record?.pcs_carton || 0)
        return formatCommaNumber(Number( v || 0 ))
      }
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
  const col = editColumns({handleAction, nameOption});
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
              readonly: !(record?.id?.includes("next-") || ["pcs_carton"].includes(col.key)),
              autocompleteOption: col.autocompleteOption
            }
          },
      };
  }); 
}

export const sampleCostColumn = () => ([
  {
    title: "No.",
    key: "spno",
    width: 80,
    dataIndex: "spno", 
    onCell: (v, index) => { 
      return (!v.spno && v?.id.startsWith('next to step')) ? { 
        colSpan:9, 
        style:{ backgroundColor:'#f0f0f0', color:'#b4b5b9' }, 
        align: "center" 
      } : {} 
    },    
    render:( v, record) => {
        const { id } =  record; 
        return id?.startsWith('next to step') ? <i>{id}</i> : v;
    }
  },  
  {
    title: "Item No.",
    key: "stcode",
    dataIndex: "stcode",
    align: "left",
    width:100,
    onCell: (v, index) => { return (!v.spno && v?.id.startsWith('next to step')) ? { colSpan:0 } : {} },
  },  
  {
    title: "Item Name.",
    key: "stname",
    dataIndex: "stname",
    align: "left",
    onCell: (v, index) => { 
      return (!v.spno && v?.id.startsWith('next to step')) ? { 
        colSpan:0, 
        // style:{ backgroundColor:'#f0f0f0', color:'#b4b5b9' }, 
        // align: "center" 
      } : { 
        className:(!v.spno) ? 'font-semibold text-white !bg-slate-400' : ''
      } 
    }, 
  },  
  {
    title: "Weight(g).",
    key: "amount",
    dataIndex: "amount",
    align: "right",  
    onCell: (v, index) => { 
      return (!v.spno && v?.id.startsWith('next to step')) ? { 
        colSpan:0, 
        // style:{ backgroundColor:'#f0f0f0', color:'#b4b5b9' }, 
        // align: "center" 
      } : { 
        className:(!v.spno) ? 'font-semibold text-white !bg-slate-400' : ''
      } 
    }, 
    render: (v, record) => {
      return  !!record.spno && formatCommaNumber(Number( v || 0 ))
    },
    width:'12%',
  },   
  {
    title: "Multiply",
    key: "multiply",
    dataIndex: "multiply",
    align: "right",  
    className:"field-edit !pe-3",
    onCell: (v, index) => { 
      return (!v.spno && v?.id.startsWith('next to step')) ? { 
        colSpan:0, 
        // style:{ backgroundColor:'#f0f0f0', color:'#b4b5b9' }, 
        // align: "center" 
      } : { 
        className:(!v.spno) ? 'font-semibold text-white !bg-slate-400' : ''
      } 
    }, 
    render: (v, record) =>  !!record.spno && formatCommaNumber(Number( v || 0 )),
    width:'12%',
  },  
  {
    title: "Wt.in process",
    key: "weight_in_process",
    dataIndex: "weight_in_process",
    align: "right",  
    className:"field-edit !pe-3",
    onCell: (v, index) => { 
      return (!v.spno && v?.id.startsWith('next to step')) ? { 
        colSpan:0, 
        // style:{ backgroundColor:'#f0f0f0', color:'#b4b5b9' }, 
        // align: "center" 
      } : { 
        className:(!v.spno) ? 'font-semibold text-white !bg-slate-400' : ''
      } 
    }, 
    render: (v, record) => {
      if( record?.id?.endsWith("-lost") ) return <Typography.Text className="text-white">{formatCommaNumber(Number( v || 0 ))} %</Typography.Text> 
      else if( record?.id?.endsWith("-after") ) return <Typography.Text className="text-white">{formatCommaNumber(Number( v || 0 ),2,2)}</Typography.Text> 
      else return formatCommaNumber(Number( v || 0 ))
    },
    width:'12%',
  },  
  {
    title: "Yield",
    key: "yield",
    dataIndex: "yield",
    align: "right",  
    className:"field-edit !pe-3",
    onCell: (v, index) => { 
      return (!v.spno && v?.id.startsWith('next to step')) ? { 
        colSpan:0, 
        // style:{ backgroundColor:'#f0f0f0', color:'#b4b5b9' }, 
        // align: "center" 
      } : { 
        className:(!v.spno) ? 'font-semibold text-white !bg-slate-400' : ''
      } 
    }, 
    render: (v, record) =>  !!record.spno && <Typography.Text>{formatCommaNumber(Number( v || 0 ))} %</Typography.Text>,
    width:'12%',
  },  
  {
    title: "Rm cost/kg",
    key: "price",
    dataIndex: "price",
    align: "right",  
    className:"field-edit !pe-3",
    onCell: (v, index) => { 
      return (!v.spno && v?.id.startsWith('next to step')) ? { 
        colSpan:0, 
        // style:{ backgroundColor:'#f0f0f0', color:'#b4b5b9' }, 
        // align: "center" 
      } : { 
        className:(!v.spno) ? 'font-semibold text-white !bg-slate-400' : ''
      } 
    },   
    render: (v, record) =>  !!record.spno && formatCommaNumber(Number( v || 0 )),
    width:'12%',
  },  
  {
    title: "Sample cost/kg", 
    key: "sample_cost",
    dataIndex: "sample_cost",
    align: "right",
    className:`field-edit !pe-3`,
    onCell: (v, index) => { 
      return (!v.spno && v?.id.startsWith('next to step')) ? { 
        colSpan:0, 
      } : {  
        className:(!v.spno || v?.id?.endsWith("-total")) ? 'font-semibold text-white !bg-slate-400' : ''
      } 
    },   
    render: (v, record) =>  (!!record.spno || record?.id?.endsWith("-total") || record?.id?.endsWith("-after")) && formatCommaNumber(Number( v || 0 )),
    width:'12%',
  },  
]);

export const collapseSetting = (type, active, items, option={}) => ( { collapsible:type, defaultActiveKey:active, items:items, ...option } );