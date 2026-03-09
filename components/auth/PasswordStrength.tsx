"use client";

function getStrength(password: string): "weak" | "fair" | "strong" | "excellent" {
  if (!password) return "weak";
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 1) return "weak";
  if (score <= 3) return "fair";
  if (score <= 4) return "strong";
  return "excellent";
}

const labels: Record<string, string> = {
  weak: "Weak",
  fair: "Fair",
  strong: "Strong",
  excellent: "Excellent",
};

const colors: Record<string, string> = {
  weak: "bg-red-500",
  fair: "bg-amber-500",
  strong: "bg-yellow-400",
  excellent: "bg-emerald-500",
};

const widths: Record<string, string> = {
  weak: "w-1/4",
  fair: "w-1/2",
  strong: "w-3/4",
  excellent: "w-full",
};

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getStrength(password);
  return (
    <div className="mt-2">
      <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colors[strength]} ${widths[strength]}`}
        />
      </div>
      {password.length > 0 && (
        <p className="text-xs text-muted mt-1">{labels[strength]}</p>
      )}
    </div>
  );
}
