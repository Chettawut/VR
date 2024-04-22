import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";
import { STORE_KEY } from "../constant/constant";

const API_URL = {
  GET_ALL_CUSTOMER: `${BACKEND_URL}/customer/get_allcustomer.php`,
  Add_CUSTOMER: `${BACKEND_URL}/customer/add_customer.php`,
  GET_CUSTOMER: `${BACKEND_URL}/customer/get_customer.php`,
  GETSUP_CUSTOMER: `${BACKEND_URL}/customer/getsup_customer.php`,
  Edit_CUSTOMER: `${BACKEND_URL}/customer/edit_customer.php`,
  GET_CUSCODE: `${BACKEND_URL}/customer/get_cuscode.php`,
  MANAGE: `${BACKEND_URL}/customer/manage.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};
const getHeader = () => {
  const t = sessionStorage.getItem(STORE_KEY.authen);

  return {
    // "content-type" : "application/x-www-form-urlencoded",
    "Authorization" : `Bearer ${t}`
  }
}

const CustomerService = {
  getAllCustomer: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.GET_ALL_CUSTOMER,
      headers: contenttype,
      data: reqData,
    });
  },

  addCustomer: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_CUSTOMER,
      headers: contenttype,
      data: reqData,
    });
  },

  getCuscode: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_CUSCODE,
      headers: getHeader(),
    });
  },  
  
  getSupCustomer: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_CUSTOMER,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editCustomer: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_CUSTOMER,
      headers: contenttype,
      data: reqData,
    });
  },

  getCustomer: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_CUSTOMER,
    });
  },

  create: (parm) => axios.post(API_URL.MANAGE, parm, { headers: getHeader() }),
  update: (parm) => axios.put(API_URL.MANAGE, parm, { headers: getHeader() }), 

  get: (code) => axios.get( `${API_URL.MANAGE}?code=${code}`, { headers: getHeader() }),
};

export default CustomerService;
