import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-start">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/auth-bg.png')" }}
      />

      {/* Translucent Overlay on the Left */}
      <div className="relative z-10 w-full md:w-1/2 lg:w-[45%] xl:w-[40%] min-h-screen bg-background/80 backdrop-blur-xl flex flex-col justify-center p-8 md:p-12 lg:p-16 border-r border-border/50">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>

      {/* Optional decorative element or branding on the right side on large screens */}
      <div className="hidden md:flex flex-1 items-end justify-end p-12 relative z-10 pointer-events-none">
        <div className="text-white drop-shadow-lg text-right">
          <h2 className="text-4xl font-bold mb-2">Imani Manager</h2>
          <p className="text-lg opacity-90">Building stronger communities together.</p>
        </div>
      </div>
    </div>
  );
}
