import {
  // AppstoreOutlined,
  FileTextFilled,
  FileDoneOutlined, 
  FileProtectOutlined,
  HddOutlined,
  // InboxOutlined,
  TeamOutlined,
  // UserOutlined, 
  ExperimentOutlined,
  ReconciliationFilled,
  //FileTextOutlined,
} from "@ant-design/icons";
 
import { TbReportMoney } from "react-icons/tb";
import { FaBottleDroplet, FaBoxesPacking } from "react-icons/fa6"; 
import { RiTeamFill } from "react-icons/ri";
import { MdOutlineDashboard } from "react-icons/md";
import { FaTruckLoading } from "react-icons/fa";
import { 
  MdOutlineGroup, 
  MdRequestQuote 
} from "react-icons/md";
let _nav = [
  {
    title: "DATA",
    type: "group",
  },
  {
    title: "Dashboard",
    icon: <MdOutlineDashboard className="nav-ico" />,
    to: "/dashboard",
  },
  {
    title: "SYSTEM",
    type: "group",
  },
  {
    title: "Sample Request",
    icon: <FileTextFilled className="nav-ico" />, 
    to: "/sample-request",
  },
  {
    title: "Sample Preparation",
    icon: <ReconciliationFilled className="nav-ico" />, 
    to: "/sample-preparation",
  },
  {
    title: "Pilot Scale",
    icon: <ExperimentOutlined className="nav-ico" />, 
    to: "/pilot-scale",
  },
  {
    title: "Delivery Note",
    icon: <FileProtectOutlined  className="nav-ico"/>, 
    to: "/delivery-note",
  },
  {
    title: "Estmate Cost",
    icon: <TbReportMoney  className="nav-ico"/>, 
    to: "/estimation",
  },
  {
    title: "Packing Set",
    icon: <FaBoxesPacking  className="nav-ico"/>,
    to: "/packing-set",
  },
  {
    title: "Quotation",
    icon: <MdRequestQuote  className="nav-ico"/>,
    to: "/quotation",
  },



  {
    title: "MASTER",
    type: "group",
  },  
  {
    title: "Items",
    icon: <FileDoneOutlined className="nav-ico" />,
    to: "/items",
  },
  {
    title: "Packaging",
    icon: <FaBottleDroplet className="nav-ico" />,
    to: "/packaging",
  },
  {
    title: "Shipping Type",
    icon: <FaTruckLoading className="nav-ico" />,
    to: "/shipping-type",
  },

  {
    title: "Unit",
    icon: <HddOutlined className="nav-ico" />,
    to: "/unit",
  },
  // {
  //   title: "Product Type",
  //   icon: <InboxOutlined className="nav-ico" />,
  //   to: "/itemtype",
  // },
  {
    title: "Customers",
    icon: <RiTeamFill className="nav-ico" />,
    to: "/customers",
  },
  // {
  //   title: "Customer",
  //   icon: <UserOutlined className="nav-ico" />,
  //   to: "/customer",
  // },
  {
    title: "Suppliers",
    icon: <MdOutlineGroup className="nav-ico" />,
    to: "/suppliers",
  },  
  // {
  //   title: "Supplier",
  //   icon: <UserOutlined className="nav-ico" />,
  //   to: "/supplier",
  // },  
  {
    title: "User",
    icon: <TeamOutlined className="nav-ico" />,
    to: "/user",
  },
  // {
  //   title: "File",
  //   icon: <TeamOutlined className="nav-ico" />,
  //   to: "/file-control",
  // },
  // {
  //   title: "Sample Request [ Dev ]",
  //   icon: <FileTextOutlined />,
  //   to: "/sample-request",
  // },
];

export default _nav;
