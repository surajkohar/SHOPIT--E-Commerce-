
import React, { useState, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import { Link } from 'react-router-dom'

import { register,clearErrors } from '../../action/userAction'

const Register = ({ history }) => {

    const [user,setUser]=useState({
        name:'',
        email:'',
        password:''
    })
    const {name,email,password}=user

    const [avtar,setAvtar]=useState('')
    // console.log('avtar',avtar)
    const [avtarPreview,setAvtarPreview]=useState('/images/default_avatar.jpg')
    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth)

    useEffect(() => {
        if (isAuthenticated) {
            history.push('/')
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error, isAuthenticated, alert, history])

    const submitHandler=(e)=>{
        e.preventDefault();

        const formData=new FormData();
        formData.set('name', name)
        formData.set('email', email)
        formData.set('password', password)
        formData.set('avtar', avtar)
        dispatch(register(formData))
        console.log("formdata is:",FormData)
    }
    // console.log("formdata is:",FormData)
    console.log("user is:",user)

    const onChange = e => {
            if(e.target.name=== 'avtar') {
                let reader=new FileReader()
                reader.onload=()=>{
                   if(reader.readyState === 2){
                    setAvtarPreview(reader.result)
                    setAvtar(reader.result)
                   }
                }
                reader.readAsDataURL(e.target.files[0])
            }
            else{
                setUser({
                    ...user,[e.target.name] : e.target.value
                })
            }
    }

  return (
    <>
    <MetaData title={'Register User'}/>
          <div className="row wrapper">
		<div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
            <h1 className="mb-3">Register</h1>

          <div className="form-group">
            <label for="email_field">Name</label>
            <input type="name" id="name_field" className="form-control" 
            name='name'
            value={name}
            onChange={ onChange }
          />
          </div>

            <div className="form-group">
              <label htmlfor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name='email'
                value={email}
                onChange={ onChange }
              />
            </div>
  
            <div className="form-group">
              <label htmlfor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name='password'
                value={password}
                onChange={ onChange }
              />
            </div>

            <div className='form-group'>
              <label htmlfor='avatar_upload'>Avatar</label>
              <div className='d-flex align-items-center'>
                  <div>
                      <figure className='avatar mr-3 item-rtl'>
                          <img
                              src={avtarPreview}
                              className='rounded-circle'
                              alt='Avtar Preview'
                          />
                      </figure>
                  </div>
                  <div className='custom-file'>
                      <input
                          type='file'
                          name='avtar'
                          className='custom-file-input'
                          id='customFile'
                          accept='images/*'
                        //   value={avtar}
                          onChange={onChange}
                      />
                      <label className='custom-file-label' htmfor='customFile'>
                          Choose Avatar
                      </label>
                  </div>
              </div>
          </div>
  
            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={ loading ? true :false }
            >
              REGISTER
            </button>
          </form>
		  </div>
    </div>
    </>
  )
}

export default Register