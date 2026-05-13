"use client";

import { FormEvent, useState } from "react";
import site from "@/content/site.json";

type SubmitState = "idle" | "submitting" | "success" | "error";

const callFallbackMessage =
  "The quote form is not connected yet. Please call Divergent Solutions directly while we finish lead intake setup.";

export function QuoteRequestForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      projectAddress: String(formData.get("projectAddress") ?? ""),
      city: String(formData.get("city") ?? ""),
      customerType: String(formData.get("customerType") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      propertyType: String(formData.get("propertyType") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      bestTimeToCall: String(formData.get("bestTimeToCall") ?? ""),
      projectNotes: String(formData.get("projectNotes") ?? ""),
      photoNames: formData
        .getAll("photos")
        .map((file) => (file instanceof File ? file.name : String(file))),
    };

    let response: Response;

    try {
      response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setState("error");
      setMessage(callFallbackMessage);
      return;
    }

    if (response.ok) {
      setState("success");
      setMessage(site.quote.confirmationMessage);
      event.currentTarget.reset();
      return;
    }

    setState("error");
    setMessage(
      response.status === 503 || response.status === 502
        ? callFallbackMessage
        : "Please check the required fields and try again."
    );
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Phone
          <input name="phone" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Project address
          <input name="projectAddress" required />
        </label>
        <label>
          City / service area
          <select name="city" required defaultValue="">
            <option value="" disabled>
              Select a city
            </option>
            {site.serviceArea.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label>
          Customer type
          <select name="customerType" required defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option>Homeowner</option>
            <option>Builder / GC</option>
            <option>Property manager</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Project type
          <select name="projectType" required defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            {site.services.map((service) => (
              <option key={service.title}>{service.title}</option>
            ))}
            <option>Other</option>
          </select>
        </label>
        <label>
          Property type
          <select name="propertyType" defaultValue="">
            <option value="">Select one</option>
            <option>Existing home</option>
            <option>New construction</option>
            <option>Commercial / light commercial</option>
          </select>
        </label>
        <label>
          Timeline
          <select name="timeline" defaultValue="">
            <option value="">Select one</option>
            <option>ASAP</option>
            <option>Within 30 days</option>
            <option>1-3 months</option>
            <option>Planning ahead</option>
          </select>
        </label>
        <label>
          Best time to call
          <input name="bestTimeToCall" />
        </label>
      </div>
      <label>
        Project notes
        <textarea name="projectNotes" required rows={5} />
      </label>
      <label>
        Photos
        <input name="photos" type="file" multiple accept="image/*" />
        <span className="field-help">Photos help us understand the project before we call.</span>
      </label>
      <button className="button primary" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Submitting..." : site.quote.submitText}
      </button>
      {message ? <p className={`form-message ${state}`}>{message}</p> : null}
    </form>
  );
}
