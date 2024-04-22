import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/estimation/manage.php`, 
  API_GETMASTER: `/estimation/get-estimation.php`, 
  API_GETSPCOST: `/estimation/get-spcost.php`, 
  API_GETPACKINGSETCOST: `/estimation/get-packingset-cost.php`, 
};
  
const EstimationService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);
  
  const spcost = (code) => api.get(`${API_URL.API_GETSPCOST}?code=${code}`);
  const packingsetCost = (code) => api.get(`${API_URL.API_GETPACKINGSETCOST}?code=${code}`);

  return {
    create,
    update,
    deleted,
    get, 

    search,

    spcost,
    packingsetCost,
  };
};

export default EstimationService;