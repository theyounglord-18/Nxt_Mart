import React from 'react'
import './index.css'
function NotFound() {
  return (
    <div className='notfound-container'>
        <div id="notfound-card">
            <img
            src="https://res.cloudinary.com/dqfqwre2q/image/upload/v1713691571/not%20found.png"
            alt="notFound"
            id="not-found-image"/>
            <h2>Page Not Found.</h2>
            <p>We are sorry, the page you requested could not be found</p>
        </div>
    </div>
  )
}

export default NotFound
