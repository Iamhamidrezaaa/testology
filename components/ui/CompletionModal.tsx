"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTests: number;
  totalTests: number;
}

export default function CompletionModal({ 
  isOpen, 
  onClose, 
  completedTests, 
  totalTests 
}: CompletionModalProps) {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && completedTests >= totalTests) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, completedTests, totalTests, router]);

  if (!isOpen || completedTests < totalTests) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Card className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-8 text-center">
              {/* انیمیشن تبریک */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-500 mx-auto" />
                </motion.div>
              </motion.div>

              {/* متن تبریک */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  🎉 تبریک!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  همه تست‌های پیشنهادی را با موفقیت تکمیل کردید
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  در حال انتقال به داشبورد...
                </p>
              </motion.div>

              {/* Countdown */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                  {countdown}
                </div>
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  مشاهده نتایج
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}




