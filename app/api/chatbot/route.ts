import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const { message, knowledge, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Build conversation context
    const messages = conversationHistory.map(
      (msg: { type: string; content: string }) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      })
    );

    messages.push({
      role: "user",
      content: message,
    });

    const systemPrompt = `You are a helpful Proposar product support assistant. Your role is to answer questions about Proposar, the proposal/contract/invoice platform for freelancers.

PRODUCT KNOWLEDGE:
${knowledge}

GUIDELINES:
- Answer questions about features, pricing, getting started, and best practices
- Be friendly and professional
- Keep responses concise (1-2 paragraphs max)
- If asked about something outside Proposar, politely redirect to Proposar topics
- If you don't know something, suggest emailing support@proposar.com
- Provide actionable advice for common use cases
- Mention specific features when relevant
- Be encouraging about using Proposar

If someone asks for technical support beyond your knowledge, suggest: "I'd recommend reaching out to our support team at support@proposar.com or chatting with us in the app for personalized help."`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      system: systemPrompt,
      messages: messages,
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat message",
        reply: "I'm having trouble responding right now. Please try again or contact support@proposar.com",
      },
      { status: 500 }
    );
  }
}
