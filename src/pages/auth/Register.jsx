// Registration page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { registerUser, clearAuthError } from '../../features/auth/authSlice';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '' });

  // Validates a single field and returns a helpful message, or empty string if valid
  function validateField(fieldName, value) {
    if (fieldName === 'name') {
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    }

    if (fieldName === 'email') {
      if (!value.trim()) return 'Email is required';
      if (!value.includes('@')) return 'Email must contain @ (e.g. name@example.com)';
      const afterAt = value.split('@')[1] || '';
      if (!afterAt.includes('.')) return 'Email must contain a domain like .com (e.g. name@example.com)';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
      return '';
    }

    if (fieldName === 'password') {
      if (!value) return 'Password is required';
      if (value.length < 6) return `Password must be at least 6 characters (currently ${value.length})`;
      return '';
    }

    return '';
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Only validate fields that have a validator (name, email, password)
    if (['name', 'email', 'password'].includes(name)) {
      setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());

    // Run validation on all fields before submitting, in case user never touched a field
    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);

    if (nameError || emailError || passwordError) {
      setFieldErrors({ name: nameError, email: emailError, password: passwordError });
      return;
    }

    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <ErrorMessage message={error} />

        <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
        {fieldErrors.name && <p style={{ color: '#cc0c39', fontSize: '13px', marginTop: '-8px', marginBottom: '10px' }}>{fieldErrors.name}</p>}

        <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        {fieldErrors.email && <p style={{ color: '#cc0c39', fontSize: '13px', marginTop: '-8px', marginBottom: '10px' }}>{fieldErrors.email}</p>}

        <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {fieldErrors.password && <p style={{ color: '#cc0c39', fontSize: '13px', marginTop: '-8px', marginBottom: '10px' }}>{fieldErrors.password}</p>}
        {!fieldErrors.password && <p style={{ color: '#777', fontSize: '12px', marginTop: '-8px', marginBottom: '10px' }}>Must be at least 6 characters</p>}

        <Button type="submit" fullWidth disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating account...' : 'Register'}
        </Button>

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;