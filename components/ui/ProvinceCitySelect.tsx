"use client"

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import EnhancedSelect from './EnhancedSelect'

interface Province {
  id: string
  name: string
}

interface City {
  id: string
  name: string
  provinceId: string
}

interface ProvinceCitySelectProps {
  selectedProvince: string
  selectedCity: string
  onProvinceChange: (provinceId: string) => void
  onCityChange: (cityId: string) => void
  className?: string
}

export default function ProvinceCitySelect({
  selectedProvince,
  selectedCity,
  onProvinceChange,
  onCityChange,
  className = ""
}: ProvinceCitySelectProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      fetchCities(selectedProvince)
    } else {
      setCities([])
    }
  }, [selectedProvince])

  const fetchProvinces = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/provinces')
      const data = await response.json()
      
      if (data.success) {
        setProvinces(data.provinces)
      }
    } catch (error) {
      console.error('Error fetching provinces:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCities = async (provinceId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cities?provinceId=${provinceId}`)
      const data = await response.json()
      
      if (data.success) {
        setCities(data.cities)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    } finally {
      setLoading(false)
    }
  }

  const provinceOptions = provinces.map(province => ({
    value: province.id,
    label: province.name
  }))

  const cityOptions = cities.map(city => ({
    value: city.id,
    label: city.name
  }))

  return (
    <div className={`space-y-4 ${className}`}>
      {/* انتخاب استان */}
      <EnhancedSelect
        options={provinceOptions}
        value={selectedProvince}
        onChange={onProvinceChange}
        placeholder="انتخاب استان"
        loading={loading}
        searchable={true}
        label="استان *"
      />

      {/* انتخاب شهرستان */}
      <EnhancedSelect
        options={cityOptions}
        value={selectedCity}
        onChange={onCityChange}
        placeholder="انتخاب شهرستان"
        disabled={!selectedProvince}
        loading={loading}
        searchable={true}
        label="شهرستان *"
      />
    </div>
  )
}
