"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import "./HeroSection.css"

const HeroSection = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const currentMount = mountRef.current

    // Basic Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    currentMount.appendChild(renderer.domElement)

    // Load globe textures
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load("https://th.bing.com/th/id/R.0bf69b1822e4c13af523c1e4dc0cb582?rik=E1KHhTAUOJbQ6w&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fzRBDGWP.jpg&ehk=OOCCnIuYqqtTXlH6BZu%2faBuBincLw0H0OUTD8QLgkyo%3d&risl=&pid=ImgRaw&r=0") // <-- Use your new colorful map
    const bumpTexture = textureLoader.load("/textures/earth-bump.jpg")
    const specularTexture = textureLoader.load("/textures/earth-specular.jpg")
    const nightTexture = textureLoader.load("scr/assets/earth.jpg") // <-- Add this file
    const cloudsTexture = textureLoader.load("") // <-- Add this file

    // Main globe
    const geometry = new THREE.SphereGeometry(1.2, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.09, // slightly more for relief
      specularMap: specularTexture,
      specular: new THREE.Color("white"), // brighter highlights
      shininess: 18, // more shine
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    // Night lights layer
    const nightMaterial = new THREE.MeshBasicMaterial({
      map: nightTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.5,
    })
    const nightGlobe = new THREE.Mesh(geometry.clone(), nightMaterial)
    scene.add(nightGlobe)

    // Clouds layer
    const cloudsGeometry = new THREE.SphereGeometry(1.22, 64, 64)
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial)
    scene.add(clouds)

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.23, 64, 64)
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x3399ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // Controls (auto-rotate only)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableRotate = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.3

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      // Rotate clouds for realism
      clouds.rotation.y += 0.0005
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      nightMaterial.dispose()
      cloudsGeometry.dispose()
      cloudsMaterial.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
    }
  }, [])

  return (
    <div className="hero-section">
      {/* Animated particles */}
      <div className="cosmic-particles">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="cosmic-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="hero-content">
        <div className="earth-container" ref={mountRef}></div>

        <div className="hero-text-container">
          <motion.div
            className="hero-text"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
          >
            <motion.div
              className="hero-title"
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
            >
              <h1 className="lnct-text">
                <span className="letter">L</span>
                <span className="letter">N</span>
                <span className="letter">C</span>
                <span className="letter">T</span>
              </h1>
              <div className="cosmic-glow"></div>
            </motion.div>

            <motion.p
              className="tagline"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
            >
              <span className="tagline-main">Legacy of Excellence</span>
              <span className="tagline-sub">Across the Educational Universe</span>
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 3.2 }}
            >
              <motion.a
                href="#services"
                className="explore-universe-btn"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Universe
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        className="cosmic-scroll-indicator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 4 }}
      >
        <motion.div
          className="scroll-cosmic-arrow"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </motion.div>
      <img src="src/assets/32YRS-03-min-150x150.png" alt="Top Left Decoration" className="corner-img top-left" />
      <img src="src/assets/1-web.png" alt="Top Right Decoration" className="corner-img top-right" />
    </div>
  )
}

export default HeroSection
