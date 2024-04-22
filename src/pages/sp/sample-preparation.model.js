import { 
  Button, 
  // Popconfirm, 
  Badge, 
  Tag,
  Flex,
  Popconfirm} from "antd";
import { 
  // CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined, 
  // DeleteOutlined, 
  // QuestionCircleOutlined, 
  ExclamationCircleOutlined,  
  PrinterOutlined,  
  QuestionCircleFilled,  
  TagsFilled} from "@ant-design/icons"; 
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
import { formatCommaNumber } from "../../utils/util";
import { TbClockCheck } from "react-icons/tb";
import { 
  // BadgeSamplePreparationStatus, 
  TagSamplePreparationApproveStatus 
} from "../../components/badge-and-tag";
import { ButtonAttachFiles } from "../../components/button";
import { Authenticate } from "../../service/Authenticate.service";
import dayjs from "dayjs";
import { LiaCertificateSolid } from "react-icons/lia";
import { PiStamp } from "react-icons/pi";
const authService = Authenticate();  
/** get column for show data SR Sample request */
export const columns = ({ handleAction, handleCustomerAppreved, handleView, handlePrint, handleCloseAttach }) => [ 
  {
    title: <PiStamp />,
    key: "cusapproved_status",
    dataIndex: "cusapproved_status",
    width:40,
    align:'center',
    sorter: (a, b) => (a.cusapproved_status).localeCompare(b.cusapproved_status),
    render:(v)=> v === 'Y' && <LiaCertificateSolid style={{fontSize: '1.6rem', color: '#0a810c' }} />
  },
  {
    title: "SP Code",
    dataIndex: "spcode",
    key: "spcode", 
    sorter: (a, b) => Number(a.spcode.replace(/[^0-9]/g, '')) - Number(b.spcode.replace(/[^0-9]/g, '')),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "SP Name",
    dataIndex: "spname",
    key: "spname", 
    sorter: (a, b) => a.spname.length - b.spname.length,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "SR Code",
    dataIndex: "srcode",
    key: "srcode", 
    sorter: (a, b) => Number(a.srcode.replace(/[^0-9]/g, '')) - Number(b.srcode.replace(/[^0-9]/g, '')),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "SP Date",
    dataIndex: "spdate",
    key: "spdate", 
    sorter: (a, b) => dayjs(a.spdate).valueOf() - dayjs(b.spdate).valueOf(),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Request By",
    dataIndex: "created_name",
    key: "created_name", 
    sorter: (a, b) => (a.firstname + a.lastname).localeCompare(b.firstname + b.lastname),
    sortDirections: ["descend", "ascend"],
    // render: (_, record) => `${record.firstname}  ${record.lastname}`,
  },
  // {
  //   title: "Status",
  //   dataIndex: "spstatus",
  //   key: "spstatus",
  //   sorter: (a, b) => a.spstatus.length - b.spstatus.length,
  //   sortDirections: ["descend", "ascend"],
  //   render: (data) => <BadgeSamplePreparationStatus data={data} />,
  // },
  {
    title: "Approve Status",
    dataIndex: "approved_result",
    key: "approved_result", 
    sorter: (a, b) => a.approved_result.localeCompare(b.approved_result),
    sortDirections: ["descend", "ascend"],
    render: (data) => <TagSamplePreparationApproveStatus result={data} />,
  },
  {
    title: "Tags",
    dataIndex: "tag",
    key: "tag",   
    width: 210,
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
  {
    title: "File Attaced",
    dataIndex: "file_attach",
    key: "file_attach",    
    render: (data) => {
      const arr = data?.split(",") || [];
      return ( arr.length > 0 ? <Tag color="geekblue">{arr.length} files.</Tag> : <Tag color="default">empty.</Tag> )
    },
  },    
  {
    title: "Action",
    key: "operation",
    width: '180px',
    fixed: 'right',
    render: (text, record) => { 
      // const arr = record?.file_attach?.split(",") || [];
      // const checkEdit = ( authService.getUserId() === record.created_by ) && record.approved_result === 'waiting_approve';
      return (
      <div style={{display:'flex', alignItems:'center', gap:'.5rem', justifyContent:'start'}} > 
        <Badge dot={ authService.getType() === 'admin' && record.approved_result === 'waiting_approve' } size="small" offset={[0, 1]}>
          <Button
            icon={<ExclamationCircleOutlined />} 
            className='bn-success-outline'
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onClick={(e) => handleView(record) }
            size="small"
          />
        </Badge>
        { record.spstatus  === 'pending' && record.approved_result  === 'waiting_approve' && 
          <Button
            icon={<EditOutlined />} 
            className='bn-primary-outline'
            style={{ cursor: "pointer", alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => handleAction(record) }
            size="small"
          />
        }        
 
        {/* <Popconfirm 
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
        </Popconfirm> */} 

        { (record.spstatus !== 'cancel') && <ButtonAttachFiles code={record.spcode} refs='Sample Preparation' showExpire={true} close={handleCloseAttach} /> }
        {/* <ButtonAttachFiles code={record.spcode} refs='Sample Preparation' showExpire={true} close={handleCloseAttach} /> */}
        <Button 
          icon={<PrinterOutlined />} 
          className='bn-warning-outline'
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={(e) => handlePrint(record) }
          size="small"
        />
        { record.approved_result  === 'approved' &&
          <>
            <Popconfirm 
              placement="topRight"
              title="Sure to set Customer approved?"  
              description="Are you sure to set this status?"
              icon={<QuestionCircleFilled />}
              onConfirm={() => handleCustomerAppreved(record)}
            >
                <Button
                  icon={record.cusapproved_status === 'N' ? <TbClockCheck style={{fontSize: '1rem'}} /> : <CloseCircleOutlined />}
                  className={`bn-center !text-white ${ ( record.cusapproved_status === 'N' ? "!bg-emerald-800 !border-emerald-800" : "!bg-red-700 !border-red-700") }`}
                  style={{ cursor: "pointer" }} 
                  size="small"
                />
            </Popconfirm>
          </>
        }
      
      </div>
    )},
  },
].filter((item) => !item.hidden);

/** get column for show data SR Sample request Detail */
export const defaultColumns = ({ handleAction }) => {
    return [
    {
      title: "ลำดับ",
      key: "index",
      align: "left",
      width: 80,
      render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
    },
    {
      title: "Code",
      key: "stcode",
      dataIndex: "stcode",
      width: 140,
    },
    {
      title: "ชื่อส่วนผสม",
      key: "stname",
      dataIndex: "stname",
    },
    {
      title: "น้ำหนัก(g)",
      key: "amount",
      dataIndex: "amount",
      editable: true,
      required: true,
      align: "right",
      width:120,
      className:"field-edit pe-2",
      render: (v) => formatCommaNumber(Number( v || 0 )),
    },
    {
      title: "%",
      align: "right",
      width: '6%',
      className:"pe-2",
      key: "percent",
      dataIndex: "percent",
      render: (v) => formatCommaNumber(Number( v || 0 ) * 100,2,2),
    },
    {
      title: "%(total)",
      align: "right",
      width: '6%',
      className:"pe-2",
      key: "totalpercent",
      dataIndex: "totalpercent",
      render: (v, record, idx) => v !== null ? formatCommaNumber(Number( v ) * 100,2,2) : "",
    },
    {
      title: "Multiply",
      align: "right",
      width: '6%',
      className:"pe-2",
      key: "multiply",
      dataIndex: "multiply",
      render: (v, record, idx) =>  formatCommaNumber(Number( v || 0 )),
    },
    {
      title: "Wt.in process",
      align: "right",
      width: '6%',
      className:"pe-2",
      key: "amount",
      dataIndex: "amount",
      render: (v, record, idx) => {
        const weight_in = Number(record?.amount || 0) * Number( record?.multiply || 0 );
        return  formatCommaNumber(Number( weight_in || 0 ),2,2);
      },
    },
    {
      title: "Yield(%)",
      align: "right",
      width: '6%',
      className:"pe-2",
      key: "yield",
      dataIndex: "yield",
      render: (v, record, idx) =>  `${formatCommaNumber(Number( v || 0 ) )}%`,
    },
    {
      title: "Rm cost/kg",
      align: "right",
      width: '6%',
      className:"pe-2",
      key: "price",
      dataIndex: "price",
      render: (v, record, idx) =>  formatCommaNumber(Number( v || 0 )),
    },    
    {
      title: "Sample cost/kg",
      align: "right",
      width: '6%',
      className:"pe-2",
      key: "cost",
      dataIndex: "cost",
      render: (v, record, idx) =>  formatCommaNumber(Number( v || 0 ),2,2),
    },
    {
      title: "Method",
      align: "left",
      key: "method",
      dataIndex: "method",
      editable: true,
      required: false,
      // textArea: true,
      className:"field-edit ps-2",
      width:180,
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

/** get column for edit table working in modal manage sr */
export const columnsDetailEditable = (handleSave, {handleAction} ) =>{
    const col = defaultColumns({handleAction});
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
                readonly: false, //!record.stcode && col.key === "amount",
                tabIndex: ind,
              }
            },
        };
    }); 
}  

/** export component for edit table */
export const componentsEditable = {
    body: { row: EditableRow, cell: EditableCell },
};

/** get items column */
export const itemsColumn = ({handleCheckDuplicate, handleSelectItems})=>{
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
      title: "ราคาต่อหน่วย",
      key: "price",
      dataIndex: "price",
      align: "right",
      width: '90px',
      render: (price) => {
        let nextPrice = parseFloat(price).toFixed(2);
        return nextPrice?.toLocaleString();
      },
    },
  ]
}; 

/** model data for sample request. */
export const spmaster = {
  srcode : null,
  spcode : null,
  spname : null,
  spdate : null,
  pkcode : null,
  netweight : null,
  method : null,
  pkname : null,
  storage_conditions : null,
  shelf_life : null,
  shelf_life_unit : 'month',
  additional : null,
  allergen_standards : null,
  // srstatus : null,
  // date : null,
  // time : null,
  // user : null,
  // edate : null,
  // etime : null,
  // euser : null,
} 

/** get column for edit table parameter */

export const parameterColumns = ({ handleAction, nameOption }) => {
  return [
  {
    title: "Parameter Name",
    key: "paraname",
    dataIndex: "paraname",
    editable: true,
    required: true,
    align: "left",
    width: 280,
    className:"field-edit",
    type:'autocomplete',
    autocompleteOption:nameOption
  },
  {
    title: "Preparation Value",
    align: "left",
    width: 220,
    editable: true,
    required: false,
    key: "preparation",
    dataIndex: "preparation",
    className:"field-edit",
    type:'input',
  },
  {
    title: "Cut Out Value",
    align: "left",
    width: 220,
    editable: true,
    required: false,
    key: "cutout",
    dataIndex: "cutout",
    className:"field-edit",
    type:'input',
  },
  {
    title: "Remark",
    align: "left",
    key: "remark",
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

export const columnsParametersEditable = (handleSave, {handleAction, nameOption} ) =>{
  const col = parameterColumns({handleAction, nameOption});
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


/** get column for view sample preparation detail */
export const spColumnsView = [
    {
      title: "ลำดับ",
      key: "index",
      align: "left",
      width: 80,
      render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
    },
    {
      title: "Code",
      key: "stcode",
      dataIndex: "stcode",
      width: 200,
    },
    {
      title: "ชื่อส่วนผสม",
      key: "stname",
      dataIndex: "stname",
    },
    {
      title: "น้ำหนัก(g)",
      key: "amount",
      dataIndex: "amount", 
      align: "right",
      width: 120,
      className:"field-edit pe-2",
      render: (v) => formatCommaNumber(Number( v || 0 )),
    },
    {
      title: "%",
      align: "right",
      width: 120,
      className:"pe-2",
      key: "percent",
      dataIndex: "percent",
      render: (v) => formatCommaNumber(Number( v || 0 ) * 100,2,2),
    },
    {
      title: "%(total)",
      align: "right",
      width: 120,
      className:"pe-2",
      key: "totalpercent",
      dataIndex: "totalpercent",
      render: (v, record, idx) => v !== null ? formatCommaNumber(Number( v ) * 100,2,2) : "",
    },
    {
      title: "Method",
      align: "left",
      key: "method",
      dataIndex: "method", 
      className:"field-edit ps-2",
      width:180,
    } 
] 

/** get column for view sample preparation parameter */

export const parameterColumnView = [
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

export const defaultParamenter = [
  {
    seq:1,
    paraname:'pH',
    preparation:'n/a',
    cutout:'n/a',
    remark:null,
  },
  {
    seq:2,
    paraname:'Brix',
    preparation:'n/a',
    cutout:'n/a',
    remark:null,
  },
  {
    seq:3,
    paraname:'%Salt',
    preparation:'n/a',
    cutout:'n/a',
    remark:null,
  },
  {
    seq:4,
    paraname:'%Acidity',
    preparation:'n/a',
    cutout:'n/a',
    remark:null,
  },
  {
    seq:5,
    paraname:'Aw control',
    preparation:'n/a',
    cutout:'n/a',
    remark:null,
  },
  {
    seq:6,
    paraname:'Bostwick at C/__sec',
    preparation:'n/a',
    cutout:'n/a',
    remark:null,
  },
  {
    seq:7,
    paraname:'Heating',
    preparation:'n/a',
    cutout:'n/a',
    remark:null,
  },
]