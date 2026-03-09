"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const PRODUCT_KNOWLEDGE = `
Proposar is a proposal, contract, and invoice platform for freelancers.

Core Features:
- AI Proposal Generation: Create proposals in 60 seconds using AI
- Professional PDFs: Beautiful, branded proposal PDFs with custom colors
- Contract Generation: Auto-generate contracts from proposals
- Invoice Tracking: Track paid/pending/late invoices with reminders
- Client Management: Organize clients, track all interactions
- Analytics: See acceptance rates, response times, pipeline value
- Templates: Customize templates for different project types
- Sharing: Public links for clients to view and sign without accounts

Pricing:
- Free: 5 proposals/month, basic templates, client management
- Starter: $19/month, 50 proposals/month, unlimited templates, analytics
- Pro: $49/month, unlimited proposals, team features, custom branding
- Agency: $199/month, multiple users, white-label, API access

AI Features:
- Generate proposals from project description in 60 seconds
- Learn from your past proposals to personalize future ones
- Customize tone (professional, friendly, detailed, concise)
- Generate contracts automatically
- Write proposal sections (scope, timeline, pricing)

Getting Started:
1. Sign up with email
2. Complete profile (name, business name, contact info)
3. Create first proposal using AI or template
4. Share proposal link with client (no signup needed)
5. Client can view, sign contract, you invoice them

Best Practices:
- Personalize proposals (use client name, specific project details)
- Keep proposals under 3 pages
- Include clear pricing breakdown
- Set expiration date (30 days default)
- Follow up if not viewed in 48 hours
- Use templates for similar project types
- Track acceptance rate in analytics

Common Questions:
Q: Do clients need an account? A: No, they just need the link
Q: Can I edit proposals? A: Yes, before sending. After sending they're locked
Q: How do I get paid? A: Invoice through the platform, collect payment your way
Q: Is there a contract? A: Yes, auto-generated from proposal details
Q: Can I customize branding? A: Yes, add logo and brand color in settings
Q: What currencies? A: USD, EUR, GBP, AUD, CAD, INR, SGD supported
Q: How do I delete an account? A: Go to settings > account > delete (permanent)
Q: Are proposals encrypted? A: Yes, all documents are secure
Q: Can I export proposals? A: Yes, download as PDF
Q: What's the acceptance rate? A: Shows in analytics dashboard
`;

export default function ProductChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! 👋 I'm the Proposar assistant. Ask me anything about proposals, contracts, invoices, or how to use the platform.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          knowledge: PRODUCT_KNOWLEDGE,
          conversationHistory: messages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "I'm having trouble responding. Try asking about proposals, contracts, or pricing.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gold text-[#0a0a14] shadow-lg hover:bg-[#e8c76a] transition-all z-40 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] rounded-xl border border-[#1e1e2e] bg-[#12121e] shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gold px-4 py-3">
            <div>
              <h3 className="font-semibold text-[#0a0a14]">Proposar Assistant</h3>
              <p className="text-xs text-[#0a0a14]/70">Usually replies instantly</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#0a0a14] hover:opacity-70"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                    msg.type === "user"
                      ? "bg-gold text-[#0a0a14]"
                      : "bg-[#1e1e2e] text-[#c4c4cc]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1e1e2e] text-[#c4c4cc] rounded-lg px-4 py-2 flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#1e1e2e] p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-sm text-[#faf8f4] placeholder:text-[#888890] focus:border-gold focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-lg bg-gold px-3 py-2 text-[#0a0a14] hover:bg-[#e8c76a] disabled:opacity-50 transition-all"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-[#888890] mt-2">
              💡 Ask about features, pricing, how to get started, or best practices
            </p>
          </div>
        </div>
      )}
    </>
  );
}
