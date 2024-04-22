import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/shipping-type/manage.php`, 
  API_GETMASTER: `/shipping-type/get-shipping-type.php`, 
 
};

const ShippingTypeService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code, conf) => api.get(`${API_URL.API_MANAGE}?code=${code}`, conf);


  const search = (parm = {}, config = {}) => api.post(`${API_URL.API_GETMASTER}`, parm, {...config, cancel:true});
  return {
    create,
    update,
    deleted,
    get,

    search,
  };
};

export default ShippingTypeService;