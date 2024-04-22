import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/packing-set/manage.php`, 
  API_GETMASTER: `/packing-set/get-packing-set.php`, 

  API_MANAGE_PACKING_GROUP: `/packing-set/manage-packing-set-group.php`
};

const PackingSetService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);


  const search = (parm = {}, config = {}) => api.post(`${API_URL.API_GETMASTER}`, parm, {...config, cancel: true});

  const createGroup = (parm = {}) => api.post(`${API_URL.API_MANAGE_PACKING_GROUP}`, parm, { ignoreLoading : true });
  const updateGroup = (parm = {}) => api.put(`${API_URL.API_MANAGE_PACKING_GROUP}`, parm, { ignoreLoading : true });
  const deleteGroup = (code) => api.delete(`${API_URL.API_MANAGE_PACKING_GROUP}?code=${code}`, { ignoreLoading : true });
  return {
    create,
    update,
    deleted,
    get,

    search,

    createGroup,
    updateGroup,
    deleteGroup,
  };
};

export default PackingSetService;