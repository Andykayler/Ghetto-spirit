"use client";

import React, { useState } from "react";

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  subscribe: boolean;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    subscribe: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: wire up to your API / email service
  };

  return (
    <div className="hero-right">
      <div className="form-panel">
        <h2 className="form-title">Send Us a Message</h2>
        <div className="form-title-underline" />

        {/* Name + Email row */}
        <div className="form-row">
          <input
            className="contact-input"
            type="text"
            name="fullName"
            placeholder="FULL NAME"
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            className="contact-input"
            type="email"
            name="email"
            placeholder="EMAIL ADDRESS"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Subject */}
        <div className="form-field">
          <input
            className="contact-input"
            type="text"
            name="subject"
            placeholder="SUBJECT"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>

        {/* Message */}
        <div className="form-field">
          <textarea
            className="contact-textarea"
            name="message"
            placeholder="MESSAGE"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        {/* Newsletter checkbox */}
        <div className="checkbox-row">
          <input
            className="contact-checkbox"
            type="checkbox"
            id="subscribe"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
          />
          <label className="checkbox-label" htmlFor="subscribe">
            I&apos;d like to receive updates and news from Ghetto Spirit ENT.
          </label>
        </div>

        <button className="send-btn" onClick={handleSubmit}>
          SEND MESSAGE
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Ghost watermark */}
        <div className="form-watermark" aria-hidden="true">
          RESPECT
          <br />
          THE CULTURE.
          <br />
          REP THE MOVEMENT.
        </div>
      </div>
    </div>
  );
}
