import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
import './index.css'
function Footer() {
  return (
    <div style={{ background: 'green', padding: '20px', textAlign: 'center' }}>
      <h3>
        For any queries, contact +91-6301165855 <br />
        or mail us at kushalmohith09@gmail.com
      </h3>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '2rem' }}>
          <FaFacebook />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '2rem' }}>
          <FaTwitter />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '2rem' }}>
          <FaInstagram />
        </a>
      </div>
      <p> &copy; {new Date().getFullYear()} NxtMart Grocery Supplies Pvt Ltd </p>
    </div>
  )
}

export default Footer