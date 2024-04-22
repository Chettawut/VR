import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/quotations/manage.php`, 
  API_GETMASTER: `/quotations/get-quotations.php`, 
  API_GETSPCOST: `/quotations/get-spcost.php`, 
  API_GETPACKINGSETCOST: `/quotations/get-packingset-cost.php`, 

  API_GETCODE: `/quotations/get-quotcode.php`, 
};
  
const QuotationService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const code = () => api.get(`${API_URL.API_GETCODE}`);

  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);
  
  const spcost = (code) => api.get(`${API_URL.API_GETSPCOST}?code=${code}`);
  const packingsetCost = (code) => api.get(`${API_URL.API_GETPACKINGSETCOST}?code=${code}`);

  return {
    create,
    update,
    deleted,
    get, 

    code,

    search,

    spcost,
    packingsetCost,
  };
};

export default QuotationService;