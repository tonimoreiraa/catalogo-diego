import { Navigate, Route, Routes } from "react-router-dom";
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import { useAuth } from "../contexts/AuthContext";
import SignIn from "../pages/SignIn";
import View from "../pages/View";
import ProductPage from "../pages/Product";
import Main from "../pages/Main";

function AppRoutes()
{
    const auth = useAuth()

    return <Routes>
        {auth.authenticated ? <>
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<Navigate to="/products" />} />
        </> : <>
            <Route path="/auth/login" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/auth/login" />} />
        </>}
        <Route path="/search" element={<View />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/" element={<Main />} />
    </Routes>
}

export default AppRoutes;