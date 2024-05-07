import { Route, Routes } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import Saves from "@/pages/Saves";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/ui/Layout";
import Settings from "@/pages/Settings";
import Game from "@/pages/Game";
import useSettings from "@/hooks/useSettings";

const App = () => {
  useSettings();
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Saves />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <ToastContainer
        autoClose={500}
        theme="dark"
        transition={Flip}
        pauseOnFocusLoss={false}
      />
    </>
  );
};

export default App;
