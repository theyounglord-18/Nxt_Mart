import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { CiLogout } from 'react-icons/ci'
import { AiFillHome } from 'react-icons/ai'
import { FaShoppingCart } from 'react-icons/fa'
import './index.css'

const Header = () => {
  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('productQuantities')
    navigate('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div>
          <Link to="/">
            <img
              className="website-logo"
              src="https://res.cloudinary.com/dqfqwre2q/image/upload/v1713680287/Logo_2_ty0ilv.png"
              alt="website logo"
            />
          </Link>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link" title="Home">
              <AiFillHome size={28} />
            </Link>
          </li>
          <li>
            <Link to="/cart" className="another-radium" title="Cart">
              <FaShoppingCart size={26} />
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="logic buttonsy reddy"
              onClick={onClickLogout}
            >
              <CiLogout className="sizer" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header