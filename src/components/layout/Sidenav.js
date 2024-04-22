/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, MenuItem } from "react-pro-sidebar";
import { Badge, Flex } from "antd";
import logo from "../../assets/images/logo_nsf.png";
import nav from "../../nav";

import { Authenticate } from '../../service/Authenticate.service.js'; 
import { useSelector } from "react-redux";
import { waitingApprovedSliceSelector } from '../../store/slices/sample-preparation-approve.slices';
// import { useAppDispatch } from '../../store/store';
const Sidenav = () => {
  const waitingApproveReducer = useSelector(waitingApprovedSliceSelector);
  const authService =  Authenticate();
  // const [ waitApprove, setWaitAppreve ] = useState(0);
  // const dispatch = useAppDispatch();
  
  const { pathname } = useLocation();
  const navActiveStyle = {
    padding: "10px 16px",
    color: "#141414",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 20px 27px rgba(0,0,0,.05)",
  }
  // useEffect( () => {
  //   dispatch(waitingApproved());
  //   setWaitAppreve(waitingApproveReducer?.waiting_approve)
  //   return () => { console.log('Component is unmounting. Cleaning up... Sidenav'); };
  // }, [pathname]);

  const Notification = ( {title}) => {
    // console.log(title);
    switch(title){
      case "Sample Preparation" :
        return (
          <Badge dot={ authService.getType() === 'admin' && waitingApproveReducer?.waiting_approve > 0  } size="small" offset={[1, 2]}> 
            <span>
              {title} 
            </span>
          </Badge>
        );
      default: return (<><span>{title}</span></>)
    }
  }
  return (
    <>
      <Flex vertical className="brand width-100" justify='center' align='center' >
        <img src={logo} alt="9star logo" style={{width:'max-content', height:'max-content'}}  />
        <span>Nine Star Food</span>
      </Flex>
      <hr />

      {/* <Sidebar style={{minWidth:"100%", width:"100%"}} > */}
        <Menu theme="light" mode="inline">
          {nav.map((item, idx) => {
            return ( !item?.type ? (
              <MenuItem
                icon={item?.icon}
                key={idx}
                component={ <Link to={item?.to} style={{navActiveStyle}} /> }
                className={pathname.startsWith(item?.to)? "nav-active" : null}
              > 
                <Notification title={item?.title} />
              </MenuItem>
            ) : (
              <MenuItem key={idx} className="nav-group-title">
                {item?.title}
              </MenuItem>
            )
            );
          })}
        </Menu>
      {/* </Sidebar> */}
    </>
  );
};

export default Sidenav;
