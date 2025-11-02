"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import "./MapSection.css"

const MapSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  // Mock locations for LNCT campuses
  const locations = [
    { id: 1, name: "LNCT Bhopal", address: "Raisen Road, Bhopal, Madhya Pradesh" },
    { id: 2, name: "LNCT Indore", address: "Indore, Madhya Pradesh" },
    { id: 3, name: "LNCT Jabalpur", address: "Jabalpur, Madhya Pradesh" },
  ]

  return (
    <section className="map-section" id="locations" ref={ref}>
      <div className="container">
        <h2 className="section-title">
          Our Locations
        </h2>

        <div className="map-container">
          {/* Google Maps iframe (using a placeholder for now) */}
          <div className="google-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.2093742113196!2d77.4720833!3d23.2332889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c42ebc7a74ef9%3A0xab4adc3d3f41f0a!2sLNCT%20Bhopal!5e0!3m2!1sen!2sin!4v1653651234567!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="LNCT Locations"
            ></iframe>
          </div>

          <div className="locations-list">
            <h3>Our Campuses</h3>
            <ul>
              {locations.map((location) => (
                <li key={location.id}>
                  <h4>{location.name}</h4>
                  <p>{location.address}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MapSection
