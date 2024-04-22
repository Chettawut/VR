import { requestService as api, getParmeter } from "./Request.service"  

const API_URL = {
  ITEMS_BOMS: `/common/options-items.php`, 
  MANAGE: `/bom/manage.php`, 
  SEARCH: `/bom/get.php`, 
}; 



const BomService  = () => {
  const bomItems = (parm = {}) => { 
    return api.get(`${API_URL.ITEMS_BOMS}?${getParmeter({...parm, p:"items"})}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") })
  };
  const bomMaster = (parm = {}) => {
    return api.get(`${API_URL.SEARCH}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  }

  const manage = (parm = {}) => api.post(API_URL.MANAGE, {...parm}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  const search = async (parm = {}) => {
    // console.log(API_URL.SEARCH, parm);
    return await api.post(API_URL.SEARCH, {...parm})
    .catch(e => { 
      console.info(e); 
      
      throw new Error("เกิดข้อผิดพลาด");
    });
  }

  return {
    bomItems,
    bomMaster,
    manage,
    search
  };
};

export default BomService;