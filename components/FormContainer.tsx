import { ReactNode } from 'react'

interface FormContainerProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export default function FormContainer({
  children,
  title,
  subtitle,
  className = '',
}: FormContainerProps) {
  return (
    <div className={`form-container ${className}`}>
      {title && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
} 