// import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";
import {requestService as axios} from "./Request.service";

const API_URL = {
  GET_ALL_ITEMS: `${BACKEND_URL}/item/get_allitem.php`,
  Add_ITEM: `${BACKEND_URL}/item/add_item.php`,
  GET_ITEM: `${BACKEND_URL}/item/get_item.php`,
  GETSUP_ITEM: `${BACKEND_URL}/item/getsup_item.php`,
  Edit_ITEM: `${BACKEND_URL}/item/edit_item.php`,
};

let contenttype = { "content-type": "application/x-www-form-urlencoded" };

const ItemService = {
  getAllItems: () => {
    return axios({
      method: MEDTHOD.GET,
      url: API_URL.GET_ALL_ITEMS,
      headers: contenttype,
      ignoreLoading : true,
    });
  },

  addItem: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_ITEM,
      headers: contenttype,
      data: reqData,
      ignoreLoading : true,
    });
  },

  getItem: (parm = {}) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.GET_ITEM,
      headers: contenttype,
      data: parm,
      ignoreLoading : true,
    });
  },
  
  getSupItem: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_ITEM,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
      ignoreLoading : true,
    });
  },

  editItem: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Edit_ITEM,
      headers: contenttype,
      data: reqData,
      ignoreLoading : true,
    });
  },
};

export default ItemService;
