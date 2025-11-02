"use client"

import { Helmet } from "react-helmet"
import { motion } from "framer-motion"
import HeroSection from "../components/HeroSection"
import CategoryCards from "../components/CategoryCards"
import CampusCarousel from "../components/CampusCarousel"
import AboutSection from "../components/AboutSection"
import MapSection from "../components/MapSection"
import ContactSection from "../components/ContactSection"

const HomePage = () => {
  return (
    <div>
      <Helmet>
        <title>LNCT Group | Home</title>
        <meta
          name="description"
          content="Explore LNCT Group – a leading education hub across Madhya Pradesh. Discover top colleges, schools, medical institutes, and industries in Bhopal, Indore, Jabalpur, Gwalior, and more."
        />
        <meta
          name="keywords"
          content="LNCT, LNCT Group, LNCT Bhopal, LNCT Indore, LNCT Jabalpur, LNCT Gwalior, LNCT Ujjain, LNCT colleges MP, LNCT schools, LNCT medical college, LNCT engineering, LNCT industries, digital campus, LNCT admission 2025"
        />
        <link rel="canonical" href="https://akshatgupta.space/" />

        {/* Open Graph for social sharing */}
        <meta property="og:title" content="LNCT Group | Home" />
        <meta
          property="og:description"
          content="Explore top institutions under LNCT Group in Bhopal, Indore, Jabalpur, Gwalior and more. Start your academic and professional journey with us."
        />
        <meta property="og:image" content="https://akshatgupta.space/assets/logo.png" />
        <meta property="og:url" content="https://akshatgupta.space/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LNCT Group | Home" />
        <meta
          name="twitter:description"
          content="Explore top institutions under LNCT Group in Bhopal, Indore, Jabalpur, Gwalior and more. Start your academic and professional journey with us."
        />
        <meta name="twitter:image" content="https://akshatgupta.space/assets/logo.png" />
      </Helmet>

      <div id="home">
        <HeroSection />
      </div>

      <div id="services">
        <CategoryCards />
        <CampusCarousel />
      </div>

      <div id="about">
        <AboutSection />
      </div>

      <div id="map">
        <MapSection />
      </div>

      <div id="contact">
        <ContactSection />
      </div>
    </div>
  )
}

export default HomePage
