/* eslint-disable react-hooks/exhaustive-deps */

import React, {useState, useEffect, useRef} from 'react';

import { Card, Tag, Tooltip, Empty } from "antd";
import { Row, Col, Space, Typography, Button, Input } from "antd";
import { AutoComplete } from "antd";
import { TagOutlined } from "@ant-design/icons"; 

const { Text } = Typography;
const limitOption = 5;
export default function TagsControl({choose, source, options}) {
    const tagRef = useRef(null);
 
    const [tagsOptionsData, setTagsOptionsData] = useState([]);
    const [tagsOptionsDataWrap, setTagsOptionsDataWrap] = useState([]);

    const [tagsData, setTagsData] = useState([]);
    const [tagsValue, setTagsValue] = useState('');
  
    /** handle logic component */ 
 
    const handleChoose = () => {
        const tag = tagsValue;
        tagRef.current?.blur();
        if(!!tag){
            const value =  [...new Set([...tagsData, tag])]
            setTagsData(value);

            setTagsOptionsDataWrap(tagsOptionsData.filter( f => (!value.includes(f.value) || value.length < 1 )).slice(0, limitOption) ); 
            choose(value);
        }
        
        setTagsValue(''); 
    }
    
    const handleRemoveTag = ( e, val ) => {
        e.preventDefault();
        const tag = tagsData.filter( (f) => f !== val); 
        setTagsOptionsDataWrap(tagsOptionsData.filter( f => (!tag.includes(f.value) || tag.length < 1 )).slice(0, limitOption) ); 
        setTagsData([...tag]);
        choose([...tag]);
    }

    const handleSearch = (searchText) => {
      // Your logic to filter dataSource based on the searchText
      const filteredData = tagsOptionsData
        .filter(item => {
            //item?.toLowerCase().includes(searchText.toLowerCase())
            const { value } = item;
            return value?.toLowerCase().includes(searchText.toLowerCase());
        })
        .slice(0, limitOption); // Limiting to the first 5 options
        setTagsOptionsDataWrap(filteredData);
    };
      
    /** setting initial component */
    useEffect( () => {  
        setTagsData([...source]); 
        setTagsOptionsData([...options]);
        setTagsOptionsDataWrap( () => options.filter( f => (!source.includes(f.value) || source.length < 1 )).slice(0, limitOption) ); 
    }, [source, options]);


 
    return (
        <div className='tag-control' style={{ height:'100%'}}> 
            {/* <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  > */}
                <Card style={{paddingBlock:'1.78rem', height:'100%'}}>
                    <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                        <Col span={24}>
                            <Space.Compact style={{ width: '100%' }}> 
                                <AutoComplete 
                                    value={tagsValue}
                                    onChange={(e) => { setTagsValue(e) }}
                                    style={{ height:42, width:'100%' }}
                                    options={tagsOptionsDataWrap}
                                    onSearch={handleSearch}
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                    allowClear ref={tagRef}
                                >
                                    <Input  onPressEnter={()=>{handleChoose()}} placeholder='Enter tag.' style={{ height:42 }} ></Input>
                                </AutoComplete>
                                <Button type="primary" style={{ height:42, width:52 }} icon={<TagOutlined />} onClick={()=>{handleChoose()}} />
                            </Space.Compact>
                        </Col> 
                        <Col span={24}>
                            <Text style={{color:'rgb(52 120 255)'}} > Total {tagsData.length} tags for request preparation.</Text>
                        </Col>
                        <Col span={24}>
                            {tagsData.length < 1 &&<Space style={{width:'100%', justifyContent:'center'}} ><Empty description={false} className='width-100' /></Space>}
                            <Space size="2" style={{width:'100%'}} >
                                {tagsData.map( (m, i) => { 
                                    const isLongTag =  m?.length > 20;
                                    const tagElem = (
                                    <Tag key={i} closable onClose={(e) => handleRemoveTag(e, m) } color="#108ee9" style={{height:32, display:'flex', alignItems:'center'}} > 
                                        <span style={{lineHeight:'1.9rem', height:'100%'}}>{isLongTag ? `${m.slice(0, 20)}...` : m} </span>
                                        {/* {m}  */}
                                    </Tag>
                                    );
                                    return isLongTag ? <Tooltip title={m} key={i}> {tagElem} </Tooltip> : tagElem ; 
                                }) }
                            </Space>      
                        </Col>   
                    </Row>   
                </Card>
            {/* </Space> */}
        </div>
    )
}
