
import React from 'react';
import { Mail, Shield, Calendar, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface EmailProfileProps {
  email: string;
}

const EmailProfile: React.FC<EmailProfileProps> = ({ email }) => {
  const { toast } = useToast();

  const handleChangePassword = () => {
    toast({
      title: "Coming soon",
      description: "Password change functionality will be available soon",
      variant: "default",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-nexacore-blue-dark/50 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <Mail className="mr-2 text-nexacore-teal" size={20} />
              Email Profile
            </CardTitle>
            <CardDescription className="text-white/70">
              Manage your email account and security
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="h-12 w-12 bg-nexacore-teal/20 rounded-full flex items-center justify-center">
              <Mail className="text-nexacore-teal" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{email}</p>
              <p className="text-white/60 text-sm">Primary Email Address</p>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-lg flex items-center space-x-3">
              <Shield className="text-nexacore-teal" size={20} />
              <div>
                <p className="text-white text-sm font-medium">Security Level</p>
                <p className="text-white/60 text-xs">Strong password protection</p>
              </div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg flex items-center space-x-3">
              <Calendar className="text-nexacore-teal" size={20} />
              <div>
                <p className="text-white text-sm font-medium">Last Login</p>
                <p className="text-white/60 text-xs">Today, 15:30 PM</p>
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-white/10 flex justify-end space-x-3">
            <Button 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={handleChangePassword}
            >
              <Lock size={16} className="mr-2" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmailProfile;
