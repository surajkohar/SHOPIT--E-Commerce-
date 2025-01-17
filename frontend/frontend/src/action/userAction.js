import axios from 'axios'
import{
    LOGIN_REQUEST,LOGIN_SUCCESS,
    LOGIN_FAIL,CLEAR_ERRORS,
    REGISTER_USER_REQUEST,
     REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL
} from '../constants/userConstant'

export const login=( email,password ) => async (dispatch) =>{
   try {

    dispatch({ type:LOGIN_REQUEST})
        
        const config={
            headers:{
                'content-type' : 'application/json'
            }
           }

           const {data}=await axios.post('/api/login',{email,password},config)
           console.log("login data is:",data)
           dispatch({
            type:LOGIN_SUCCESS,
            payload:data.user
           })
    }
     catch (error) {
      dispatch({
        type:LOGIN_FAIL,
        payload:error.response.data.message
      })
   }
}

export const register=( userData ) => async (dispatch) =>{
    console.log("userData is :",userData)
    try {
 
     dispatch({ type:REGISTER_USER_REQUEST})
         
         const config={
             headers:{
                 'content-type' : 'multipart/form-data'
             }
            }
 
            const {data}=await axios.post('/api/register',userData ,config)
            console.log("register data is:",data.user)
            dispatch({
             type:REGISTER_USER_SUCCESS,
             payload:data.user
            })
     }
      catch (error) {
       dispatch({
         type:REGISTER_USER_FAIL,
         payload:error.response.data.message
       })
    }
 }

//load user
 export const loadUser=() => async (dispatch) =>{
    try {
 
     dispatch({ type:LOAD_USER_REQUEST})
         
            const {data}=await axios.get('/api/me')
         console.log("load user :",data)
         
            dispatch({
             type:LOAD_USER_SUCCESS,
             payload:data.user
            })
     }
      catch (error) {
       dispatch({
         type:LOAD_USER_FAIL,
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