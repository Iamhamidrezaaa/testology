"use client";
import { useState } from "react";
import Modal from "react-modal";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl relative mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      ariaHideApp={false}
    >
      <button 
        onClick={onClose} 
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex justify-center mb-6 border-b">
        <button
          className={`px-6 py-3 text-lg font-medium transition-colors ${
            tab === "login" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTab("login")}
        >
          ورود
        </button>
        <button
          className={`px-6 py-3 text-lg font-medium transition-colors ${
            tab === "register" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTab("register")}
        >
          عضویت
        </button>
      </div>

      <div className="mt-4">
        {tab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </Modal>
  );
} 