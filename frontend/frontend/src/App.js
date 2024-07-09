import './App.css';
import {BrowserRouter ,Route,Routes} from 'react-router-dom'
import Home from './components/Home';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import ProductDetail from './components/product/ProductDetail';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { loadUser } from './action/userAction';
import store from './store'
import { useEffect } from 'react';


  function App() {
    
    useEffect(()=>{
      store.dispatch(loadUser())
    },[])
    return (
     <>
    <BrowserRouter>
     <Header/>
    
     {/* <Routes> */}
     <Route path='/' component={Home} exact/>
     {/* <Route path='/product/:id' element={<ProductDetail />} exact/> */}
     <Route path='/product/:id' component={ProductDetail} exact/> 
     <Route path='/search/:keyword' component={Home} exact/>
     <Route path='/login' component={Login} exact/>
     <Route path='/register' component={Register} exact/>
     {/* </Routes> */}

     <Footer/>
    </BrowserRouter>
</>
  );
}

export default App;
