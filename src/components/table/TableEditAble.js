import React, { useContext, useEffect, useState, useRef } from "react";
import { Form, Input, AutoComplete, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { MenuOutlined } from '@ant-design/icons'; 
import { 
  useSortable, 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} autoComplete="off">
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableContext = React.createContext(null);

export const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    fieldType,
    required,
    readonly,
    type,
    autocompleteOption,
    modalSelect,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    
    type = type || 'input';
    // const textAreaRef = useRef(null);
    const form = useContext(EditableContext);
    // console.log(restProps);
    useEffect(() => {
      if (editing && !readonly) { 
        inputRef.current?.focus(); 

        inputRef.current?.select();
        // console.log( inputRef.current );
      }
    }, [editing, readonly]);

    const toggleEdit = () => {
      setEditing(!editing && !readonly);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();


        handleSave({
          ...record,
          ...values,
          key:dataIndex,
        });
      } catch (errInfo) {
        // console.log('Save failed:', errInfo);
      }
    };

    const select = async () => {
      try {
        // const values = await form.validateFields();
        toggleEdit();


        // handleSave({
        //   ...record,
        //   ...values,
        //   key:dataIndex,
        // });
      } catch (errInfo) {
        // console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;
    if (editable) {
        childNode = editing ? (
          <Form.Item 
            style={{ margin: 0, }}
            name={dataIndex}
            rules={[ { required: !!required, message: `${title} is required.`,  }, ]}
          >
            {
              (type === 'input') && (
              <Input 
                placeholder="Enter value"
                ref={inputRef}
                onPressEnter={save}
                onBlur={save}
                style={{height:32,  minWidth: "none", textAlign:"end", ...restProps.style}}
                className='ant-input'
                autoComplete="off"
                readOnly={readonly}
              />)
            }

            {(type === 'textarea') && (<textarea rows={2} ref={inputRef} onBlur={save} style={{width:"100%", height:64,}} className='ant-input' readOnly={readonly} ></textarea>)}

            {(type === 'autocomplete') && (
              <AutoComplete
                children={<Input ref={inputRef} style={{height:32, ...restProps.style}} />} 
                onBlur={save}
                onSelect={save}
                options={autocompleteOption}
                placeholder="Enter value"
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            )}

            {(type === 'modal-select') && (
              <Space.Compact style={{ width: '100%', height:32,  minWidth: "none" }} onBlur={select} >
                  <Input readOnly placeholder='Choose value' value={record[dataIndex]} style={{height:32, ...restProps.style}}  />
                  <Button 
                  className='bn-secondary bn-center bn-action' 
                  size='small' 
                  icon={<SearchOutlined />} 
                  onClick={(e) => modalSelect(e, record)} 
                  style={{
                    minWidth:40, 
                    height:32, 
                    borderRadius:6, 
                    borderStartStartRadius: 0,
                    borderEndStartRadius: 0,
                  }} 
                  ></Button>
              </Space.Compact> 
            )}
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{ 
              paddingRight: 8, 
              height: !!fieldType ? 64 : 32, 
              border:"1px solid #eee", 
              borderRadius:6,
              lineHeight: '1.4rem' }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

export const RowDrag = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });
  const [form] = Form.useForm();
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      },
    ),
    transition,
    ...(isDragging
      ? {
          position: 'relative',
          zIndex: 999,
        }
      : {}),
  };
  return (
    <Form form={form} component={false} autoComplete="off">
    <EditableContext.Provider value={form}>
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === 'sort') {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: 'none',
                  cursor: 'move',
                }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
    </EditableContext.Provider>
    </Form>
  );
};