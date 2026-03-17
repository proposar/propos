import { LanguageProvider } from "@/contexts/LanguageContext";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
