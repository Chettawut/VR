import { BACKEND_URL } from "../utils/util";
import { requestService as api } from "./Request.service" 

const API_URL = {
  API_MANAGE: `${BACKEND_URL}/sr/manage.php`,
  API_GET_SAMPLE_REQUEST: `${BACKEND_URL}/sr/get-sample-request.php`,
  API_GET_SRCODE: `${BACKEND_URL}/sr/get-srcode.php`,
  API_SET_STATUS: `${BACKEND_URL}/sr/set-srstatus.php`,
}; 

const SRService = {   
  search: (parm=null)=> api.post(API_URL.API_GET_SAMPLE_REQUEST, parm),
  get_srcode: () => api.get(`${API_URL.API_GET_SRCODE}`),
  create: (parm=null) => api.post(API_URL.API_MANAGE, parm),
  update: (parm=null) => api.put(API_URL.API_MANAGE, parm),
  delete: (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`),
  get: (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`),
  set_status: (parm=null) => api.put(API_URL.API_SET_STATUS, parm),
};

export default SRService;
