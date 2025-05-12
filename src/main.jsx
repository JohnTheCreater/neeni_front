import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import GenerateBill from './pages/bill/generateBill/GenerateBill.jsx'
import Bill from './pages/bill/Bill.jsx'
import Products from './pages/products/products.jsx'
import Customers from './pages/Customers/Customers.jsx'
import Login from './pages/login/Login.jsx'
import PrivateRoute from './auth/PrivateRoute.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import SetAuthInfo from './pages/setAuthInfo/SetAuthInfo.jsx'

const router=createBrowserRouter([

  {
    path:'/products',
   element:<PrivateRoute element={Products} />
  },
  {
    path:'/customers',
   element:<PrivateRoute element={Customers} />
  },
  {
    path:"/",
    element:<Login/>
  },
  {
    path:'/home',
    element:<PrivateRoute element={Home}/>
  },
  {
    path:'/bill/generateBill',
    element:<PrivateRoute element={GenerateBill} />
  },
  {
    path:'/bill',
    element:<PrivateRoute element={Bill} />
  },

  {
    path:"/login",
    element:<Login/>
  }
  ,
  {
    path:"/setAuthInfo",
    element:<PrivateRoute element={SetAuthInfo}/>
  }

])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
