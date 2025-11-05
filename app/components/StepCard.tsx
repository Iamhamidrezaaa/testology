import { UserPathStepWithDetail } from '@/types'

interface StepCardProps {
  step: UserPathStepWithDetail
  onComplete: (stepId: string) => void
  disabled?: boolean
}

export default function StepCard({ step, onComplete, disabled = false }: StepCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'تکمیل شده'
      case 'IN_PROGRESS':
        return 'در حال انجام'
      default:
        return 'قفل شده'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{step.pathStep.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(step.status)}`}>
          {getStatusText(step.status)}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{step.pathStep.description}</p>
      {step.status === 'IN_PROGRESS' && (
        <button
          onClick={() => onComplete(step.id)}
          disabled={disabled}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {disabled ? 'در حال بررسی...' : 'تکمیل مرحله'}
        </button>
      )}
    </div>
  )
} 