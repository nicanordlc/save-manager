import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Layout from "@/pages/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
