//Potrzebne, żeby tłumaczenie się dobrze załadowało
import "./lib/i18n/index.ts";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { EstimatesListPage } from "./pages/EstimatesListPage";
import { EstimateDetailPage } from "./pages/EstimateDetailPage";
import { Toaster } from "sonner";

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<EstimatesListPage />} />
            <Route path="/estimate/:id" element={<EstimateDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
