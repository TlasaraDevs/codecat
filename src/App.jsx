import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

// Vite's BASE_URL ends with "/"; the router wants it without.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <BrowserRouter basename={basename}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LazyMotion>
    </MotionConfig>
  );
}

export default App;
