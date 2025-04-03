
import { useEffect } from 'react';

const ChatbotScript = () => {
  useEffect(() => {
    // Add Botpress script
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
    injectScript.async = true;
    document.body.appendChild(injectScript);

    // Add custom bot script
    const botScript = document.createElement('script');
    botScript.src = 'https://files.bpcontent.cloud/2025/03/26/16/20250326164407-TCSX9NIQ.js';
    botScript.async = true;
    document.body.appendChild(botScript);

    return () => {
      // Clean up scripts when component unmounts
      document.body.removeChild(injectScript);
      document.body.removeChild(botScript);
    };
  }, []);

  return null;
};

export default ChatbotScript;
