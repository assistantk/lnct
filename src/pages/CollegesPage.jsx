"use client"

import { Helmet } from "react-helmet"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import "./InfoPage.css"

import { useEffect, useState } from "react"

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/colleges");
        const data = await response.json();
        setColleges(data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    fetchColleges();
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
      <Helmet>
        <title>Colleges under LNCT Group | Bhopal, Indore, Jabalpur</title>
        <meta
          name="description"
          content="Discover top colleges under LNCT Group in Bhopal, Indore, and Jabalpur. Explore a wide range of undergraduate and postgraduate programs with state-of-the-art facilities."
        />
        <meta
          name="keywords"
          content="LNCT, LNCT Group, LNCT colleges, LNCT University Bhopal, LNCT Indore, LNCT Jabalpur, engineering colleges MP, top colleges in Madhya Pradesh, private colleges Bhopal, LNCT courses"
        />
        <link rel="canonical" href="https://akshatgupta.space/colleges" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="LNCT Group Colleges | Bhopal, Indore, Jabalpur" />
        <meta
          property="og:description"
          content="Explore premier colleges under LNCT Group across Madhya Pradesh with top courses and industry-oriented programs."
        />
        <meta property="og:image" content="https://akshatgupta.space/assets/logo.png" />
        <meta property="og:url" content="https://akshatgupta.space/colleges" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LNCT Colleges in MP | Engineering, Management & More" />
        <meta
          name="twitter:description"
          content="Explore top LNCT colleges in Bhopal, Indore, and Jabalpur – offering engineering, pharmacy, and business courses."
        />
        <meta name="twitter:image" content="https://akshatgupta.space/assets/logo.png" />
      </Helmet>
     <div 
        className="hero-section"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://lnct.ac.in/wp-content/uploads/2021/05/LNCT-A-scaled.jpg') no-repeat center center / cover`,
            minHeight: '70vh', // Adjust height as needed
            width: '100%',
            position: 'relative',
            marginTop: '-80px', // Pull up to cover navbar (adjust based on your navbar height)
            paddingTop: '80px'
        }}
      >
      <div className="info-header" style={{ paddingTop: '100px' }}>
        <div className="container">
          <h1>Colleges & Universities</h1>
          <p>
            Explore our prestigious colleges and universities offering a wide
            range of courses
          </p>
        </div>
      </div>
    </div>

      <div className="container">
        <div className="info-content">
          {colleges.map((college, index) => (
            <motion.div
              key={college.id}
              className="info-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="info-card-image">
                <img
                  src={college.image}
                  alt={college.name}
                  loading="lazy"
                />
              </div>
              <div className="info-card-content">
                <h2>{college.name}</h2>
                <p className="info-description">{college.description}</p>

                <div className="info-details">
                  <div className="info-detail">
                    <h3>Established</h3>
                    <p>{college.established}</p>
                  </div>
                  <div className="info-detail">
                    <h3>Courses Offered</h3>
                    <div className="info-tags">
                      {college.courses.map((course, i) => (
                        <span key={i} className="info-tag">
                          {course}
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

export default CollegesPage
