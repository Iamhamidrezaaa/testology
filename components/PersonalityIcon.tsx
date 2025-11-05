'use client'

import { motion } from 'framer-motion'

interface PersonalityIconProps {
  icon: string
  label: string
  color: string
  description: string
}

export default function PersonalityIcon({ icon, label, color, description }: PersonalityIconProps) {
  return (
    <motion.div
      className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`text-4xl mb-2`}>{icon}</div>
      <h3 className="font-bold text-lg mb-1">{label}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </motion.div>
  )
} 