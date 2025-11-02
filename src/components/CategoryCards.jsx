"use client"

import { useRef, useState, useEffect } from "react"
import "./CategoryCards.css"
import { motion, useInView } from "framer-motion"

const CategoryCards = () => {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("https://lnctworld.onrender.com/api/services")
        const data = await res.json()
        if (data.success) {
          setServices(data.data)
        } else {
          setError(data.message || "Failed to fetch data")
        }
      } catch (err) {
        setError("Server error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const updateNavButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const maxScroll = scrollWidth - clientWidth
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < maxScroll - 1)
    }
  }

  const smoothScrollTo = (element, target, duration = 400) => {
    const start = element.scrollLeft
    const change = target - start
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)

      element.scrollLeft = start + change * easeOut

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        setIsScrolling(false)
        updateNavButtons()
      }
    }

    setIsScrolling(true)
    requestAnimationFrame(animateScroll)
  }

  const scrollCards = (direction) => {
    if (isScrolling || !scrollContainerRef.current) return
    const cardWidth = 280 + 24
    const currentScroll = scrollContainerRef.current.scrollLeft
    let targetScroll = direction === "next" ? currentScroll + cardWidth : currentScroll - cardWidth
    const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll))
    smoothScrollTo(scrollContainerRef.current, targetScroll)
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      if (!isScrolling) updateNavButtons()
    }

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        scrollCards("prev")
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        scrollCards("next")
      }
    }

    const handleResize = () => updateNavButtons()

    let startX = 0, startY = 0, isTouch = false
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      isTouch = true
    }

    const handleTouchMove = (e) => {
      if (!isTouch) return
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      if (Math.abs(startX - currentX) > Math.abs(startY - currentY)) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e) => {
      if (!isTouch) return
      const diffX = startX - e.changedTouches[0].clientX
      if (Math.abs(diffX) > 50) scrollCards(diffX > 0 ? "next" : "prev")
      isTouch = false
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("resize", handleResize)
    scrollContainer.addEventListener("touchstart", handleTouchStart, { passive: true })
    scrollContainer.addEventListener("touchmove", handleTouchMove, { passive: false })
    scrollContainer.addEventListener("touchend", handleTouchEnd, { passive: true })

    updateNavButtons()

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("resize", handleResize)
      scrollContainer.removeEventListener("touchstart", handleTouchStart)
      scrollContainer.removeEventListener("touchmove", handleTouchMove)
      scrollContainer.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isScrolling])

  const headerRef = useRef(null)
  const isInView = useInView(headerRef, { once: true })

  return (
    <div className="category-cards-container">
      <div className="header">
        <motion.h1
          className="section-title"
          style={{
            fontSize: "2.5rem",
            textAlign: "center",
            marginBottom: "40px",
            color: "var(--secondary)",
            position: "relative",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          ref={headerRef}
        >
          What We Offer ?
        </motion.h1>
        <p>A perfect blend of innovation, quality, and value—crafted to meet your needs and exceed expectations.</p>
      </div>

      {loading ? (
        <p>Loading services...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="scroll-wrapper">
          <button
            className={`nav-button prev ${!canScrollLeft ? "disabled" : ""}`}
            onClick={() => scrollCards("prev")}
            disabled={!canScrollLeft}
            aria-label="Previous"
          />
          <button
            className={`nav-button next ${!canScrollRight ? "disabled" : ""}`}
            onClick={() => scrollCards("next")}
            disabled={!canScrollRight}
            aria-label="Next"
          />
          <div className="scroll-container" ref={scrollContainerRef}>
            {services.map((service, index) => (
              <a
                key={service.id}
                href={service.link}
                className={`card card-${index + 1}`}
                tabIndex="0"
              >
                <div className="cardImgContainer">
                  <img
                    src={`https://lnctworld.onrender.com/api/services/image/${service.id}` || "/placeholder.svg"}
                    alt={service.alt}
                    className="card-image"
                  />
                </div>
                <div className="card-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="card-features">
                    {service.features?.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryCards
