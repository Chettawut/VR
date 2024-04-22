import { requestService as api, getParmeter } from "./Request.service"  
const API_URL = {
  OPTION_ITEMS: `/common/options-items.php`, 
  OPTION_PACKAGING: `/common/options-packaging.php`,
  OPTION_ALLSUPPLIER: `/common/options-allsupplier.php`,
  OPTION_UNIT: `/common/options-unit.php`,
  OPTION_PACKINGSET: `/common/options-packing-set.php`,
  OPTION_SAMPLE_PREPARATION: `/common/options-sample-preparation.php`,
  OPTION_SUPPLIER: `/common/options-supplier.php`,
  OPTION_PRODUCER: `/common/options-producer.php`,
  OPTION_LOADING_TYPE: `/common/options-loading-type.php`,
  OPTION_SHIPPING_TYPE: `/common/options-shipping-type.php`,
  OPTION_QUOTATION: `/common/options-quotation.php`,
  OPTION_ESTIMATION: `/common/options-estimation.php`,

  OPTION_BANKS: `/common/options-banks.php`,
  OPTION_CURRENCIES: `/common/options-currencies.php`,
  OPTION_COUNTRIES: `/common/options-countries.php`,
};
 

const OptionService = () => {
  const optionsItems = (parm = {}) => api.get(`${API_URL.OPTION_ITEMS}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsPackaging = (parm = {}) => api.get(`${API_URL.OPTION_PACKAGING}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsAllSupplier = () => api.get(`${API_URL.OPTION_ALLSUPPLIER}`, { ignoreLoading : true });
  const optionsUnit = () => api.get(`${API_URL.OPTION_UNIT}`, { ignoreLoading : true });
  const optionsPackingSet = (parm = {}) => api.get(`${API_URL.OPTION_PACKINGSET}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsSamplePraparation = (parm = {}) => api.get(`${API_URL.OPTION_SAMPLE_PREPARATION}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsSupplier = () => api.get(`${API_URL.OPTION_SUPPLIER}`, { ignoreLoading : true });
  const optionsProducer = (parm = {}) => api.get(`${API_URL.OPTION_PRODUCER}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsShippingType = (parm = {}) => api.get(`${API_URL.OPTION_SHIPPING_TYPE}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsLoadingType = (parm = {}) => api.get(`${API_URL.OPTION_LOADING_TYPE}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsQuotation = (parm = {}) => api.get(`${API_URL.OPTION_QUOTATION}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsEstimation = (parm = {}) => api.get(`${API_URL.OPTION_ESTIMATION}?${getParmeter(parm)}`, { ignoreLoading : true });

  const optionsCountries = (parm = {}) => api.get(`${API_URL.OPTION_COUNTRIES}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsCurrencies = (parm = {}) => api.get(`${API_URL.OPTION_CURRENCIES}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsBanks = (parm = {}) => api.get(`${API_URL.OPTION_BANKS}?${getParmeter(parm)}`, { ignoreLoading : true });

  return {
    optionsItems,
    optionsPackaging,
    optionsAllSupplier,
    optionsUnit,
    optionsPackingSet,
    optionsSamplePraparation,
    optionsSupplier,
    optionsProducer,
    optionsShippingType,
    optionsLoadingType,
    optionsQuotation,
    optionsEstimation,

    optionsCountries,
    optionsCurrencies,
    optionsBanks,
  };
};

export default OptionService;