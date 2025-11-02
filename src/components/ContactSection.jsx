"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import "./ContactSection.css"

const ContactSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    newsletter: false,
  })

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const res = await fetch("https://lnctworld.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })
  
      const data = await res.json()
  
      if (data.success) {
        setFormStatus({
          submitted: true,
          success: true,
          message: "Thank you for your message! We will get back to you soon.",
        })
        setFormData({
          name: "",
          email: "",
          message: "",
          newsletter: false,
        })
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          message: data.message || "Something went wrong!",
        })
      }
  
      setTimeout(() => {
        setFormStatus({ submitted: false, success: false, message: "" })
      }, 5000)
    } catch (error) {
      console.error("Submit Error:", error)
      setFormStatus({
        submitted: true,
        success: false,
        message: "Server error. Please try again later.",
      })
    }
  }
  

  return (
    <section className="contact-section" id="contact" ref={ref}>
      <div className="container">
        <h2
          className="section-title">
          Contact Us
        </h2>

        <div className="contact-container">
          <div className="contact-info">
            <h3>Get In Touch</h3>
            <p>We'd love to hear from you. Feel free to reach out with any questions or inquiries.</p>

            <div className="info-item">
              <div className="icon">
                <span className="material-symbols-outlined" style={{ fontSize: 28, verticalAlign: "middle" }}>
                  distance
                </span>
              </div>
              <div>
                <h4>Address</h4>
                <p>LNCT Campus, Raisen Road, Bhopal, Madhya Pradesh, India</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">
                <span className="material-symbols-outlined" style={{ fontSize: 28, verticalAlign: "middle" }}>
                  call
                </span>
              </div>
              <div>
                <h4>Phone</h4>
                <p>+91 755 123 4567</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon">
                <span className="material-symbols-outlined" style={{ fontSize: 28, verticalAlign: "middle" }}>
                  mail
                </span>
              </div>
              <div>
                <h4>Email</h4>
                <p>info@lnct.ac.in</p>
              </div>
            </div>

            <div className="social-links">
  <a
    href="https://www.facebook.com/LNCTgroupofColleges"
    className="social-link"
    target="_blank"
    rel="noopener noreferrer"
  >
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  </a>
  <a
    href="https://www.instagram.com/lnctgroupofcolleges/"
    className="social-link"
    target="_blank"
    rel="noopener noreferrer"
  >
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
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  </a>
  <a
    href="https://www.linkedin.com/company/lnct-group-of-colleges-bhopal/"
    className="social-link"
    target="_blank"
    rel="noopener noreferrer"
  >
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  </a>
  <a
    href="https://x.com/lnct_group"
    className="social-link"
    target="_blank"
    rel="noopener noreferrer"
  >
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
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
  </a>
</div>
          </div>

          <div className="contact-form">
            {formStatus.submitted && (
              <div className={`form-message ${formStatus.success ? "success" : "error"}`}>{formStatus.message}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <div
        className="scroll-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </div>
    </section>
  )
}

export default ContactSection
