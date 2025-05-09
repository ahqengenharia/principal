
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import BackgroundImage from "./components/BackgroundImage"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Index from "./pages/Index"
import Analysis from "./pages/Analysis"
import Chatbot from "./components/Chatbot"
import ModuleTemplate from "./pages/ModuleTemplate"
import Services from "./pages/Services"
import DataManagement from "./pages/DataManagement"
import JsonDataViewer from "./pages/JsonDataViewer"
import Settings from "./pages/Settings"
import Dashboard from "./pages/Dashboard"
import Modeling from "./pages/Modeling"
import Legislation from "./pages/Legislation"
import ImageBank from "./pages/ImageBank"

const queryClient = new QueryClient()

const moduleRoutes = [
  { path: 'consistency', title: 'Consistência de Dados' },
  { path: 'images', title: 'Banco de Imagens', component: ImageBank },
  { path: 'rating-curve', title: 'Construção de Curva Chave' },
  { path: 'sediments', title: 'Análise de Sedimentos' },
  { path: 'flow', title: 'Vazões' },
  { path: 'water-quality', title: 'Análises Qualidade de Água' },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen relative">
          <BackgroundImage />
          <Header />
          <main className="flex-grow relative z-10">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/modeling" element={<Modeling />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/services" element={<Services />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/data-management" element={<DataManagement />} />
              <Route path="/json-viewer" element={<JsonDataViewer />} />
              <Route path="/legislation" element={<Legislation />} />
              {moduleRoutes.map(({ path, title, component: Component }) => (
                <Route
                  key={path}
                  path={`/analysis/${path}`}
                  element={
                    Component ? (
                      <Component />
                    ) : (
                      <ModuleTemplate title={title}>
                        <p>Módulo em desenvolvimento</p>
                      </ModuleTemplate>
                    )
                  }
                />
              ))}
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
