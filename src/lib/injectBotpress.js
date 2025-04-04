document.addEventListener("DOMContentLoaded", () => {
  // Ensure the DOM is fully loaded before injecting the Botpress webchat
  (function() {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v0/inject.js";
    script.async = true;
    script.onload = () => {
      window.botpressWebChat.init({
        hostUrl: "https://cdn.botpress.cloud/webchat/v0",
        botId: "your-bot-id",
        // ...other Botpress configuration...
      });
    };
    document.body.appendChild(script);
  })();
});
