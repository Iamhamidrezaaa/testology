"use client";
import { useEffect, useState } from "react";
import Card from "../shared/Card";
import Image from "next/image";

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  address: string;
  phone: string;
  rating: number;
  experience: string;
  image: string;
}

interface TherapistData {
  therapist: Therapist;
  alternatives: Therapist[];
}

export default function NearestTherapist() {
  const [data, setData] = useState<TherapistData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const res = await fetch("/api/user/nearest-therapist");
        const data = await res.json();
        
        if (res.ok) {
          setData(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("خطا در دریافت اطلاعات مشاور");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, []);

  if (loading) {
    return (
      <Card title="🧑‍⚕️ مشاور نزدیک شما">
        <p>در حال جستجو...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="🧑‍⚕️ مشاور نزدیک شما">
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card title="🧑‍⚕️ مشاور نزدیک شما">
      <div className="space-y-6">
        {/* مشاور اصلی */}
        <div className="flex items-start space-x-4 rtl:space-x-reverse">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={data.therapist.image}
              alt={data.therapist.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{data.therapist.name}</h3>
            <p className="text-gray-600">{data.therapist.specialization}</p>
            <p className="text-sm text-gray-500">{data.therapist.experience} تجربه</p>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500">★</span>
              <span className="mr-1">{data.therapist.rating}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold">آدرس:</span> {data.therapist.address}
          </p>
          <p className="text-sm">
            <span className="font-semibold">تلفن:</span> {data.therapist.phone}
          </p>
        </div>

        {/* مشاوران جایگزین */}
        {data.alternatives.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">مشاوران جایگزین:</h4>
            <div className="space-y-3">
              {data.alternatives.map((therapist) => (
                <div key={therapist.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={therapist.image}
                      alt={therapist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{therapist.name}</p>
                    <p className="text-sm text-gray-600">{therapist.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 