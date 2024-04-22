import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  GET_ALL_Unit: `${BACKEND_URL}/unit/get_allunit.php`,
  Add_UNIT: `${BACKEND_URL}/unit/add_unit.php`,
  GET_UNIT: `${BACKEND_URL}/unit/get_unit.php`,
  GETSUP_UNIT: `${BACKEND_URL}/unit/getsup_unit.php`,
  Edit_UNIT: `${BACKEND_URL}/unit/edit_unit.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const UnitService = {
  getAllUnit: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_ALL_Unit,
      headers: contenttype,
    });
  },

  addUnit: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_UNIT,
      headers: contenttype,
      data: reqData,
    });
  },

  getUnit: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_UNIT,
    });
  },
  
  getSupUnit: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_UNIT,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editUnit: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_UNIT,
      headers: contenttype,
      data: reqData,
    });
  },
};

export default UnitService;
