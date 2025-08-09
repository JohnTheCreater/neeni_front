import React from 'react'
import LayOut from '../../components/LayOut/LayOut'
import AddProducts from './addProducts/AddProducts'
import ManageProducts from './manageProducts/ManageProducts'

const products = () => {
  return (
    <LayOut>
    <div className='md:flex'>
        <div className='md:w-[50%]'>
            <AddProducts/>

        </div>


        <div className='md:w-[50%]'>
                <ManageProducts/>
        </div>
    </div>
    </LayOut>
  )
}

export default products