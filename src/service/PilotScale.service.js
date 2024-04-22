import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/pilot-scale/manage.php`, 
  API_GETMASTER: `/pilot-scale/get-pilotscale.php`, 
  API_GETITEMSWITHSR: `/pilot-scale/get-items-with-sr.php`, 
};
  
const PilotScaleService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);
  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);


  return {
    create,
    update,
    deleted,
    get, 

    search,
  };
};

export default PilotScaleService;