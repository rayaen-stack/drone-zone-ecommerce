import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { formatCurrency, convertUsdToKes } from "@/lib/currency";

type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const predefinedResponses = {
  greeting: [
    "Hello! Welcome to DroneZone. How can I help you today?",
    "Hi there! I'm DroneZone's assistant. What are you looking for today?",
    "Welcome to DroneZone! I'm here to assist with your drone shopping needs."
  ],
  pricing: [
    "Our drone prices range from KSh 26,000 to KSh 650,000 depending on the model and features.",
    "We have drones for all budgets! Entry-level drones start at KSh 26,000, while professional models can go up to KSh 650,000."
  ],
  shipping: [
    "We offer free shipping on all orders over KSh 13,000. Standard shipping takes 3-5 business days within Kenya.",
    "Shipping is free for orders above KSh 13,000. We deliver within 3-5 business days across Kenya."
  ],
  returns: [
    "We have a 30-day return policy. Products must be in original packaging and undamaged.",
    "You can return any product within 30 days as long as it's in its original condition and packaging."
  ],
  warranty: [
    "All our drones come with the manufacturer's warranty, typically 1-2 years depending on the model.",
    "Our drones include manufacturer warranties - usually 1-2 years. We also offer extended warranty plans."
  ],
  bestSeller: [
    "Our best-selling drone is the DJI Mini 3 Pro, perfect for beginners and enthusiasts alike!",
    "The DJI Air 2S is currently our most popular model due to its excellent camera and flight performance."
  ],
  recommendation: [
    "For beginners, I recommend the DJI Mini 3 at KSh 65,000. It's lightweight, easy to fly, and has great battery life!",
    "The DJI Air 2S (KSh 130,000) is perfect if you're looking for excellent camera quality and professional features."
  ],
  fallback: [
    "I'm not sure I understand. Could you rephrase your question?",
    "I don't have that information right now. For detailed assistance, please contact our customer service at support@dronezone.com.",
    "That's a good question! Our customer service team would be happy to help you with this - please email support@dronezone.com."
  ]
};

const findResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return getRandomResponse(predefinedResponses.greeting);
  }
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
    return getRandomResponse(predefinedResponses.pricing);
  }
  if (lowerMessage.includes("ship") || lowerMessage.includes("delivery") || lowerMessage.includes("when will")) {
    return getRandomResponse(predefinedResponses.shipping);
  }
  if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
    return getRandomResponse(predefinedResponses.returns);
  }
  if (lowerMessage.includes("warranty") || lowerMessage.includes("guarantee")) {
    return getRandomResponse(predefinedResponses.warranty);
  }
  if (lowerMessage.includes("best seller") || lowerMessage.includes("popular") || lowerMessage.includes("most sold")) {
    return getRandomResponse(predefinedResponses.bestSeller);
  }
  if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest") || lowerMessage.includes("which drone")) {
    return getRandomResponse(predefinedResponses.recommendation);
  }
  
  return getRandomResponse(predefinedResponses.fallback);
};

const getRandomResponse = (responses: string[]): string => {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

interface ChatBotProps {
  initialOpen?: boolean;
}

const ChatBot = ({ initialOpen = false }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: getRandomResponse(predefinedResponses.greeting),
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to the most recent message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        text: findResponse(userMessage.text),
        isUser: false,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 rounded-full w-14 h-14 bg-primary hover:bg-primary/90 flex items-center justify-center shadow-lg"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50 flex flex-col border">
      {/* Header */}
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          <h3 className="font-semibold">DroneZone Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-primary/90 h-8 w-8"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-grow p-3 overflow-y-auto max-h-96 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                message.isUser
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white">
        <div className="flex items-center">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow mr-2"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === "" || isTyping}
            className="bg-primary hover:bg-primary/90 h-10 w-10 p-0"
            aria-label="Send message"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;