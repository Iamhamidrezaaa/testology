"use client";

import { LoginModalProvider } from "@/contexts/LoginModalContext";
import LoginModal from "@/components/LoginModal";

export function LoginModalWrapper() {
  return (
    <LoginModalProvider>
      <LoginModal />
    </LoginModalProvider>
  );
}

export default LoginModalWrapper; 