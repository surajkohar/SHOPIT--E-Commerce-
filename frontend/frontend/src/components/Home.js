import React, { useEffect,useState } from 'react'
import MetaData from './layout/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../action/productAction'
import Product from './product/Product'

// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';

import Loader from './layout/Loader'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import { useParams } from 'react-router-dom'

// const {createSliderWithTooltip}=slider;
// const Range =createSliderWithTooltip(Slider.Range)

const Home = () => {
  
  // const [price,setPrice]=useState([1,1000])

  const params=useParams();
  let keyword=params.keyword;

  const [currentPage,setCurrentPage]=useState(1) 

  const dispatch = useDispatch()
  const { loading, error, products, productsCount,resPerPage} = useSelector(state => state.products)
  const alert=useAlert()
   
  useEffect(() => {
    
    if(error){
     alert.success('Success')
     return  alert.error(error)
    }
    dispatch(getProducts(keyword,currentPage))
  }, [dispatch,alert,error,keyword,currentPage])


  function setCurrentPageNo(pageNumber){
     setCurrentPage(pageNumber)
  }


  return (
    <>
    {loading ? <Loader />:
      <>
      <MetaData title={'Buy Best Product Online'} />
      <div className='container container-fluid'>
        <h1 id="products_heading">Latest Products</h1>
        <section id="products" className="container mt-5">
          <div className="row">

            {products && products.map(product => (
               
             <Product key={product._id} product={product} />
             
            ))

            }
          </div>
        </section>
        {resPerPage<=productsCount &&
          <div className='d-flex justify-content-center mt-5'>
           <Pagination
            activePage={currentPage}
              itemsCountPerPage={resPerPage}
              totalItemsCount={productsCount}
              onChange={setCurrentPageNo}
              nextPageText={'Next'}
              prevPageText={'Prev'}
              firstPageText={'First'}
              lastPageText={'Last'}
              itemClass="page-item"
              linkClass="page-link"
           />     
           </div>
        }
       
      </div>
      </>
    }
      
    </>


  )
}

export default Home