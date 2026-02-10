
import Logo from '../../assets/Fineasylogo.svg'
import './navbar.css'

const Navbar = () => {


  return (
    <nav className="nav">
      <div className="image">
        <img src={Logo} alt="Logo" />
      </div>

      <div className="navlinks">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href='#'>Services</a>
      </div>

      <div className="nav-cta">
        <button className="login" onClick={() => window.location.href = 'http://localhost:5177/login'}>Analyze now!</button>
      </div>
    </nav>
  )
}

export default Navbar
