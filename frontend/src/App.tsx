import { Route, Routes } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { useCallback, useEffect } from "react";
import debounce from "debounce";
import { UpdateAppSize } from "@wailsjs/go/backend/App";
import Saves from "@/pages/Saves";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/ui/Layout";
import Settings from "@/pages/Settings";
import Game from "@/pages/Game";
import useSettings from "@/hooks/useSettings";

const App = () => {
  useSettings();

  const handleResize = useCallback(async () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    await UpdateAppSize(width, height);
    // @ts-expect-error 2339
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.onresize?.clear();
  }, []);

  // save app size on the backend
  useEffect(() => {
    const WAIT_FOR_RESIZE = 500;
    window.onresize = debounce(handleResize, WAIT_FOR_RESIZE);
  }, [handleResize]);

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
        pauseOnHover={false}
        hideProgressBar
        closeButton={false}
      />
    </>
  );
};

export default App;
