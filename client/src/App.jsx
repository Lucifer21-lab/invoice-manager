import { Routes, Route } from 'react-router-dom';
import InvoicePage from './pages/InvoicePage';
import HomePage from './pages/HomePage';
import CreateInvoicePage from './pages/CreateInvoicePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateInvoicePage />} />
        <Route path="/invoices/:id" element={<InvoicePage />} />
      </Routes>
    </div>
  );
}

export default App;