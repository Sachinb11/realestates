import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { leadAPI } from '../../utils/api';
import styles from './InquiryForm.module.css';

export default function InquiryForm({ property, type = 'inquiry', onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...data,
        type,
        propertyId: property?._id,
        propertyTitle: property?.title
      };

      if (type === 'site-visit') {
        await leadAPI.bookVisit(payload);
      } else {
        await leadAPI.submitInquiry(payload);
      }

      setSubmitted(true);
      reset();
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h3>Thank You!</h3>
        <p>{type === 'site-visit' ? 'Your site visit has been booked. We will confirm shortly.' : 'Your inquiry has been received. Our team will contact you soon.'}</p>
        <button className="btn btn-outline" onClick={() => setSubmitted(false)} style={{marginTop:16}}>
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input
          className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder="Your full name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <span className={styles.errMsg}>{errors.name.message}</span>}
      </div>

      <div className={styles.row}>
        <div className="form-group" style={{flex:1}}>
          <label className="form-label">Phone *</label>
          <input
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="10-digit mobile number"
            type="tel"
            maxLength={10}
            {...register('phone', {
              required: 'Phone is required',
              pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' }
            })}
          />
          {errors.phone && <span className={styles.errMsg}>{errors.phone.message}</span>}
        </div>

        <div className="form-group" style={{flex:1}}>
          <label className="form-label">Email</label>
          <input
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="your@email.com"
            type="email"
            {...register('email', {
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
            })}
          />
          {errors.email && <span className={styles.errMsg}>{errors.email.message}</span>}
        </div>
      </div>

      {type === 'site-visit' && (
        <div className={styles.row}>
          <div className="form-group" style={{flex:1}}>
            <label className="form-label">Preferred Date *</label>
            <input
              className={`form-input ${errors.visitDate ? 'error' : ''}`}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register('visitDate', { required: 'Visit date is required' })}
            />
            {errors.visitDate && <span className={styles.errMsg}>{errors.visitDate.message}</span>}
          </div>
          <div className="form-group" style={{flex:1}}>
            <label className="form-label">Preferred Time *</label>
            <select
              className={`form-input ${errors.visitTime ? 'error' : ''}`}
              {...register('visitTime', { required: 'Visit time is required' })}
            >
              <option value="">Select Time</option>
              {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.visitTime && <span className={styles.errMsg}>{errors.visitTime.message}</span>}
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea
          className="form-input"
          rows={3}
          placeholder={type === 'site-visit' ? 'Any special requirements for the visit?' : 'Tell us what you are looking for...'}
          style={{ resize: 'vertical' }}
          {...register('message')}
        />
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
        {loading ? (
          <><span className={styles.spinner}></span> Submitting...</>
        ) : type === 'site-visit' ? (
          '📅 Book Site Visit'
        ) : (
          '📩 Send Inquiry'
        )}
      </button>

      <p className={styles.disclaimer}>
        By submitting, you agree to be contacted by Bhagat Estates regarding this property.
      </p>
    </form>
  );
}
