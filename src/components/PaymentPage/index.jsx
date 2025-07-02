import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header';
import Footer from '../Footer';

const goTohome = () => {
  localStorage.removeItem('cartItems')
}


const PaymentPage = () => (
  <>
    <div style={{minHeight: '100vh', background:'#fff'}}>
      <Header />
      <div id="payment-container">
        <img
          src="https://res.cloudinary.com/dqfqwre2q/image/upload/v1714733562/Group_7417_m7li1s.png"
          alt="payment-iconsy"
        />
        <h1 className="payment-head">Payment Successful</h1>
        <div>
          <p className="payment-talk">Thank you for ordering</p>
          <p className="payment-talk">Your payment is successfully completed</p>
        </div>
        <button type="button" onClick={goTohome} id="goToHomepage">
          <Link to="/" id="linkHome">
            Return to Homepage
          </Link>
        </button>
      </div>
      <Footer />
      </div>
    </>
)

export default PaymentPage