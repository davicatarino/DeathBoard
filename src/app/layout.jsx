import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "Death Board - Sistema de Ranking de Vendas",
  description: "Sistema completo para gerenciamento de equipes de vendas, incluindo vendedores, SDRs, reuniões e ranking de performance.",
  keywords: "vendas, ranking, SDR, vendedores, gestão, performance",
  authors: [{ name: "Death Board Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  if (theme === 'dark' || (!theme && systemPrefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 container-responsive py-6">
            {children}
          </main>
        </div>
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            style: { 
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              border: "1px solid hsl(var(--border))",
            },
            duration: 4000,
          }} 
        />
      </body>
    </html>
  );
}
