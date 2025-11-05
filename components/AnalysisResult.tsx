import React from 'react'

export interface AnalysisResultProps {
  result: {
    score: number
    level: string
    description: string
    recommendations: string[]
  }
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '2rem'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        نتیجه تحلیل
      </h2>

      <div style={{
        marginBottom: '2rem'
      }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'var(--primary-color)',
          marginBottom: '0.5rem'
        }}>
          {result.score}
        </div>
        <div style={{
          fontSize: '1.2rem',
          textAlign: 'center',
          color: 'var(--text-light)'
        }}>
          {result.level}
        </div>
      </div>

      <div style={{
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          توضیحات
        </h3>
        <p style={{
          lineHeight: '1.6',
          color: 'var(--text-dark)'
        }}>
          {result.description}
        </p>
      </div>

      {result.recommendations.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            توصیه‌ها
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0
          }}>
            {result.recommendations.map((recommendation, index) => (
              <li
                key={index}
                style={{
                  padding: '0.75rem',
                  background: 'var(--background-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{
                  color: 'var(--primary-color)',
                  fontSize: '1.2rem'
                }}>
                  •
                </span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 