import { Space, Typography } from "antd"; 
import { Flex, Tag, } from "antd"; 
// import { Typography } from "antd"; 
import { Button } from "antd";
import { Popconfirm, Tooltip } from "antd";
import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import { FaTruckLoading } from "react-icons/fa";
// import dayjs from 'dayjs';
import { EditableCell, EditableRow } from "../../components/table/TableEditAble";
import { formatCommaNumber } from "../../utils/util";
// import { formatCommaNumber } from '../../utils/util';
/** get sample column */
export const accessColumn = ({handleEdit, handleDelete, handleView}) => [
  {
    title: "Packing Set Name.",
    key: "packingset_name",
    dataIndex: "packingset_name",
    align: "left",  
    width: 210,
    ellipsis: {
      showTitle: false,
    },
    sorter: (a, b) => (a.packingset_name).localeCompare(b.packingset_name),
    render: (v) => (
      <Tooltip placement="topLeft" title={v}>
        {v}
      </Tooltip>
    ),
  },
  {
    title: "Unit Per Cost",
    dataIndex: "unit_cost",
    key: "unit_cost",   
    align: 'right',
    className:'!pe-5',
    width: '10%',
    sorter: (a, b) => (a?.unit_cost || "").localeCompare(b?.unit_cost || ""),
    render: (v) => !!v && <Typography.Text>{formatCommaNumber(v)}</Typography.Text>,
  },
  {
    title: "Fill Volume",
    dataIndex: "fill_volume",
    key: "fill_volume",   
    align: 'right',
    className:'!pe-5',
    width: '10%',
    sorter: (a, b) => (a?.fill_volume || "").localeCompare(b?.fill_volume || ""),
    render: (v) => !!v && <Typography.Text>{formatCommaNumber(v)}</Typography.Text>,
  },
  {
    title: "Declared",
    dataIndex: "declared",
    key: "declared",   
    align: 'right',
    className:'!pe-5',
    width: '10%',
    sorter: (a, b) => (a?.declared || "").localeCompare(b?.declared || ""),
    render: (v) => !!v && <Typography.Text>{formatCommaNumber(v)}</Typography.Text>,
  },
  {
    title: "Packing set group",
    dataIndex: "packingset_group",
    key: "packingset_group", 
    width: '12%',
    ellipsis: {
      showTitle: false,
    },
    sorter: (a, b) => (a.packingset_group).localeCompare(b.packingset_group),
  },
  {
    title: "Loading Type",
    dataIndex: "loadingtype",
    key: "loadingtype",   
    width: 160,
    render: (data) => {
        const tags = JSON.parse(data)?.map((str, i) =>
        <Tag icon={<FaTruckLoading />} color="#3b5999" key={i} className="m-0 flex items-center gap-1">
          {str}
        </Tag>
      );

      return <>
        <Flex wrap="wrap" gap={2}>{tags}</Flex>
      </>
    },
  },
  // {
  //   title: "Request By",
  //   dataIndex: "created_name",
  //   key: "created_name", 
  //   width : '8%',
  //   ellipsis: {
  //     showTitle: false,
  //   },
  //   render: (v) => (
  //     <Tooltip placement="topLeft" title={v}>
  //       {v}
  //     </Tooltip>
  //   ), 
  // },
  // {
  //   title: "Request Date",
  //   dataIndex: "created_date",
  //   key: "created_date", 
  //   render: (v) => dayjs(v).format("DD/MM/YYYY"),
  // },
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
  body: { row: EditableRow, cell: EditableCell },
};

/** get column for edit table */
export const editColumns = ({ handleAction }) => {
  return [
    {
      title: "Packaging Name",
      ellipsis: true,
      className:'max-w-52',
      key: "pkanme",
      dataIndex: "pkname",
      align: "left",
      width:200,
      render: (v) => {
        return (
        <Tooltip placement="topLeft" title={v}>
          <Typography.Text>{v}</Typography.Text>
        </Tooltip>
      )},
    },
    {
      title: "Express",
      key: "expscode",
      dataIndex: "expscode",
      align: "left", 
      ellipsis: true,
      className:'max-w-72',
      render: (_, record) => {
        const v = record?.expscode && `/${record?.expscode}`;
        return (
        <Tooltip placement="topLeft" title={`${record.expsname}${v}`}>
          <Typography.Text>{record.expsname}{v}</Typography.Text>
        </Tooltip>
      )},
    },
    {
      title: "Price",
      editable: false,
      width : '8%',
      align: 'right',
      key: "price",
      dataIndex: "price",
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Lost(%)</>),
      align: "right",
      width : '8%',
      editable: false,
      required: false,
      key: "lost",
      dataIndex: "lost",
      className:"field-edit pe-2",
      type:'input',
      render: (v) => formatCommaNumber(Number( v || 0 ) * 100)
    },
    {
      title: (<>Transport</>),
      align: "right",
      width : '8%',
      editable: false,
      required: false,
      key: "transport",
      dataIndex: "transport",
      className:"field-edit pe-2",
      type:'input',
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Cost/Unit</>),
      align: "right",
      width : '8%', 
      key: "cost",
      dataIndex: "cost",
      className:"field-edit pe-2",
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Weight/Unit</>),
      align: "right",
      width : '8%', 
      key: "weight_unit",
      dataIndex: "weight_unit",
      className:"field-edit pe-2",
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: (<>Pcs/Carton</>),
      align: "right",
      width : '8%',
      editable: true,
      required: false,
      key: "pcs_carton",
      dataIndex: "pcs_carton",
      className:"field-edit pe-2",
      type:'input',
      render: (v) => !!v && formatCommaNumber(Number( v || 0 ))
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

export const columnsDetailsEditable = (handleSave, {handleAction} ) =>{
  const col = editColumns({handleAction});
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

export const editLoadingTypeColumns = ({ handleAction, nameOption }) => {
  return [
    {
      title: "Loading Type Name", 
      key: "loadingtype_name",
      dataIndex: "loadingtype_name",
      align: "left",
      editable: true,
      required: true, 
      type:'autocomplete',
      autocompleteOption:nameOption,
      onCell: (v) => {
        const fieldEditClass = (!!v.loadingtype_name && v.loadingtype_name?.length > 0) ? "field-edit !align-top" : "!align-top";
        console.log( fieldEditClass );
        return {
          className : `${fieldEditClass}`
        }
      },
      render: (v) => {
        return (
        <Tooltip placement="topLeft" title={v}>
          <Typography.Text>{v}</Typography.Text>
        </Tooltip>
      )},
    },
    {
      title: "Quantity",
      align: "right",
      width : '28%',
      editable: true,
      required: true,
      key: "qty",
      dataIndex: "qty",
      className:"field-edit pe-2 !align-top",
      type:'input',
      render: (v) => formatCommaNumber(Number( v || 0 ))
    },
    {
      title: "ตัวเลือก",
      align: "center",
      key: "operation",
      dataIndex: "operation", 
      render: (_, record, idx) => handleAction(record),
      width: '120px',
      fixed: 'right',
    },
  ]
};

export const columnsLoadingTypeEditable = (handleSave, {handleAction, nameOption} ) =>{
  const col = editLoadingTypeColumns({handleAction, nameOption});
  return col.map((col, ind) => {
      if (!col.editable) { return col; }
      return {
          ...col,
          onCell: (record) => {
            let fieldEditClass = "!align-top"
            
            if(col.editable && !!record.loadingtype_name && record.loadingtype_name?.length > 0 && col.dataIndex === "loadingtype_name" ){
              fieldEditClass = `field-edit ${fieldEditClass}`;
              
              // console.log( fieldEditClass, col.dataIndex ); 
            }

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
              autocompleteOption: col?.autocompleteOption || [],
              className : `${fieldEditClass}`
            }
          },
      };
  }); 
}
