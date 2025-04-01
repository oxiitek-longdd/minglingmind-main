import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Image, X } from "lucide-react";
interface MessageInputProps {
  onSend: (message: string, attachments: Array<{
    type: "image" | "file";
    file: File;
  }>) => void;
  disabled?: boolean;
}
const MessageInput = ({
  onSend,
  disabled = false
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Array<{
    type: "image" | "file";
    file: File;
    preview?: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleSend = () => {
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSend(message, attachments.map(({
        type,
        file
      }) => ({
        type,
        file
      })));
      setMessage("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => {
        const attachment = {
          type,
          file
        };
        if (type === "image") {
          return {
            ...attachment,
            preview: URL.createObjectURL(file)
          };
        }
        return attachment;
      });
      setAttachments(prev => [...prev, ...newFiles]);
      e.target.value = ""; // Reset file input
    }
  };
  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      // Clean up URL if it's an image preview
      if (newAttachments[index].preview) {
        URL.revokeObjectURL(newAttachments[index].preview!);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };
  return <div className="px-4">
      {attachments.length > 0 && <div className="flex gap-2 mb-3 flex-wrap">
          {attachments.map((attachment, index) => <div key={index} className="relative group">
              {attachment.type === "image" ? <div className="relative h-20 w-20 rounded-md overflow-hidden">
                  <img src={attachment.preview} alt="attachment" className="h-full w-full object-cover" />
                  <button onClick={() => removeAttachment(index)} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-80 hover:opacity-100">
                    <X className="h-3 w-3" />
                  </button>
                </div> : <div className="bg-secondary/50 rounded-md p-2 pr-8 text-sm flex items-center">
                  <Paperclip className="h-4 w-4 mr-2" />
                  <span className="truncate max-w-[120px]">
                    {attachment.file.name}
                  </span>
                  <button onClick={() => removeAttachment(index)} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-80 hover:opacity-100">
                    <X className="h-3 w-3" />
                  </button>
                </div>}
            </div>)}
        </div>}

      <div className="flex items-end gap-2 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-border/20 bg-zinc-800">
        <div className="flex-1 relative">
          <Textarea ref={textareaRef} placeholder="Nhập tin nhắn của bạn..." value={message} onChange={handleTextareaChange} onKeyDown={handleKeyDown} className="min-h-[56px] max-h-[150px] pr-20 resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2" disabled={disabled} />
          <div className="absolute right-2 bottom-2 flex gap-1">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => imageInputRef.current?.click()} disabled={disabled}>
              <Image className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={handleSend} size="icon" className="rounded-full h-10 w-10" disabled={disabled || message.trim() === "" && attachments.length === 0}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      <input type="file" ref={fileInputRef} onChange={e => handleFileChange(e, "file")} className="hidden" accept=".pdf,.doc,.docx,.txt,.csv" multiple />
      
      <input type="file" ref={imageInputRef} onChange={e => handleFileChange(e, "image")} className="hidden" accept="image/*" multiple />
    </div>;
};
export default MessageInput;