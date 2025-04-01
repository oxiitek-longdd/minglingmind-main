
import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import ChatInterface from "@/components/chat/ChatInterface";
import { ThemeProvider } from "@/context/ThemeContext";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {isAuthenticated ? (
          <ChatInterface onLogout={handleLogout} />
        ) : (
          <div className="min-h-screen flex items-center justify-center p-4">
            <AuthForm onSuccess={handleAuthSuccess} />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
