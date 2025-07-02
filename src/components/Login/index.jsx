import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showError, setShowError] = useState(false)
  const [type, setType] = useState('password')
  const [buttonOk, setButtonOk] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      navigate('/home')
    }
  }, [navigate])

  const handleUsernameChange = e => {
    setUsername(e.target.value)
    checkButtonState(e.target.value, password)
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
    checkButtonState(username, e.target.value)
  }

  const checkButtonState = (uname, pwd) => {
    setButtonOk(uname.trim() !== '' && pwd.trim() !== '')
  }

  const togglePassword = () => {
    setType(prev => (prev === 'password' ? 'text' : 'password'))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 365})
      navigate('/home')
    } else {
      setShowError(true)
      setErrorMsg(data.error_msg)
    }
  }

  return (
    <div className="login-form-container">
      <form id="form-container" onSubmit={handleSubmit}>
        <img
          src="https://res.cloudinary.com/dqfqwre2q/image/upload/v1713680287/Logo_2_ty0ilv.png"
          className="login-logo"
          alt="login website logo"
          style={{ width: '100px', height: '70px' , alignSelf: 'center' }}
        />

        <div className="input-container" style={{ marginTop: '20px' }}>
          <label className="input-label"  htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="username-input-filed"
            style={{width: '110%', color: 'brown', backgroundColor: 'white', border: 'solid', borderColor: 'grey',borderWidth: '1px', borderRadius: '4px', padding: '8px'}}
            value={username}
            onChange={handleUsernameChange}
          />
        </div>

        <div className="input-container" style={{ marginTop: '10px' }}>
          <label className="input-label" htmlFor="password">Password</label>
          <input
            type={type}
            id="password"
            className="password-input-filed"
            value={password}
            style={{width: '110%', color: 'brown', backgroundColor: 'white', border: 'solid', borderColor: 'grey',borderWidth: '1px', borderRadius: '4px', padding: '8px'}}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="input-containerr" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <div id="passco">
            <input
              type="checkbox"
              className="check"
              id="showPassword"
              checked={type === 'text'}
              onChange={togglePassword}
              style={{ marginRight: '10px', backgroundColor: 'white', border: 'solid', borderColor: 'grey',borderWidth: '1px', borderRadius: '4px' }}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
        </div>

        <button
          id="login-button"
          type="submit"
          className={`login-button ${buttonOk ? 'button2' : ''}`}
          disabled={!buttonOk}
        >
          Login
        </button>

        {showError && <p className="error-message">{errorMsg}</p>}
      </form>
    </div>
  )
}

export default Login
