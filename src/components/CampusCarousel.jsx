"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"
import "./CampusCarousel.css"

const CampusCarousel = () => {
  const [events, setEvents] = useState([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://lnctworld.onrender.com/api/events")
        const data = await res.json()
        if (data.success) {
          setEvents(data.data)
        }
      } catch (err) {
        console.error("Error fetching events:", err)
      }
    }

    fetchEvents()
  }, [])

  return (
    <section className="campus-carousel-section" id="campus-life">
      <div className="container">
        <h2
          className="section-title"
          ref={ref}
        >
          Events
        </h2>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
            fontWeight: 400,
            textAlign: "center",
            marginBottom: "2rem"
          }}
        >
          Stay updated with our latest events, workshops, and networking opportunities designed to connect, inspire, and grow together
        </p>
        <div>
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            loop={true}
            className="campus-swiper"
          >
            {events.map((event) => (
              <SwiperSlide key={event.id}>
                <div className="campus-slide">
                  <div className="campus-image">
                    <img
                      src={`https://lnctworld.onrender.com/api/event/image/${event.id}`}
                      alt={event.title}
                      onError={(e) => e.currentTarget.src = "/placeholder.svg"}
                    />
                  </div>
                  <div className="campus-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export default CampusCarousel
