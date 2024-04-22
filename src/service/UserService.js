import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  Add_USER: `${BACKEND_URL}/user/add_user.php`,
  GET_USER: `${BACKEND_URL}/user/get_user.php`,
  GETSUP_USER: `${BACKEND_URL}/user/getsup_user.php`,
  Edit_USER: `${BACKEND_URL}/user/edit_user.php`,
  ResetPassword: `${BACKEND_URL}/user/resetpassword.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const UserService = {
  resetPassword: (pwd,id) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.ResetPassword,
      data: {
        idcode: id,
        pwd: pwd,
      },
      headers: contenttype,
    });
  },

  addUser: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_USER,
      headers: contenttype,
      data: reqData,
    });
  },

  getUser: (parm = {}) => {
    const cancelTokenSource = axios.CancelToken.source();
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.GET_USER,
      headers: contenttype,
      data: parm,
      cancelToken : cancelTokenSource?.token
    });
  },
  
  getSupUser: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_USER,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editUser: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_USER,
      headers: contenttype,
      data: reqData,
    });
  },
};

export default UserService;
