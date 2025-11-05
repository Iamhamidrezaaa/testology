import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = {
    fontFamily: 'Vazirmatn, sans-serif',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
  }

  const variants = {
    primary: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      boxShadow: 'var(--shadow-sm)',
      '&:hover': {
        backgroundColor: '#0052a3',
      },
    },
    secondary: {
      backgroundColor: 'var(--secondary-color)',
      color: 'white',
      boxShadow: 'var(--shadow-sm)',
      '&:hover': {
        backgroundColor: '#008080',
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary-color)',
      border: '2px solid var(--primary-color)',
      '&:hover': {
        backgroundColor: 'var(--primary-light)',
      },
    },
  }

  const sizes = {
    small: {
      padding: '0.4rem 1rem',
      fontSize: '0.9rem',
    },
    medium: {
      padding: '0.6rem 1.8rem',
      fontSize: '1rem',
    },
    large: {
      padding: '0.8rem 2.4rem',
      fontSize: '1.1rem',
    },
  }

  const style = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
  }

  return (
    <button
      style={style}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
} 