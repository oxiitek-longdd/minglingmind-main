import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, X, PlusSquare, ChevronDown } from "lucide-react";
import ChatMessage, { Message, DomainType } from "./ChatMessage";
import MessageInput from "./MessageInput";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
interface ChatInterfaceProps {
  onLogout: () => void;
}
const sampleResponses: Record<DomainType | "general", string> = {
  business: "Dựa trên phân tích dữ liệu, xu hướng thị trường đang có sự chuyển dịch. Báo cáo doanh thu Q2 cho thấy tăng trưởng 15% so với cùng kỳ năm ngoái, với sự đóng góp chính từ phân khúc khách hàng mới. Tôi khuyến nghị tập trung vào chiến lược tiếp thị số hóa và đa dạng hóa kênh bán hàng để tối ưu kết quả trong quý tới.",
  programming: "```javascript\nconst optimizeCode = (code) => {\n  // Phát hiện vấn đề: vòng lặp không hiệu quả\n  // Thay thế bằng phương thức map()\n  return code.split('\\n')\n    .map(line => line.trim())\n    .filter(line => line.length > 0)\n    .join('\\n');\n};\n\n// Giải thích: Phương pháp này tối ưu hơn vì\n// - Tránh được vòng lặp lồng nhau\n// - Sử dụng các phương thức chuỗi có sẵn\n// - Dễ đọc và bảo trì hơn\n```",
  data: "Kết quả phân tích dữ liệu từ tệp CSV của bạn cho thấy:\n\n1. Phân bố dữ liệu có độ lệch phải (right-skewed)\n2. Giá trị trung bình: 45.72\n3. Độ lệch chuẩn: 12.38\n4. Giá trị ngoại lai chiếm 3.5% mẫu\n\nMẫu truy vấn SQL tối ưu:\n```sql\nSELECT \n  category, \n  AVG(value) as mean_value,\n  COUNT(*) as sample_size\nFROM dataset\nWHERE timestamp > '2023-01-01'\nGROUP BY category\nHAVING COUNT(*) > 100\nORDER BY mean_value DESC;\n```",
  general: "Tôi có thể giúp bạn trả lời câu hỏi này. Dựa trên thông tin hiện có, có một số điểm cần lưu ý. Thứ nhất, vấn đề này có nhiều khía cạnh cần được xem xét. Thứ hai, có những yếu tố chính ảnh hưởng đến kết quả cuối cùng. Nếu bạn cần thêm thông tin chi tiết, hãy cho tôi biết để tôi có thể đưa ra phân tích sâu hơn về vấn đề này."
};

// Demo user data
const user = {
  name: "Người dùng",
  avatar: null
};
const ChatInterface = ({
  onLogout
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<DomainType | "general">("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  const handleSendMessage = async (content: string, attachments?: Array<{
    type: "image" | "file";
    file: File;
  }>) => {
    // Create formatted attachments for display
    const formattedAttachments = attachments?.map(attachment => ({
      type: attachment.type,
      url: URL.createObjectURL(attachment.file),
      name: attachment.file.name
    }));

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      type: "user",
      content,
      timestamp: new Date(),
      attachments: formattedAttachments
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add AI response
      const aiMessage: Message = {
        id: uuidv4(),
        type: "ai",
        content: sampleResponses[currentDomain],
        timestamp: new Date(),
        domain: currentDomain !== "general" ? currentDomain : undefined
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xử lý tin nhắn của bạn. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDeleteMessage = (id: string) => {
    setMessages(prev => {
      const messageIndex = prev.findIndex(msg => msg.id === id);

      // If it's a user message, also remove the corresponding AI response
      if (messageIndex !== -1 && prev[messageIndex].type === "user" && prev[messageIndex + 1]?.type === "ai") {
        const newMessages = [...prev];
        newMessages.splice(messageIndex, 2);
        return newMessages;
      }

      // Otherwise just remove the single message
      return prev.filter(msg => msg.id !== id);
    });
  };
  const startNewChat = () => {
    setMessages([]);
    setIsMobileMenuOpen(false);
  };
  return <div className="flex h-screen overflow-hidden">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b border-border/40 flex items-center justify-between px-4 h-14">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Select value={currentDomain} onValueChange={(value: any) => setCurrentDomain(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Lĩnh vực" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Chung</SelectItem>
              <SelectItem value="business">Doanh nghiệp</SelectItem>
              <SelectItem value="programming">Lập trình</SelectItem>
              <SelectItem value="data">Phân tích dữ liệu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sidebar */}
      <div className={cn("lg:relative fixed top-0 left-0 z-40 w-64 h-full bg-card/50 backdrop-blur-sm border-r border-border/40 transition-transform duration-300 flex flex-col", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="p-4 border-b border-border/40 flex items-center justify-between">
          <h1 className="font-semibold text-lg">MinglingMind AI</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={startNewChat}>
            <PlusSquare className="h-4 w-4" />
            Trò chuyện mới
          </Button>
          
          {/* Chat history would go here */}
          <div className="py-2 text-xs text-muted-foreground text-center">
            Lịch sử trò chuyện sẽ hiển thị ở đây
          </div>
        </div>

        <div className="p-3 border-t border-border/40">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent group cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
              {user.avatar ? <img src={user.avatar} alt="User" className="h-full w-full rounded-full object-cover" /> : <span className="text-sm">{user.name.charAt(0)}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={onLogout}>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full lg:pt-0 pt-14">
        {/* Desktop domain selector */}
        <div className="hidden lg:flex items-center border-b border-border/40 p-3 gap-4 justify-between">
          <div className="flex items-center gap-4">
            <Select value={currentDomain} onValueChange={(value: any) => setCurrentDomain(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Lĩnh vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Chung</SelectItem>
                <SelectItem value="business">Doanh nghiệp</SelectItem>
                <SelectItem value="programming">Lập trình</SelectItem>
                <SelectItem value="data">Phân tích dữ liệu</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              Chọn lĩnh vực để nhận phản hồi chuyên biệt
            </div>
          </div>
          <ThemeToggle />
        </div>
        
        {/* Chat messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto pb-2 px-2 md:px-4">
          {messages.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <h2 className="text-2xl font-bold mb-2">MinglingMind AI</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Trợ lý AI có khả năng xử lý đa dạng nội dung và hỗ trợ chuyên sâu trong nhiều lĩnh vực
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                <div className="p-4 rounded-lg backdrop-blur-sm border border-border/30 bg-zinc-800">
                  <h3 className="font-medium mb-2">Doanh nghiệp</h3>
                  <p className="text-sm text-muted-foreground">
                    Phân tích dữ liệu kinh doanh, viết báo cáo, lập kế hoạch
                  </p>
                </div>
                <div className="p-4 rounded-lg backdrop-blur-sm border border-border/30 bg-zinc-800">
                  <h3 className="font-medium mb-2">Lập trình</h3>
                  <p className="text-sm text-muted-foreground">
                    Giải thích mã nguồn, debug, tối ưu code
                  </p>
                </div>
                <div className="p-4 rounded-lg backdrop-blur-sm border border-border/30 bg-zinc-800">
                  <h3 className="font-medium mb-2">Phân tích dữ liệu</h3>
                  <p className="text-sm text-muted-foreground">
                    Xử lý, phân tích dữ liệu, truy vấn SQL
                  </p>
                </div>
              </div>
            </div> : <div className="space-y-0.5 my-4">
              {messages.map(message => <ChatMessage key={message.id} message={message} onDelete={handleDeleteMessage} />)}
              
              {isProcessing && <div className="flex items-start gap-3 py-4 px-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    AI
                  </div>
                  <div className="bg-secondary/80 py-3 px-4 rounded-lg animate-pulse flex items-center gap-1">
                    <div className="typing-indicator"></div>
                    <div className="typing-indicator"></div>
                    <div className="typing-indicator"></div>
                  </div>
                </div>}
              <div ref={messagesEndRef} />
            </div>}
        </div>
        
        {/* Input area - moved up for better visibility */}
        <div className="pt-2 pb-4 border-t border-border/40 sticky bottom-0 bg-background">
          <MessageInput onSend={handleSendMessage} disabled={isProcessing} />
        </div>
      </div>
    </div>;
};
export default ChatInterface;