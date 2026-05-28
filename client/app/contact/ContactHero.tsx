import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function InfoCard({ icon, label, children }: InfoCardProps) {
  return (
    <div className="info-card">
      <div className="info-icon">{icon}</div>
      <div>
        <p className="info-label">{label}</p>
        <p className="info-text">{children}</p>
      </div>
    </div>
  );
}

export function ContactHero() {
  return (
    <div className="hero-left">
      {/* Atmospheric background */}
      <div className="hero-bg-image" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      <p className="breadcrumb">
        HOME / <span>CONTACT</span>
      </p>

      <h1 className="hero-headline">
        <span className="line-white">CONNECT.</span>
        <span className="line-gold">COLLABORATE.</span>
        <span className="line-gold">CREATE IMPACT.</span>
      </h1>
      <div className="headline-underline" />

      <p className="hero-subtitle">
        We&apos;re always looking to work with passionate individuals, brands,
        and communities who align with the movement.{" "}
        <a href="#">Let&apos;s build something legendary together.</a>
      </p>

      <div className="contact-info-grid">
        <InfoCard
          label="Visit Us"
          icon={
            <svg viewBox="0 0 24 24">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                stroke="#D4AF37"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          }
        >
          23 Movement Way,
          <br />
          Lagos, Nigeria
        </InfoCard>

        <InfoCard
          label="Email Us"
          icon={
            <svg viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 7 10-7" />
            </svg>
          }
        >
          info@ghettospiritent.com
          <br />
          bookings@ghettospiritent.com
        </InfoCard>

        <InfoCard
          label="Call Us"
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          }
        >
          +234 803 123 4567
          <br />
          +234 909 876 5432
        </InfoCard>

        <InfoCard
          label="Working Hours"
          icon={
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        >
          Mon – Fri: 9AM – 6PM
          <br />
          Sat: 10AM – 4PM
        </InfoCard>
      </div>
    </div>
  );
}
