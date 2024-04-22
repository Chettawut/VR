import { Typography } from "antd"; 
import { formatCommaNumber } from "../../../utils/util";
export const sampleCostColumn = () => ([
    {
      title: "No.",
      key: "spno",
      // width: 80,
      dataIndex: "spno", 
      onCell: (v, index) => { 
        return (!v.spno && v?.id.startsWith('next to step')) ? { 
          colSpan:9, 
          style:{ backgroundColor:{ value: '#f0f0f0!important', important: true }, color:'#b4b5b9' }, 
          align: "center" 
        } : {} 
      },    
      render:( v, record) => {
          const { id } =  record; 
          return id?.startsWith('next to step') ? (
            <Typography.Text className="!bg-gray-100 block w-full"><i>{id}</i></Typography.Text>
           ) : v;
      }
    },  
    {
      title: "Item No.",
      key: "stcode",
      dataIndex: "stcode",
      align: "left",
      // width:100,
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
          className:(!v.spno) ? 'font-semibold ' : ''
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
          className:(!v.spno) ? 'font-semibold ' : ''
        } 
      }, 
      render: (v, record) => {
        return  !!record.spno && formatCommaNumber(Number( v || 0 ))
      },
      // width:'12%',
    },   
    // {
    //   title: "Multiply",
    //   key: "multiply",
    //   dataIndex: "multiply",
    //   align: "right",  
    //   className:"field-edit !pe-3",
    //   onCell: (v, index) => { 
    //     return (!v.spno && v?.id.startsWith('next to step')) ? { 
    //       colSpan:0, 
    //       // style:{ backgroundColor:'#f0f0f0', color:'#b4b5b9' }, 
    //       // align: "center" 
    //     } : { 
    //       className:(!v.spno) ? 'font-semibold ' : ''
    //     } 
    //   }, 
    //   render: (v, record) =>  !!record.spno && formatCommaNumber(Number( v || 0 )),
    //   // width:'12%',
    // },  
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
          className:(!v.spno) ? 'font-semibold ' : ''
        } 
      }, 
      render: (v, record) => {
        if( record?.id?.endsWith("-lost") ) return < >{formatCommaNumber(Number( v || 0 ))} %</> 
        else if( record?.id?.endsWith("-after") ) return < >{formatCommaNumber(Number( v || 0 ),2,2)}</> 
        else return formatCommaNumber(Number( v || 0 ))
      },
      // width:'12%',
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
          className:(!v.spno) ? 'font-semibold ' : ''
        } 
      }, 
      render: (v, record) =>  !!record.spno && <>{formatCommaNumber(Number( v || 0 ))} %</>,
      // width:'12%',
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
          className:(!v.spno) ? 'font-semibold ' : ''
        } 
      },   
      render: (v, record) =>  !!record.spno && formatCommaNumber(Number( v || 0 )),
      // width:'12%',
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
          className:(!v.spno || v?.id?.endsWith("-total")) ? 'font-semibold ' : ''
        } 
      },   
      render: (v, record) =>  (!!record.spno || record?.id?.endsWith("-total") || record?.id?.endsWith("-after")) && formatCommaNumber(Number( v || 0 )),
      // width:'12%',
    },  
]);

export const packingCostColumns = () => {
  return [
    {
      title: "Packaging Name", 
      className:'field-edit max-w-52 require-value',
      key: "pkanme",
      dataIndex: "pkname", 
      align: "left", 
    },   
    {
      title: "Price",
      width: '8%',
      align: 'right',
      key: "price",
      dataIndex: "price",
      className:"field-edit !pe-3",
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Lost(%)</>),
      align: "right",
      width: '8%',
      key: "lost",
      dataIndex: "lost",
      className:"field-edit !pe-3",
      type:'input',
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Transport</>),
      align: "right",
      width: '8%',
      key: "transport",
      dataIndex: "transport",
      className:"field-edit !pe-3",
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Pcs/Carton</>),
      align: "right",
      width: '8%',
      key: "pcs_carton",
      dataIndex: "pcs_carton",
      className:"field-edit !pe-3",
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },      
    {
      title: (<>Weight/Unit</>),
      align: "right",
      width: '8%', 
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
      width: '8%', 
      key: "cost",
      dataIndex: "cost",
      className:"field-edit !pe-3",
      render: (_, record) => {
        const v = Number(record?.cost || 0 )
        return formatCommaNumber(Number( v || 0 ))
      }
    },
    {
      title: (<>Weight/Carton</>),
      align: "right",
      width: '8%',
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
      width: '8%',
      key: "cost_carton",
      dataIndex: "cost_carton",
      className:"field-edit !pe-3",
      render: (_, record) => {
        const v = Number(record?.cost || 0 ) *  Number( record?.pcs_carton || 0)
        return formatCommaNumber(Number( v || 0 ))
      }
    },
  ]
};