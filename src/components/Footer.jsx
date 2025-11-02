import { Link } from "react-router-dom"
import logo from "../assets/logo.png"
import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="LNCT Logo" />
            <p>Legacy of Excellence</p>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/colleges">Colleges</Link>
                </li>
                <li>
                  <Link to="/schools">Schools</Link>
                </li>
                <li>
                  <Link to="/medical">Medical</Link>
                </li>
                <li>
                  <Link to="/industries">Industries</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3>Resources</h3>
              <ul>
                <li>
                  <a href="#">Admissions</a>
                </li>
                <li>
                  <a href="#">Scholarships</a>
                </li>
                <li>
                  <a href="#">Placements</a>
                </li>
                <li>
                  <a href="#">Research</a>
                </li>
                <li>
                  <a href="#">Events</a>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3>Support</h3>
              <ul>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Student Portal</a>
                </li>
                <li>
                  <a href="#">Faculty Portal</a>
                </li>
                <li>
                  <a href="#">Alumni</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} LNCT Group. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
