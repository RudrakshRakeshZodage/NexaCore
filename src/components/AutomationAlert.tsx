
import React from 'react';
import { AlertCircle, Zap, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

interface AutomationAlertProps {
  isVisible: boolean;
  onClose: () => void;
  onConfigure: () => void;
}

const AutomationAlert: React.FC<AutomationAlertProps> = ({
  isVisible,
  onClose,
  onConfigure
}) => {
  if (!isVisible) return null;

  return (
    <Alert className="bg-nexacore-blue-dark/90 border-nexacore-teal/50 text-white mb-6">
      <Zap className="h-5 w-5 text-nexacore-teal" />
      <AlertTitle className="text-nexacore-teal">Automation Available</AlertTitle>
      <AlertDescription className="text-white/80">
        <p className="mb-2">
          NexaCore can automate this task with n8n workflows. Connect your n8n instance to enable automations.
        </p>
        <div className="flex space-x-3 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 border-white/20 text-white hover:bg-white/10"
            onClick={onConfigure}
          >
            <Zap className="h-3.5 w-3.5 mr-2" />
            Configure
          </Button>
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs h-8 text-white/70 hover:text-white"
            onClick={onClose}
          >
            Dismiss
          </Button>
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs h-8 text-nexacore-teal"
            onClick={() => window.open('https://n8n.io/integrations', '_blank')}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Learn more
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AutomationAlert;
