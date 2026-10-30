import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormData } from '../../schemas/contactSchema';
import { inquiryService } from '../../services/inquiryService';
import { Button } from '../common/Button';
import { CheckCircle2, AlertCircle, Sparkles, Send, RefreshCw } from 'lucide-react';

interface ContactFormProps {
  initialProductId?: string;
  initialProductName?: string;
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  initialProductId,
  initialProductName,
  onSuccess,
}) => {
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submittedName, setSubmittedName] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  const defaultSubject = initialProductName
    ? `Bespoke Inquiry: ${initialProductName}`
    : '';

  const defaultMessage = initialProductName
    ? `I would like to inquire regarding "${initialProductName}" and discuss bespoke commission details or arrange a private viewing.`
    : '';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      subject: defaultSubject,
      message: defaultMessage,
      phone: '',
      preferredKarat: '22K',
      productId: initialProductId || '',
    },
  });

  const messageValue = watch('message') || '';

  const onSubmit = async (data: ContactFormData) => {
    setApiError(null);
    try {
      await inquiryService.submitInquiry({
        fullName: data.fullName,
        email: data.email,
        subject: data.subject,
        message: data.message,
        phone: data.phone || undefined,
        preferredKarat: data.preferredKarat || undefined,
        productId: data.productId || undefined,
      });

      setSubmittedName(data.fullName);
      setSubmissionSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      // Preserve inputs, display clear failure message without false success
      const failureMessage =
        err?.message ||
        'The atelier concierge server is temporarily unavailable. Your entered details have been preserved. Please reattempt submission.';
      setApiError(failureMessage);
    }
  };

  const handleResetForm = () => {
    reset({
      fullName: '',
      email: '',
      subject: '',
      message: '',
      phone: '',
      preferredKarat: '22K',
      productId: '',
    });
    setSubmissionSuccess(false);
    setApiError(null);
  };

  if (submissionSuccess) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="atelier-card"
        style={{
          padding: '4rem 2.5rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-obsidian-card)',
          border: '1px solid var(--color-champagne)',
          boxShadow: 'var(--shadow-gold-hover)',
        }}
      >
        <div
          style={{
            color: '#34d399',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CheckCircle2 size={54} strokeWidth={1.5} />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.9rem',
            color: 'var(--color-ivory)',
            marginBottom: '0.75rem',
          }}
        >
          Inquiry Successfully Transmitted
        </h3>

        <p
          className="text-subtle-serif"
          style={{
            maxWidth: '520px',
            margin: '0 auto 2rem',
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: 'var(--color-ivory-muted)',
          }}
        >
          Thank you, <strong style={{ color: 'var(--color-champagne-light)' }}>{submittedName}</strong>. Your consultation inquiry has been securely logged with our Place Vendôme concierge desk. An atelier representative will reply directly within two business hours.
        </p>

        <Button
          variant="outline"
          size="md"
          onClick={handleResetForm}
          icon={<RefreshCw size={15} />}
        >
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="atelier-card"
      style={{
        padding: '3rem 2.5rem',
        backgroundColor: 'var(--color-obsidian-card)',
        border: '1px solid var(--color-obsidian-border)',
        boxShadow: 'var(--shadow-md)',
      }}
      aria-label="Private Salon Consultation Form"
    >
      <div style={{ marginBottom: '2.5rem' }}>
        <span
          className="eyebrow-badge"
          style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.72rem' }}
        >
          DIRECT VIP ENGAGEMENT
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.85rem',
            color: 'var(--color-ivory)',
            marginBottom: '0.5rem',
          }}
        >
          Arrange Private Consultation
        </h3>
        <p style={{ color: 'var(--color-ivory-dim)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
          Inquire regarding catalog masterpieces, bespoke commissions, or private viewing salon appointments.
        </p>
      </div>

      {/* Failure Message Notice Banner (if API fails, inputs are preserved) */}
      {apiError && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: '1.15rem 1.25rem',
            backgroundColor: 'rgba(185, 74, 72, 0.15)',
            border: '1px solid rgba(185, 74, 72, 0.45)',
            borderRadius: 'var(--radius-xs)',
            color: '#fca5a5',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', color: '#fecaca', marginBottom: '0.2rem' }}>
              Submission Notice:
            </strong>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Row 1: Full Name & Email (both required) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Full Name Field */}
        <div>
          <label
            htmlFor="fullName"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-ivory-dim)',
              marginBottom: '0.5rem',
              fontWeight: 600,
            }}
          >
            Full Name <span style={{ color: 'var(--color-champagne)' }}>*</span>
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            placeholder="e.g. Lady Vivienne Montgomery"
            className="form-input"
            style={{
              borderColor: errors.fullName ? '#ef4444' : undefined,
            }}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              role="alert"
              style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.4rem', margin: '0.4rem 0 0' }}
            >
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Address Field */}
        <div>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-ivory-dim)',
              marginBottom: '0.5rem',
              fontWeight: 600,
            }}
          >
            Email Address <span style={{ color: 'var(--color-champagne)' }}>*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="e.g. client@domain.com"
            className="form-input"
            style={{
              borderColor: errors.email ? '#ef4444' : undefined,
            }}
            {...register('email')}
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.4rem', margin: '0.4rem 0 0' }}
            >
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Subject (required) & Phone (optional) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Subject Field */}
        <div>
          <label
            htmlFor="subject"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-ivory-dim)',
              marginBottom: '0.5rem',
              fontWeight: 600,
            }}
          >
            Subject <span style={{ color: 'var(--color-champagne)' }}>*</span>
          </label>
          <input
            id="subject"
            type="text"
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            placeholder="e.g. Bespoke 22K Signet Ring Commission"
            className="form-input"
            style={{
              borderColor: errors.subject ? '#ef4444' : undefined,
            }}
            {...register('subject')}
          />
          {errors.subject && (
            <p
              id="subject-error"
              role="alert"
              style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.4rem', margin: '0.4rem 0 0' }}
            >
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Optional Phone Field */}
        <div>
          <label
            htmlFor="phone"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-ivory-dim)',
              marginBottom: '0.5rem',
              fontWeight: 600,
            }}
          >
            Phone Number <span style={{ fontSize: '0.7rem', color: 'var(--color-ivory-dim)', fontWeight: 400 }}>(Optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            disabled={isSubmitting}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            placeholder="+1 (800) 555-GOLD"
            className="form-input"
            style={{
              borderColor: errors.phone ? '#ef4444' : undefined,
            }}
            {...register('phone')}
          />
          {errors.phone && (
            <p
              id="phone-error"
              role="alert"
              style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.4rem', margin: '0.4rem 0 0' }}
            >
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 3: Message with Character Limits (10 to 2000 chars) */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label
            htmlFor="message"
            style={{
              display: 'block',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-ivory-dim)',
              fontWeight: 600,
            }}
          >
            Inquiry Message <span style={{ color: 'var(--color-champagne)' }}>*</span>
          </label>
          <span
            style={{
              fontSize: '0.72rem',
              color: messageValue.length > 2000 ? '#ef4444' : 'var(--color-ivory-dim)',
            }}
          >
            {messageValue.length} / 2000
          </span>
        </div>

        <textarea
          id="message"
          rows={5}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          placeholder="Please describe your interest: desired karat purity, bespoke sizing, gemstones, salon appointment date, or specific creation reference..."
          className="form-textarea"
          style={{
            borderColor: errors.message ? '#ef4444' : undefined,
            resize: 'vertical',
          }}
          {...register('message')}
        />
        {errors.message && (
          <p
            id="message-error"
            role="alert"
            style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.4rem', margin: '0.4rem 0 0' }}
          >
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button with Loading State & Double-Click Prevention */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        icon={!isSubmitting ? <Send size={16} /> : undefined}
        style={{ width: '100%' }}
      >
        {isSubmitting ? 'Transmitting to Concierge...' : 'Dispatch Consultation Request'}
      </Button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.25rem',
          fontSize: '0.75rem',
          color: 'var(--color-ivory-dim)',
        }}
      >
        <Sparkles size={13} style={{ color: 'var(--color-champagne)' }} />
        <span>Strict confidentiality assured • All communications encrypted</span>
      </div>
    </form>
  );
};
