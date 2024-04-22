import { requestService as api } from "./Request.service"  
const API_URL = { 
  SAMPLEREQUEST_OPTION: `/common/options-sample-request.php`, 
};
 
// อย่าสงสัยทำผิดไฟล์แต่ขี้เกลียดแก้ ^^
const SampleRequestService = () => { 
  
  const sampleRequestOption = () => api.get(`${API_URL.SAMPLEREQUEST_OPTION}?p=srcode-option`,{ ignoreLoading : true });
  const parametersOption = () => api.get(`${API_URL.SAMPLEREQUEST_OPTION}?p=paraname-option`,{ ignoreLoading : true });
  const sampleRequestMaster = () => api.get(`${API_URL.SAMPLEREQUEST_OPTION}?p=sample-request-master`,{ ignoreLoading : true });
  const sampleRequestDetail = () => api.get(`${API_URL.SAMPLEREQUEST_OPTION}?p=sample-request-detail`,{ ignoreLoading : true });

  return {
    sampleRequestOption,
    parametersOption,
    sampleRequestMaster,
    sampleRequestDetail,
  };
};

export default SampleRequestService;