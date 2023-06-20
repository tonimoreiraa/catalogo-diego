import { Route, Routes } from "react-router-dom";
import Categories from "../pages/Categories";
import Products from "../pages/Products";

function AppRoutes()
{
    return <Routes>
        <Route path="/categories" element={<Categories />} />
        <Route path="/views/:viewId" element={<Products />} />
    </Routes>
}

export default AppRoutes;