import React from 'react'
import {Route,Link} from 'react-router-dom'
import Search from './Search';
import { useDispatch,useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

const Header = () => {

  const alert=useAlert();
  const dispatch=useDispatch();

  const { user,loading }=useSelector( state=>state.auth )

  return (
    <>
       <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">

          <Link to='/' >
          <img src="/images/shopit_logo.png" />
          </Link>
          
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
      
        <Route render={({history}) => <Search history={history}/> } />
        
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
      <Link to='/cart' style={{ TextDecoration:'none' }} >
      <span id="cart" className="ml-3">Cart</span>
        <span className="ml-1" id="cart_count">2</span>
      </Link>

      { user ? (
        <div className='ml-4 dropdown d-inside'>
           <Link to='!#' className='btn dropdown-toggle text-white' type='button' id='dropDownMenuButton'
          data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
            <figure className='avatar avatar-nav'>
            <img
              src={user.avtar && user.avtar.url}
              alt={user && user.name}
              className='rounded-circle'
            />
            </figure>
              <span>{user && user.name}</span>
          </Link>
        </div>
      )  : !loading && <Link to='/login' className="btn ml-4" id="login_btn">Login</Link> }
      {/* <Link to='/login' className="btn ml-4" id="login_btn">Login</Link> */}
      
       

      </div>
    </nav>
    </>
  )
}

export  default Header;
