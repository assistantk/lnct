import React, { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState("");

  const redirectToRolePage = (selectedRole) => {
    // Placeholder for actual redirect logic
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    redirectToRolePage(selectedRole);
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.backgroundOverlay}></div>
      <div style={styles.loginCard}>
        <h2 style={styles.loginTitle}>LNCT World Portal</h2>
        <p style={styles.subtitle}>Select your role to continue</p>
        <div style={styles.roleButtons}>
          {["Admin", "Student", "Employee", "Faculty"].map((r) => (
            <button
              key={r}
              type="button"
              style={{
                ...styles.roleBtn,
                ...(role === r ? styles.selected : {}),
              }}
              onClick={() => handleRoleSelect(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <div style={styles.footer}>
          <span style={{ color: "var(--secondary)", fontSize: "0.95rem" }}>
            Powered by {" "}
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>
              LNCT Group
            </span>
          </span>
        </div>
      </div>
      <style>{`
        :root {
          --primary: #FF7F3E;
          --secondary: #604CC3;
          --accent: #FFF6E9;
          --light-accent: #80C4E9;
          --background: #F8F8FA;
        }
        button:focus {
          outline: 2px solid var(--secondary);
        }
        button:hover {
          background: #f0edfd;
          color: var(--secondary);
          box-shadow: 0 3px 10px rgba(96, 76, 195, 0.15);
        }
      `}</style>
    </div>
  );
}

const styles = {
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    padding: "1rem",
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "url('https://th.bing.com/th/id/R.53dd42428ce5a64dd53f6854c5913025?rik=BVXFDDyjJ5Nekg&riu=http%3a%2f%2f3.bp.blogspot.com%2f-u3DwnftyAGM%2fTabdVYeqTHI%2fAAAAAAAABvY%2fkfqxwuapP3E%2fs1600%2flnct%2bBHOPAL%2bLakshmi%2bNarain%2bCollege%2bof%2bTechnology.jpg&ehk=cU9dS1ng3IxlnKjSpvuDEoTp0FRWHKKQ59ugQfg%2f9%2bk%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1')",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(2px)",
    zIndex: 0,
  },
  loginCard: {
    background: "#fff",
    padding: "2rem 2rem 1.5rem 2rem",
    borderRadius: "0.75rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "340px",
    textAlign: "center",
    border: "1px solid #eee",
    zIndex: 1,
    position: "relative",
  },
  loginTitle: {
    color: "var(--secondary)",
    marginBottom: "0.5rem",
    fontSize: "1.5rem",
    fontWeight: "700",
    letterSpacing: "0.3px",
  },
  subtitle: {
    color: "#666",
    fontSize: "0.95rem",
    marginBottom: "1.2rem",
    fontWeight: "400",
  },
  roleButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.6rem",
    justifyContent: "center",
    marginBottom: "1.3rem",
  },
  roleBtn: {
    background: "#f9f9fb",
    color: "var(--secondary)",
    padding: "0.55rem 1.2rem",
    border: "1px solid #ddd",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
  },
  selected: {
    background: "var(--primary)",
    color: "#fff",
    border: "1.5px solid var(--primary)",
    boxShadow: "0 2px 8px rgba(255,127,62,0.15)",
    transform: "scale(1.04)",
  },
  footer: {
    marginTop: "1rem",
    borderTop: "1px solid #f2f2f2",
    paddingTop: "0.8rem",
    fontSize: "0.9rem",
    letterSpacing: "0.2px",
  },
};
