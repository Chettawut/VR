import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/pk/manage.php`, 
  API_GETMASTER: `/pk/get-pkmaster.php`, 
  API_MANAGE_PKTYPE: `/pk/manage-packaging-type.php`, 
};

const PackagingService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);


  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);

  const createType = (parm = {}) => api.post(`${API_URL.API_MANAGE_PKTYPE}`, parm, { ignoreLoading : true });
  const updateType = (parm = {}) => api.put(`${API_URL.API_MANAGE_PKTYPE}`, parm, { ignoreLoading : true });
  const deleteType = (code) => api.delete(`${API_URL.API_MANAGE_PKTYPE}?code=${code}`, { ignoreLoading : true });
  return {
    create,
    update,
    deleted,
    get,

    search,

    createType,
    updateType,
    deleteType,
  };
};

export default PackagingService;