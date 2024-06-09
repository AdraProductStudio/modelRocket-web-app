import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Component/Home";
import AuthPage from "./Component/AuthPage";
import ConsumerPreferenceLayout from "./Component/Reusables/ConsumerPreferenceLayout";
import Category from "./Component/Reusables/Category";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<AuthPage />}>
          <Route index exact element={<Home />} />

          <Route path="category">
            <Route index exact element={<Category />} />
            <Route
              path="consumer_preference"
              exact
              element={<ConsumerPreferenceLayout />}
            />
          </Route>

          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
