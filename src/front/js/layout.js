import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import Register from "./component/register";
import Login from "./component/login";
import Workers from "./component/workers";
import { Dashboard } from "./component/dashboard";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "")
        return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />

                    <Routes>
                        {/* públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* demo */}
                        <Route path="/demo" element={<Demo />} />
                        <Route path="/single/:theid" element={<Single />} />

                        {/* app */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/workers" element={<Workers />} />

                        {/* catch-all */}
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>

                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);