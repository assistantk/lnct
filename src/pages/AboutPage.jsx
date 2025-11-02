import React, { useState } from 'react';
import { ExternalLink, Award, Users, BookOpen, MapPin, Calendar, Phone, Mail } from 'lucide-react';
import './AboutPageModern.css';
import logo from '../assets/logo.png';

// Main About Page Component
const AboutPage = () => {
  const [activeSection, setActiveSection] = useState('vision');

  // Alumni data
  const alumni = [
    {
      name: "Rajesh Kumar",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      description: "Senior Software Engineer at Google"
    },
    {
      name: "Priya Sharma",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      description: "Product Manager at Microsoft"
    },
    {
      name: "Amit Patel",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      description: "Data Scientist at Amazon"
    },
    {
      name: "Sneha Gupta",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      description: "CTO at Tech Startup"
    },
    {
      name: "Vikram Singh",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      description: "AI Research Scientist at Meta"
    },
    {
      name: "Kavya Reddy",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      description: "Blockchain Developer at Coinbase"
    }
  ];

  // Faculty data
  const faculty = [
    {
      name: "Dr. Anand Verma",
      image: "https://randomuser.me/api/portraits/men/10.jpg",
      role: "Head of Computer Science",
      description: "PhD in AI/ML with 15+ years experience"
    },
    {
      name: "Dr. Sunita Agarwal",
      image: "https://randomuser.me/api/portraits/women/10.jpg",
      role: "Professor of Electronics",
      description: "Research expert in IoT and Embedded Systems"
    },
    {
      name: "Dr. Rahul Mishra",
      image: "https://randomuser.me/api/portraits/men/11.jpg",
      role: "Associate Professor",
      description: "Specializes in Data Science and Analytics"
    },
    {
      name: "Dr. Meera Joshi",
      image: "https://randomuser.me/api/portraits/women/11.jpg",
      role: "Assistant Professor",
      description: "Expert in Cybersecurity and Network Systems"
    }
  ];

  // Key areas data
  const keyAreas = [
    {
      id: 'research',
      title: 'Research & Patents',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      description: 'Leading innovation with 150+ research papers and 25+ patents in emerging technologies including AI, IoT, and sustainable engineering solutions.'
    },
    {
      id: 'clubs',
      title: 'Clubs & Societies',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
      description: 'Vibrant campus life with 30+ active clubs covering technology, arts, sports, and social initiatives that foster holistic development.'
    },
    {
      id: 'placements',
      title: 'Placements',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
      description: 'Excellent placement record with 95% success rate. Top recruiters include Google, Microsoft, Amazon, and leading Indian tech companies.'
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure & Labs',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
      description: 'State-of-the-art infrastructure with modern laboratories, high-tech equipment, digital classrooms, and world-class facilities supporting hands-on learning.'
    }
  ];

  return (
    <div className="about-page">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="college-info-card">
            <div className="college-logo">          
            <img src={logo} alt="LNCT Logo" className="lnct-logo-img" />
            </div>
            <div className="college-details">
              <h1>Lakshmi Narain College of Technology</h1>
              <p className="location">Bhopal, Madhya Pradesh, India</p>
              <p className="tagline">Shaping Tomorrow's Leaders - Excellence in Technical Education Since 1994</p>
            </div>
          </div>
        </div>
      </section>
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <Calendar className="stat-icon" />
              <div className="stat-info">
                <h4>Established</h4>
                <p>1994</p>
              </div>
            </div>
            <div className="stat-card">
              <Award className="stat-icon" />
              <div className="stat-info">
                <h4>Accreditation</h4>
                <p>NAAC 'A' Grade</p>
              </div>
            </div>
            <div className="stat-card">
              <Users className="stat-icon" />
              <div className="stat-info">
                <h4>Students</h4>
                <p>15,000+</p>
              </div>
            </div>
            <div className="stat-card">
              <BookOpen className="stat-icon" />
              <div className="stat-info">
                <h4>Programs</h4>
                <p>30+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About LNCT Section */}
      <section className="about-lnct-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About LNCT</h2>
              <p>
                Lakshmi Narain College of Technology (LNCT) is one of Central India's premier technical institutions,
                committed to providing quality education and shaping future engineers and technologists. With
                state-of-the-art facilities and experienced faculty, LNCT has established itself as a center of
                excellence in technical education.
              </p>
              <a href="https://lnct.ac.in/" target="_blank" rel="noopener noreferrer" className="cta-button">
                Visit Official Website
                <ExternalLink size={18} />
              </a>
            </div>
            <div className="features-highlights">
              <h3>Why Choose LNCT?</h3>
              <div className="feature-item">
                <Award className="feature-icon" />
                <div>
                  <h4>AICTE Approved</h4>
                  <p>Affiliated to RGPV, Bhopal with all necessary approvals</p>
                </div>
              </div>
              <div className="feature-item">
                <Users className="feature-icon" />
                <div>
                  <h4>Industry Connect</h4>
                  <p>Strong placement record with leading companies</p>
                </div>
              </div>
              <div className="feature-item">
                <BookOpen className="feature-icon" />
                <div>
                  <h4>Modern Infrastructure</h4>
                  <p>State-of-the-art labs and campus facilities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="vision" className="section vision-mission">
        <div className="container">
          <h2 className="section-title">Vision & Mission</h2>
          <div className="vision-mission-content">
            <div className="vision-card">
              <h3>Our Vision</h3>
              <p>To be a globally recognized institution of excellence in technical education, fostering innovation, research, and entrepreneurship while developing industry-ready professionals who contribute meaningfully to society and drive technological advancement.</p>
            </div>
            <div className="mission-card">
              <h3>Our Mission</h3>
              <ul>
                <li>Provide world-class technical education with industry-relevant curriculum</li>
                <li>Foster research and innovation in emerging technologies</li>
                <li>Develop ethical leaders and responsible citizens</li>
                <li>Create strong industry partnerships for practical learning</li>
                <li>Promote entrepreneurship and startup culture</li>
                <li>Ensure inclusive and sustainable growth</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Notable Alumni Section */}
      <section id="alumni" className="section alumni-section">
        <div className="container">
          <h2 className="section-title">Notable Alumni</h2>
          <div className="alumni-grid">
            {alumni.map((alum, index) => (
              <div key={index} className="alumni-card">
                <div className="alumni-image">
                  <img src={alum.image} alt={alum.name} />
                </div>
                <div className="alumni-info">
                  <h3>{alum.name}</h3>
                  <p>{alum.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Areas Sections */}
      {keyAreas.map((area, index) => (
        <section key={area.id} id={area.id} className={`section key-area ${index % 2 === 1 ? 'reverse' : ''}`}>
          <div className="container">
            <div className="key-area-content">
              <div className="key-area-image">
                <img src={area.image} alt={area.title} />
              </div>
              <div className="key-area-text">
                <h2>{area.title}</h2>
                <p>{area.description}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Faculty Section */}
      <section id="faculty" className="section faculty-section">
        <div className="container">
          <h2 className="section-title">Our Faculty</h2>
          <div className="faculty-grid">
            {faculty.map((member, index) => (
              <div key={index} className="faculty-card">
                <div className="faculty-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="faculty-info">
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                  <p>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="section-title">Contact Information</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={24} className="contact-icon" />
                <div>
                  <h4>Address</h4>
                  <p>Kalchuri Nagar, Raisen Road, Bhopal, MP - 462022</p>
                </div>
              </div>
              <div className="contact-item">
                <Phone size={24} className="contact-icon" />
                <div>
                  <h4>Phone</h4>
                  <p>+91-755-6185300</p>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={24} className="contact-icon" />
                <div>
                  <h4>Email</h4>
                  <p>info@lnct.ac.in</p>
                </div>
              </div>
            </div>
            <div className="cta-container">
              <h3>Ready to explore more?</h3>
              <p>Visit the official LNCT website for complete information about courses, admissions, and more.</p>
              <a href="https://lnct.ac.in/" target="_blank" rel="noopener noreferrer" className="cta-button large">
                Visit Official Website
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;