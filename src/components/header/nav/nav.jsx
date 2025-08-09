import React from 'react';
import {NavLink} from 'react-router-dom';



function Nav() {
    return(
        <> 
        
        <nav className='bg-white  flex flex-col md:flex-row md:bg-white border md:border-0  gap-4'>

            <NavLink  to='/' className={(navData) => navData.isActive ? 'm-2 mb-0 p-2 text-primary md:border-b-2 dark:text-primary md:border-primary ' : 'm-2 p-2 mb-0' }> Home</NavLink>
            <NavLink to='/bill' className={(navData) => navData.isActive ? 'm-2 mb-0 text-primary md:border-b-2 dark:text-primary md:border-primary p-2' : 'm-2 p-2 mb-0' }>Bill</NavLink>
            <NavLink to='/customers'className={(navData) => navData.isActive ? 'm-2 mb-0 text-primary md:border-b-2 dark:text-primary md:border-primary p-2' : 'p-2 m-2 mb-0' }>Customer</NavLink>
            <NavLink to='/products' className={(navData) => navData.isActive ? 'm-2 mb-0 text-primary md:border-b-2 dark:text-primary md:border-primary p-2' : 'm-2 p-2 md:mb-0' }>Products</NavLink>

        </nav>
        </>
       
    );
}

export default Nav;