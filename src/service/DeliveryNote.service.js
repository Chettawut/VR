import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/delivery-note/manage.php`, 
  API_GETMASTER: `/delivery-note/get-dnmaster.php`, 
  API_GETITEMSWITHSR: `/delivery-note/get-items-with-sr.php`, 
};
 
// อย่าสงสัยทำผิดไฟล์แต่ขี้เกลียดแก้ ^^
const DeliveryNoteService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const getItemsWithSr = (code) => api.get(`${API_URL.API_GETITEMSWITHSR}?code=${code}`); 

  const getDnMaster = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm); 

  return {
    create,
    update,
    deleted,
    get,

    getDnMaster,
    getItemsWithSr,
  };
};

export default DeliveryNoteService;