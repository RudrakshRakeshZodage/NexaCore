
// Helper functions for working with n8n automations
import { useToast } from "@/hooks/use-toast";

/**
 * Send data to an n8n webhook
 * @param webhookUrl - The n8n webhook URL to send data to
 * @param data - The data payload to send
 * @param apiKey - Optional API key for secured webhooks
 * @returns Promise resolving to the response or error message
 */
export const triggerN8nWebhook = async (
  webhookUrl: string, 
  data: any, 
  apiKey?: string
): Promise<{ success: boolean; message: string }> => {
  if (!webhookUrl) {
    return { success: false, message: "Webhook URL is required" };
  }
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add API key to headers if provided
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }
    
    // Add metadata about the request
    const payload = {
      ...data,
      meta: {
        source: 'NexaCore App',
        timestamp: new Date().toISOString(),
        sourceUrl: window.location.href
      }
    };
    
    // Send request to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      mode: 'no-cors', // Handle CORS issues with n8n webhooks
      body: JSON.stringify(payload)
    });
    
    return { 
      success: true, 
      message: "Webhook triggered successfully" 
    };
  } catch (error) {
    console.error("Error triggering n8n webhook:", error);
    return { 
      success: false, 
      message: `Failed to trigger webhook: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

/**
 * Custom hook for handling n8n webhook interactions
 */
export const useN8nAutomation = () => {
  const { toast } = useToast();
  
  /**
   * Trigger an n8n webhook and show toast notifications for status
   */
  const triggerAutomation = async (
    webhookUrl: string, 
    data: any,
    options?: {
      apiKey?: string;
      successMessage?: string;
      errorMessage?: string;
    }
  ) => {
    if (!webhookUrl) {
      toast({
        title: "Automation Error",
        description: "Webhook URL is missing. Please configure it in Settings.",
        variant: "destructive",
      });
      return { success: false };
    }
    
    toast({
      title: "Triggering Automation",
      description: "Connecting to n8n workflow...",
    });
    
    const result = await triggerN8nWebhook(webhookUrl, data, options?.apiKey);
    
    if (result.success) {
      toast({
        title: "Automation Triggered",
        description: options?.successMessage || "The n8n workflow was triggered successfully",
        variant: "default",
      });
    } else {
      toast({
        title: "Automation Failed",
        description: options?.errorMessage || result.message,
        variant: "destructive",
      });
    }
    
    return result;
  };
  
  return { triggerAutomation };
};
