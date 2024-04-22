/* eslint-disable react-hooks/exhaustive-deps */
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext, 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'; 
import React, {  useEffect, useState } from 'react';
// import { useContext } from 'react';
import { Button, Col, Descriptions, InputNumber, Row, Space, Table } from 'antd';

import { componentsEditable, columnsDetailsEditable } from "./estimation.model";
import { RiDeleteBin5Line } from 'react-icons/ri'; 
import { formatCommaNumber } from '../../utils/util';
import { PlusCircleOutlined } from '@ant-design/icons';

// import EsContext from '../../store/context/estimation-context'
const dsInputStyle = { 
  width: '100%',
  border:'1px solid transparent',
  boxShadow:'none',
  borderRadius:0,
  borderBottom:'1px solid #d9d9d9',
  backgroundColor:'#f3f3f3', 
}

const dsTextStyle = { 
  width: '100%', 
  border:'1px solid transparent',
  borderBottom:'1px solid transparent',
  boxShadow:'none',
  backgroundColor: '#bfbfbf',
}

const dsLabelStyle = {
 width:'clamp( 5rem, 12vw, 242px)' 
}

const EstimationTable = ({ index, source={}, header={}, product={}, change}) => {

  // const contextValue =  useContext(EsContext);

  const [dataSource, setDataSource] = useState([]);
  const [dataHeader, setDataHeader] = useState({});
  const [dataProduct, setDataProduct] = useState({});

  const [mounted, setMounted] = useState(false);

  // const [dataResponse, setDataResponse] = useState({});

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.id === active.id);
        const overIndex = previous.findIndex((i) => i.id === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  }; 

  const handleSave = (row) => {
    const newData = (r) => {
        const itemDetail  = [...dataSource];
        const newData = [...itemDetail];
        
        const ind = newData.findIndex( (item) => r?.id === item?.id );
        if( ind < 0 ) return itemDetail; 
        const item = newData[ind];
        const c = (( Number(r?.price || 0) + Number(r?.transport || 0) ) / (1 - ( Number( r?.lost || 0 ) / 100 ) )) || 0
        const cost_carton = c * Number( r?.pcs_carton || 0)
        const weight_carton = Number( r?.weight_unit || 0) *  Number( r?.pcs_carton || 0)
        newData.splice(ind, 1, {
          ...item,
          ...{ 
            ...r,
            cost : c,
            cost_carton: parseFloat(cost_carton.toFixed(2)),
            weight_carton:  parseFloat(weight_carton.toFixed(2)),
          }
        });
        return newData;
    }
    setDataSource([...newData(row)]);
  };

  const handleDelete = (code) => {
    const itemDetail  = [...dataSource];
    const newData = itemDetail.filter (
        (item) => item?.id !== code
    );
    setDataSource([...newData]);
    //setItemsData([...newData]);
  };

  const handleAction = (record) =>{
    const itemDetail  = [...dataSource];
    return itemDetail.length >= 1 ? (
        <Button
          className="bt-icon"
          size='small'
          danger
          icon={<RiDeleteBin5Line style={{fontSize: '1rem', marginTop: '3px' }} />}
          onClick={() => handleDelete(record?.id)}
          disabled={!record?.id}
        />
      ) : null
  };  

  const handleAddCost = () => {
    setDataSource( state => [
      ...state,
      {
        id: `next-${state?.length + 1}`,
        packingsetid: null,
        pcs_carton: null,
        pkcode: null,
        pkname: null,
        price: null,
        transport: null,
        lost: null,
        cost: null,
        weight_unit: null,
      }
    ])
  }

  const handleEstimation = (head, data, prod) => {
    const netWeight = parseFloat(((Number(head?.fill_volume || 0) * Number(prod?.specific_gravity || 0)) / 1000).toFixed(2));
    // const netWeight = ((Number(head?.fill_volume || 0) * Number(prod?.specific_gravity || 0)) / 1000);
    const productCost = netWeight * parseFloat(Number(head?.unit_cost || 0).toFixed(2)) * parseFloat(Number(prod?.product_cost || 0).toFixed(2));
    // const productCost = netWeight * Number(head?.unit_cost || 0) * Number(prod?.product_cost || 0);
    const otherCost = data?.reduce( (a, v) => a + parseFloat((Number(v?.cost_carton || 0 ) ).toFixed(2)), 0);

    const otherWeight = data?.reduce( (a, v) => a + (Number(v?.weight_carton || 0 ) ), 0);
    // const grossWeightCarton = netWeight * otherWeight;
    const EXWorkCostCarton = parseFloat(productCost.toFixed(2)) + parseFloat(otherCost.toFixed(2));
    const EXWorkSellPrice = parseFloat(EXWorkCostCarton/ ( 1 - ((head?.margin || 25) / 100) ).toFixed(2)); 
    
    return { 
      header : {
        ...dataHeader, 
        // otherweight: otherWeight,
      },
      source : [...dataSource],
      estimation : {
        otherweight: otherWeight,
        // gross_weight_carton: grossWeightCarton,
        netweight: netWeight,
        productcost: productCost,
        othercost: otherCost,
        exworkcost_carton: EXWorkCostCarton,
        exworksell_price: EXWorkSellPrice,
      }
    } 
  }


  const dsItems = () => { 
    const { estimation } = handleEstimation(dataHeader, dataSource, dataProduct);  
    return [
      { 
        label: 'Fill Volume(ml)', 
        labelStyle: dsLabelStyle,
        // contentStyle: { minWidth:'20vw' },
        children: (
          <InputNumber 
          min={0}
          onChange={(e) => { setDataHeader( (state) => ({ ...state, fill_volume: e})) } } 
          value={dataHeader?.fill_volume} 
          controls={false}
          placeholder='Enter Fill Volumn(ml).' 
          style={dsInputStyle}
          suffix='ml'
          />
        ) ,  
      },

      { 
        label: 'Product Cost', 
        labelStyle: dsLabelStyle,
        // contentStyle: { minWidth:'20vw' }, 
        children: (
          <InputNumber
          min={0} 
          value={ formatCommaNumber( estimation.productcost )} 
          controls={false} 
          placeholder='Product Cost' 
          readOnly
          suffix='baht'
          style={dsTextStyle}
          />
        ) , 
      },

      { 
        label: 'Declared(gm/ml)', 
        labelStyle: dsLabelStyle,
        // contentStyle: { minWidth:'20vw' },
        children: (
          <InputNumber 
          min={0}
          onChange={(e) => { setDataHeader( (state) => ({ ...state, declared: e})) } } 
          value={dataHeader?.declared} 
          controls={false}
          placeholder='Enter Declared.' 
          style={dsInputStyle} 
          />
        ) ,  
      },

      { 
        label: 'Other Cost(Packing Set)', 
        labelStyle: dsLabelStyle,
        // contentStyle: { minWidth:'20vw' }, 
        children: (
          <InputNumber 
          min={0} 
          value={ formatCommaNumber( estimation.othercost )} 
          controls={false}
          placeholder='Enter Other Cost(Packing Set).'
          readOnly 
          suffix="baht"
          style={dsTextStyle}
          />
        ) , 
      }, 

      { 
        label: 'Net weight/unit', 
        labelStyle: dsLabelStyle,
        span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 },
        children: (
          <InputNumber 
          min={0} 
          value={ formatCommaNumber( estimation?.netweight ) } 
          controls={false}
          placeholder='Net weight/unit'
          readOnly
          style={dsTextStyle}
          suffix="kg"
          />
        ) , 
      },   

      { 
        label: 'EX-Work cost/carton', 
        labelStyle: dsLabelStyle,
        // contentStyle: { minWidth:'20vw' }, 
        children: (
          <InputNumber 
          min={0} 
          value={ formatCommaNumber( estimation.exworkcost_carton )} 
          controls={false}
          placeholder='EX-Work cost/carton.'
          readOnly
          style={dsTextStyle} 
          suffix="baht"
          />
        ) , 
      },

      { 
        label: 'Unit/Carton', 
        labelStyle: dsLabelStyle,
        // contentStyle: { minWidth:'20vw' }, 
        children: (
          <InputNumber 
          min={0} 
          value={ Number(dataHeader?.unit_cost || 0) } 
          controls={false}
          placeholder='Unit/Carton.' 
          suffix="pcs"
          readOnly
          style={dsTextStyle}
          />
        ) , 
      },  
      
      { 
        label: 'Margin %', 
        labelStyle: dsLabelStyle,
        // contentStyle: { minWidth:'20vw' },
        children: (
          <InputNumber 
          min={0}
          onChange={(e) => { setDataHeader( (state) => ({ ...state, margin: e})) } } 
          value={dataHeader?.margin} 
          controls={false}
          suffix='%'
          placeholder='Enter Margin %.' 
          style={dsInputStyle}
          />
        ) ,  
      },  

      { 
        label: 'Weight of other packaging/carton', 
        labelStyle: dsLabelStyle,
        // contentStyle: { minWidth:'20vw' },
        children: (
          <InputNumber 
          min={0}
          value={formatCommaNumber(estimation?.otherweight || 0)} 
          controls={false}
          placeholder='Enter Weight of other packaging/carton.' 
          readOnly
          style={dsTextStyle}
          suffix="gm"
          />
        ) ,  
      }, 

      { 
        label: 'EX-Work Sell price', 
        labelStyle: dsLabelStyle, 
        // contentStyle: { minWidth:'20vw' }, 
        children: (
          <InputNumber 
          min={0} 
          value={ formatCommaNumber( estimation.exworksell_price )} 
          controls={false}
          placeholder='EX-Work Sell price.'
          readOnly
          style={dsTextStyle}
          suffix='baht'
          />
        ) , 
      }, 

      { 
        label: 'Gross Weight/carton', 
        labelStyle: dsLabelStyle,
        // contentStyle: { minWidth:'20vw' }, 
        children: (
          <InputNumber 
          min={0}  
          onChange={(e) => { setDataHeader( (state) => ({ ...state, gross_weight_carton: e})) } } 
          value={ formatCommaNumber( dataHeader?.gross_weight_carton || 0 ) } 
          controls={false}
          placeholder='Enter Gross Weight/carton.'
          style={dsInputStyle}
          suffix="gm"
          />
        ),
        span: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }
      },  
    ]
  }

  useEffect( () => {
 
    setDataSource(source);
    setDataHeader(header);
    setDataProduct(product);
 
    if( Number( header?.gross_weight_carton || 0 ) < 1){
      const wtOther = source?.reduce( (a, v) => a + Number( v?.weight_carton || 0 ), 0 ); 
      const netWt = parseFloat(((Number(header?.fill_volume || 0) * Number(product?.specific_gravity || 0)) / 1000).toFixed(2));
      
      setDataHeader( state => ({
        ...state, 
        otherweight : parseFloat(wtOther).toFixed(2), 
        gross_weight_carton : parseFloat(( wtOther + ( netWt * 1000 * Number( header?.unit_cost || 0 ) ) ).toFixed(2))  
      }));
    }
    // const estimate = handleEstimation(header, newSource, product);
 
    // change( estimate, index );
    setMounted( true );
    return () => { setTimeout( ()=>{ setMounted(false); console.clear(); } , 340) }
  }, []);

  useEffect( () => {
    setDataProduct(product); 
    return () => {  }
  }, [product]);

  // useEffect( () => { 
  //   setDataSource(source);
  //   setDataHeader({...header});


  //   return () => { }
  // }, [source, header]);

  useEffect( () => {
    if( typeof change === 'function'){
      const estimate = handleEstimation(dataHeader, dataSource, dataProduct); 
       
      change( estimate, index ); 
    }

    return () => { }
  }, [JSON.stringify(dataSource), JSON.stringify(dataHeader), JSON.stringify(dataProduct)]);

  const columns = columnsDetailsEditable(handleSave, {handleAction});  
  return mounted && (
    <>
      <Space direction='vertical' className='width-100 tb-cost'>
        <Row className='m-0'>
          <Col xs={24} sm={24} md={24}>
            <Descriptions 
              bordered
              size='small'
              column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
              items={dsItems()}
            />
          </Col>
        </Row>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={componentsEditable}
              size='small'
              rowKey="id"
              columns={columns}
              dataSource={dataSource}
              scroll={{ x: 'max-content' }}
              pagination={false}
              locale = {{ emptyText: <span>No data available, please add some data.</span> }}
              footer={() =>{
                return (<Row className='m-0'> 
                  <Col span={24} style={{display:'flex', justifyContent:'center'}} className='width-100 append-step' >
                      <Button 
                          shape="circle" icon={<PlusCircleOutlined />} 
                          style={{width:'2.5rem', boxShadow:'none', lineHeight: '2.5rem'}} 
                          onClick={()=>{ handleAddCost() }}  
                      ></Button>
                  </Col>
                </Row>)
              }}
            />
          </SortableContext>
        </DndContext>    
      </Space>

    </> 
  );
};
export default EstimationTable;