
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({element:Element,...rest}) => {

    const {isLoggedIn} = useAuth()
  return isLoggedIn?<Element {...rest}/>:<Navigate to={"/login"}/>
}

export default PrivateRoute
