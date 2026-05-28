import React from "react";
import { ContactHero } from "./ContactHero";
import { ContactForm } from "./ContactForm";
import { ContactFooter } from "../../components/ContactFooter";
import "./contact.css";

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="hero-section">
        <ContactHero />
        <ContactForm />
      </section>
      <ContactFooter />
    </main>
  );
}
