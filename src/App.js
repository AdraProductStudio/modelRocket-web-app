
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Component/Home";
import AuthPage from "./Component/AuthPage";
import JewelryCategory from "./Component/JewelryCategory";
import HvacCategory from "./Component/HvacCategory";
import ConsumerPreferenceLayout from "./Component/Reusables/ConsumerPreferenceLayout";
import Category from "./Component/Reusables/Category";


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage/>}>

            <Route index exact element={<Home/>}/>

            {/* <Route path="jewelry_category">
              <Route index exact element={<Category/>}/>
              <Route path="consumer_preference" exact element={<ConsumerPreferenceLayout/>}/>
            </Route>

            <Route path="hvac_category">
              <Route index exact element={<Category/>}/>
              <Route path="consumer_preference" exact element={<ConsumerPreferenceLayout/>}/>
            </Route> */}

            <Route path="category">
              <Route index exact element={<Category/>}/>
              <Route path="consumer_preference" exact element={<ConsumerPreferenceLayout/>}/>
            </Route>

            <Route path="*" element={<h1>404 Not Found</h1>}/>
          </Route>

        </Routes>
      </BrowserRouter>
  );
}

export default App;
