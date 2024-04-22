import { Space, Tag } from "antd"; 
import { Typography } from "antd"; 
import { Button } from "antd";
// import { Popconfirm} from "antd";
import { 
  EditOutlined, 
  ExclamationCircleOutlined, 
  // QuestionCircleOutlined, 
  // DeleteOutlined 
} from "@ant-design/icons"; 

import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
// import { columnSearchProp } from "../../components/table/Searchtable";
import { BadgeSampleRequestStatus } from "../../components/badge-and-tag";
import { ButtonAttachFiles } from "../../components/button";

import dayjs from "dayjs";
// import { formatCommaNumber } from "../../utils/util";

const { Paragraph } = Typography; 

/** get column for show data SR Sample request */
export const columns = ({ handleAction, handleView, handleDelete, handleColseAttach }) => [
    {
      title: "SR Code",
      dataIndex: "srcode",
      key: "srcode", 
      sorter: (a, b) => a.srcode.length - b.srcode.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "SR Date",
      dataIndex: "srdate",
      key: "srdate", 
      sorter: (a, b) => a.srdate.length - b.srdate.length,
      sortDirections: ["descend", "ascend"],
      render:(v) => dayjs(v).format("DD/MM/YYYY")
    }, 
    {
      title: "Sample Name",
      dataIndex: "spresult_array",
      key: "spresult_array", 
      sorter: (a, b) => a.spresult_array.length - b.spresult_array.length,
      sortDirections: ["descend", "ascend"],
      render: (data) => {
          const listItems = JSON.parse(data).map((str, i) =>
          <li key={i}>
            {str}            
          </li>
        );

        return (
            <>
                <div className="sm-name" >
                    <ul style={{ 
                      // listStyle: 'decimal-leading-zero', 
                      listStyle: 'disc', 
                      paddingInlineStart: 22  
                    }}>{listItems}</ul>
                </div>                
            </> 
        );
      },
    },
    {
      title: "Customer",
      dataIndex: "cusname",
      key: "cusname", 
      sorter: (a, b) => a.srdate.length - b.srdate.length,
      sortDirections: ["descend", "ascend"],
    },     
    {
      title: "Due Date",
      dataIndex: "duedate",
      key: "duedate",
      sorter: (a, b) => a.duedate.length - b.duedate.length,
      sortDirections: ["descend", "ascend"],
      render:(v) => dayjs(v).format("DD/MM/YYYY")
    },
    {
      title: "Desciption",
      dataIndex: "description",
      key: "description",
      width: '220px',
      render: (_, record) =>(  
        <Paragraph style={{margin:'0px'}}>
          <pre 
            style={{
              margin:'0px', 
              backgroundColor:'transparent', 
              border:'0px solid', 
              padding:'0px',  
              fontSize: 'clamp(0.8rem, 0.7vw, 1rem)' 
            }}
          >{record.description}</pre>
        </Paragraph>
      )
    },
    {
      title: "สถานะ",
      dataIndex: "srstatus",
      key: "srstatus",
      sorter: (a, b) => a.srstatus.length - b.srstatus.length,
      sortDirections: ["descend", "ascend"],
      render: (data) => <BadgeSampleRequestStatus data={data} />,
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
      render: (text, record) => (
        <Space >
          { record?.srstatus === "pending" &&
            <Button
              icon={<EditOutlined />} 
              className='bn-primary-outline'
              style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              onClick={(e) => handleAction(record) }
              size="small"
            />            
          }

          <Button
            icon={<ExclamationCircleOutlined />} 
            className='bn-success-outline'
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onClick={(e) => handleView(record) }
            size="small"
          />
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
          <ButtonAttachFiles code={record.srcode} refs='Sample Request' showExpire={true} close={handleColseAttach} />
        </Space>
      ),
    },
].filter((item) => !item.hidden);

/** get column for show data SR Sample request Detail */
export const sampleColumn = ({ handleAction }) => {
    return [
    {
      title: "No",
      key: "index",
      align: "left",
      width: 80,
      render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
    },
    {
      title: "Sample Name",
      key: "spname",
      dataIndex: "spname",
      editable: true,
      required: true,
      type:'input',
      width: '50%',
      align: "left",
      className:"field-edit pe-2"
    },
    {
      title: "Packing",
      key: "pkname",
      dataIndex: "pkname",
      editable: true,
      required: false,
      width: '20%',
      type: 'modal-select',
      align: "left",
      className:"field-edits pe-2"
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
      type:'input',
      editable: true,
      required: false,
      align: "left",
      width: 240,
      className:"field-edit pe-2", 
    },
    {
        title: "",
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
export const columnSampleEditable = (handleSave, handleModalSelect, {handleAction} ) =>{
    const col = sampleColumn({handleAction});
    return col.map((col) => {
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
                modalSelect: handleModalSelect
              }
            },
        };
    }); 
}  

/** export component for edit table */
export const componentsEditable = {
    body: { row: EditableRow, cell: EditableCell },
};

/** get sample column */
export const samplecolumnView = [
  {
    title: "No",
    key: "index",
    align: "left",
    width: 80,
    render: (_, record, idx) => <span key={record?.stcode}>{idx + 1}</span>,
  },
  {
    title: "Sampl Name",
    dataIndex: "spname",
    key: "spname",  
  },
  {
    title: "Packing",
    dataIndex: "pkname",
    key: "pkname"
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount", 
  } 
]


export const srmaster = {
  srcode : null,
  srdate : null,
  duedate : null,
  cuscode : null,
  cusname : null,
  description : null
}