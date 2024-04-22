import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/unit/manage-unit.php`,  
};
  
const UnitService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm, { ignoreLoading : true });
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm, { ignoreLoading : true });
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`, { ignoreLoading : true });
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`, { ignoreLoading : true });  

  return {
    create,
    update,
    deleted,
    get,  
  };
};

export default UnitService;