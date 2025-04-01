
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  messageContent: string;
}

const ShareButton = ({ messageContent }: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Chia sẻ từ MinglingMind AI",
          text: messageContent,
        });
      } else {
        await navigator.clipboard.writeText(messageContent);
        toast({
          title: "Đã sao chép",
          description: "Nội dung đã được sao chép vào clipboard",
        });
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
      toast({
        title: "Không thể chia sẻ",
        description: "Đã xảy ra lỗi khi cố gắng chia sẻ nội dung này",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-7 w-7" 
      onClick={handleShare}
    >
      <Share className="h-4 w-4" />
    </Button>
  );
};

export default ShareButton;
