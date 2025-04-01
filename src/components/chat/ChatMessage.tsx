
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clipboard, CheckCheck, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ShareButton from "./ShareButton";

export type MessageType = "user" | "ai";
export type DomainType = "business" | "programming" | "data" | "general";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  domain?: DomainType;
  attachments?: Array<{
    type: "image" | "file";
    url: string;
    name: string;
  }>;
}

interface ChatMessageProps {
  message: Message;
  onDelete: (id: string) => void;
}

const domainColors = {
  business: "text-blue-400",
  programming: "text-purple-400",
  data: "text-amber-400",
  general: "text-gray-400"
};

const ChatMessage = ({ message, onDelete }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={cn(
        "flex items-start gap-3 py-4 px-4 group animate-slide-in",
        message.type === "user" ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {message.type === "ai" && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          AI
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%] relative",
        message.type === "user" ? "items-end" : "items-start"
      )}>
        {message.domain && message.type === "ai" && (
          <div className={cn("text-xs mb-1", domainColors[message.domain])}>
            {message.domain.charAt(0).toUpperCase() + message.domain.slice(1)}
          </div>
        )}
        
        <div className={cn(
          "message-bubble",
          message.type === "user" ? "user-message" : "ai-message",
          "whitespace-pre-wrap"
        )}>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="rounded-md overflow-hidden">
                  {attachment.type === "image" ? (
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="max-w-full h-auto max-h-60 object-contain"
                    />
                  ) : (
                    <div className="flex items-center p-2 bg-background/50 rounded gap-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                      <span className="text-sm truncate">{attachment.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {message.content}
        </div>
        
        <AnimatePresence>
          {showActions && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className={cn(
                "flex gap-1 mt-1",
                message.type === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={handleCopy}
              >
                {copied ? <CheckCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              </Button>
              <ShareButton messageContent={message.content} />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-destructive hover:text-destructive" 
                onClick={() => onDelete(message.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {message.type === "user" && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground">
          U
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
