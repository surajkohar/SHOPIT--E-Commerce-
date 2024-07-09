import axios from 'axios'

import {
    ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL, CLEAR_ERRORS,
    PRODUCT_DETAILS_REQUEST ,PRODUCT_DETAILS_SUCCESS ,
   PRODUCT_DETAILS_FAIL 
} from "../constants/productConstant";


export const getProducts=(keyword='' ,currentPage=1 )=>async(dispatch)=>{
   
    try {
        dispatch({
            type:ALL_PRODUCTS_REQUEST,
        })
        let link=`/api/products?keyword=${keyword}&page=${currentPage}`  //&price[lte]=${price[1000]}&price[gte]=${price[0]}
        const {data}=await axios.get(link)
        console.log("nnnnnnnnn",data)
        dispatch({
            type:ALL_PRODUCTS_SUCCESS,
            payload:data
        })
        
    } catch (error) {
        dispatch({
            type:ALL_PRODUCTS_FAIL,
            payload:error.response.data.message

        })
    }
}

export const getProductsDetails = (id) =>async(dispatch)=>{
   
    try {
        dispatch({
            type:PRODUCT_DETAILS_REQUEST,
        })
        const {data}=await axios.get(`/api/product/${id}`)
        console.log("data is:",data)
        
        dispatch({
            type:PRODUCT_DETAILS_SUCCESS,
            payload:data.product
        })
        
    } catch (error) {
        dispatch({
            type:PRODUCT_DETAILS_FAIL,
            payload:error.response.data.message

        })
    }
}

//clear Errors
export const clearErrors=()=>async(dispatch)=>{
    dispatch({
        type:CLEAR_ERRORS
    })
}