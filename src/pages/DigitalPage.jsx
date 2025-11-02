"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import "./InfoPage.css"

import { useEffect, useState } from "react"

const DigitalPage = () => {
  const [digitalPortals, setPortals] = useState([]);

  useEffect(() => {
    const fetchPortals = async () => {
      try {
        const response = await fetch("https://lnctworld.onrender.com/digitalPortals");
        const data = await response.json();
        setPortals(data);
      } catch (error) {
        console.error("Error fetching Portals:", error);
      }
    };

    fetchPortals();
  }, []);
  return (
    <motion.div
      className="info-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: 0 }}
    >
      <div 
        className="hero-section"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://th.bing.com/th/id/OIP.gTfLN96HSo8T11aHszgsRwHaD-?rs=1&pid=ImgDetMain') no-repeat center center / cover`,
            minHeight: '70vh', // Adjust height as needed
            width: '100%',
            position: 'relative',
            marginTop: '-80px', // Pull up to cover navbar (adjust based on your navbar height)
            paddingTop: '80px'
        }}
      >
      <div className="info-header">
        <div className="container">
          <h1>Digital & Academic Portals</h1>
          <p>Access our digital platforms and academic portals for enhanced learning</p>
        </div>
      </div>
</div>
      <div className="container">
        <div className="info-content">
          {digitalPortals.map((portal, index) => (
            <motion.div
              key={portal.id}
              className="info-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="info-card-image">
                <img src={portal.image || "/placeholder.svg"} alt={portal.name} />
              </div>
              <div className="info-card-content">
                <h2>{portal.name}</h2>
                <p className="info-description">{portal.description}</p>

                <div className="info-details">
                  <div className="info-detail">
                    <h3>Established</h3>
                    <p>{portal.established}</p>
                  </div>
                  <div className="info-detail">
                    <h3>Features</h3>
                    <div className="info-tags">
                      {portal.features.map((feature, i) => (
                        <span key={i} className="info-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                 <Link 
                    to="/about" 
                    className="btn"
                  >
                    Explore More
                  </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="back-link">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default DigitalPage
