import { useState, useEffect } from 'react'
import ProductList from './components/ProductList'
import SuccessMessage from './components/SuccessMessage'
import FailureMessage from './components/FailureMessage'

function App() {
  const [currentPage, setCurrentPage] = useState('products')
  const [redirectStatus, setRedirectStatus] = useState(null)

  useEffect(() => {
    console.log('App mounted - checking URL for redirect status')
    // Check URL for redirect status from xPay Checkout
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    
    if (success !== null) {
      const isSuccess = success === 'true'
      setRedirectStatus({ success: isSuccess })
      setCurrentPage(isSuccess ? 'success' : 'failure')
      
      // Clean up URL (remove query params)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleContinueShopping = () => {
    setCurrentPage('products')
    setRedirectStatus(null)
  }

  return (
    <div className="page-container">
      <header className="header">
        <div className="container">
          <h1>xPay Store</h1>
          <p>Browse and purchase products with secure checkout</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {currentPage === 'products' && (
            <ProductList />
          )}
          
          {currentPage === 'success' && (
            <SuccessMessage onContinue={handleContinueShopping} />
          )}
          
          {currentPage === 'failure' && (
            <FailureMessage onContinue={handleContinueShopping} />
          )}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2026 xPay Merchant. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </footer>
    </div>
  )
}

export default App
