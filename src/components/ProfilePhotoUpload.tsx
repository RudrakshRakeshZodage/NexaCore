
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePhotoUploadProps {
  onPhotoChange: (photoUrl: string) => void;
  initialPhoto?: string;
}

const ProfilePhotoUpload = ({ onPhotoChange, initialPhoto }: ProfilePhotoUploadProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoUrl(result);
      onPhotoChange(result);
      
      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully",
      });
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="h-32 w-32 rounded-full bg-nexacore-teal/20 flex items-center justify-center mb-4 overflow-hidden">
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt="Profile" 
            className="h-full w-full object-cover" 
          />
        ) : (
          <User className="h-16 w-16 text-nexacore-teal" />
        )}
      </div>
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleFileChange}
      />
      <Button
        variant="outline" 
        className="border-white/20 text-white hover:bg-white/10"
        onClick={handleButtonClick}
      >
        <Upload size={16} className="mr-2" />
        Change Photo
      </Button>
    </div>
  );
};

export default ProfilePhotoUpload;
