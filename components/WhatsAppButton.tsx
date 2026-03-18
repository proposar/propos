"use client";

export function WhatsAppButton({ className = "" }: { className?: string }) {
  const whatsappNumber = "919148868413"; // +91 9148868413 without + or spaces
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Proposar%20team%2C%20I%20need%20help%20with%20my%20account.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      💬 Chat on WhatsApp
    </a>
  );
}

export function WhatsAppWidget() {
  const whatsappNumber = "919148868413";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Proposar%20team%2C%20I%20need%20help%20with%20my%20account.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-green-500 text-white px-4 py-3 font-medium shadow-lg hover:bg-green-600 transition"
      title="Chat with us on WhatsApp"
    >
      <span className="text-xl">💬</span>
      <span className="hidden sm:inline">Help</span>
    </a>
  );
}
