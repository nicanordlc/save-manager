import { Route, Routes } from "react-router-dom";
import Saves from "@/pages/Saves";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/ui/Layout";
import Settings from "@/pages/Settings";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Saves />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
