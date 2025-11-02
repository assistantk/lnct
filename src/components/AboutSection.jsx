"use client"

import { useEffect, useRef, useState } from "react"
import "./AboutSection.css"
import director from "../assets/director_img.png"
import secretary from "../assets/Secretary_Img.png"
import viceChair from "../assets/viceChair_img.png"
import exe_director from "../assets/executiveDir_img.png"

const leaders = [
  {
    name: "Shri Jai Narain Chouksey",
    title: "Founder & Chairman",
    image: director,
    message: "We started LNCT with a mission to empower youth through quality education. The journey has been remarkable.",
  },
  {
    name: "Smt. Poonam Chouksey",
    title: "Vice Chairperson",
    image: viceChair,
    message: "Our vision is to constantly innovate and improve the learning experience for our students.",
  },
  {
    name: "Smt. Poojashree Chouksey",
    title: "Executive Director",
    image: exe_director,
    message: "At LNCT, we focus on holistic development—academics, ethics, and innovation go hand in hand.",
  },
  {
    name: "Dr. Anupam Chouksey",
    title: "Secretary",
    image: secretary,
    message: "Every student deserves a bright future. Our institution is committed to making that a reality.",
  },
]

const timelineEvents = [
  { year: "1994", event: "Establishment of LNCT Bhopal" },
  { year: "2004", event: "Launch of LNCT Indore campus." },
  { year: "2006", event: "Founding of LNCTS (Lakshmi Narain College of Technology & Science), Bhopal." },
  { year: "2007", event: "Establishment of LNCTE (Lakshmi Narain College of Technology Excellence), Bhopal." },
  { year: "2008", event: "Inception of LNCT Jabalpur campus." },
  { year: "2015", event: "Formation of LNCT University, Bhopal." },
  { year: "2021", event: "Opening of LNCT Medical College and Sewakunj Hospital, Indore." },
  { year: "2023", event: "Establishment of Kalchuri LNCT Group Incubation Centre (KLIC), Celebrating 30 Years of Excellence" },
]

const AboutSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideIntervalRef = useRef(null)
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

  // Auto-slide
  useEffect(() => {
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % leaders.length)
    }, 10000)
    return () => clearInterval(slideIntervalRef.current)
  }, [])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    if (window.innerWidth > 600) return // Only on mobile
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    if (window.innerWidth > 600) return
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (window.innerWidth > 600) return
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const delta = touchEndX.current - touchStartX.current
      if (Math.abs(delta) > 50) {
        if (delta < 0 && currentSlide < leaders.length - 1) {
          setCurrentSlide(currentSlide + 1)
        } else if (delta > 0 && currentSlide > 0) {
          setCurrentSlide(currentSlide - 1)
        }
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section className="about-section" id="about">
      <div className="container">
        <h2 className="section-title">Visionaries Behind LNCT</h2>

        {/* Leader Slider */}
        <div className="leader-slider">
          <div
            className="slide-content"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="leader-image">
              <img src={leaders[currentSlide].image} alt={leaders[currentSlide].name} />
            </div>
            <div className="leader-info">
              <h3>{leaders[currentSlide].name}</h3>
              <h4 style={{ margin: 0, fontWeight: 400 }}>{leaders[currentSlide].title}</h4>
              <p className="leader-message">{leaders[currentSlide].message}</p>
            </div>
          </div>
          <div className="slider-dots">
            {leaders.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          <h3>Our Journey</h3>
          <div className="timeline-container">
            {timelineEvents.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>{event.year}</h4>
                  <p>{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
