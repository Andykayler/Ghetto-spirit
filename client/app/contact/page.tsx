// app/contact/page.tsx

import React from "react";
import Navbar from "../../components/Navbar";
import { ContactHero } from "./ContactHero";
import { ContactForm } from "./ContactForm";
import { ContactFooter } from "../../components/ContactFooter";
import "./contact.css";

export default function ContactPage() {
  return (
    <main className="contact-page">
      <Navbar />

      <section className="hero-section">
        <ContactHero />
        <ContactForm />
      </section>

      <ContactFooter />
    </main>
  );
}