import { useState } from 'react';
import Button from './Button.jsx';

const initialFormData = {
  name: '',
  email: '',
  message: ''
};

const initialTouched = {
  name: false,
  email: false,
  message: false
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
}

export default function ContactForm({ onSuccess }) {
  const [formData, setFormData] = useState(initialFormData);
  const [touched, setTouched] = useState(initialTouched);
  const errors = validate(formData);
  const hasErrors = Object.keys(errors).length > 0;

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((currentTouched) => ({ ...currentTouched, [name]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (hasErrors) {
      return;
    }

    onSuccess(`Thanks ${formData.name}! Your message has been submitted.`);
    setFormData(initialFormData);
    setTouched(initialTouched);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your name"
            required
          />
          {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            required
          />
          {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
        </label>
      </div>

      <label>
        Message
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Tell me about your project"
          required
          rows="5"
        />
        {touched.message && errors.message && <span className="field-error">{errors.message}</span>}
      </label>

      <Button type="submit" disabled={hasErrors}>
        Send Message
      </Button>
    </form>
  );
}
