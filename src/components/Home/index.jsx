import {Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import Content from '../Content'  
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Navigate to="/login" />
  }
  return (
    <div className="list-container">
      <div className="page-root">
        <Header />
        <div className="content-layout">
          <Content />
        </div>
        <Footer />
      </div>
    </div>
  )
}
export default Home