import { Flex, Typography } from "antd";
import { formatCommaNumber } from "../../../utils/util";

export const column = [
    {
        title: "Product Description",
        align: "left", 
        key: "spname",
        width: '50%',
        dataIndex: "spname",
        onCell: () => ( { style:{ 
            borderLeft:'1px solid var(---color--1)', 
        }} ),
        render:(_,record, ind) =>(<>
            <Flex vertical>
                <Typography.Text className="tx-info">{ind + 1}. {record?.spname}</Typography.Text>
                <Flex vertical>
                    {record?.quotations_list.map( (item, ix)=>(
                        <Flex key={ix} gap={6}>
                            <Typography.Text className="pl-4 tx-sub text-nowrap">{ind + 1}.{ix+1} {item?.detail_name}:</Typography.Text>
                            <Typography.Text className="tx-sub">{item?.detail_value}</Typography.Text> 
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </>)
    },
    {  
        width: '.15cm', 
        className:'!bg-white !border-y-0 !px-0',
        style:{ borderColor:'var(---color--1)' },
        onCell: () => ( { style:{ 
            borderLeft:'1px solid var(---color--1)',
            borderRight:'1px solid var(---color--1)',
        }} ),
        key: "empty",
        dataIndex: "empty",
        render:(v) => <Typography.Text className="tx-info">{'\u00A0'}</Typography.Text>
    },
    {
        title: <>Unit per<br />carton</>,
        align: "right",
        width: 90,
        key: "unit_carton",
        dataIndex: "unit_carton",
        render:(v) => <Typography.Text className="tx-info">{v}</Typography.Text>
    },
    {
        title: <>Quantity<br />(carton)</>,
        align: "right",
        width: 120,
        key: "qty",
        dataIndex: "qty",
        render:(v) => <Typography.Text className="tx-info">{formatCommaNumber(Number(v))}</Typography.Text>
    },
    {
        title: <>Price per carton</>,
        align: "right",
        width: 160,
        key: "amount",
        dataIndex: "amount",
        render:(_,record) => <Typography.Text className="tx-info">{formatCommaNumber( Number(record.price_per_carton || 0), 2, 2)}</Typography.Text>
    },
    {
        title: <>Total Amount</>,
        align: "right",
        width: 160,
        key: "amount",
        dataIndex: "amount",
        onCell: () => ( { style:{ 
            borderRight:'1px solid var(---color--1)', 
        }} ),
        render:(_,record) => <Typography.Text className="tx-info">{formatCommaNumber(Number(record.total_amount), 2, 2)}</Typography.Text>
    },
]