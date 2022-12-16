import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from './components/Header/';
import Home from "./components/Home";
import About from "./components/About";
import Error from "./components/Error";
import './App.css';

function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/about",
            element: <About />,
        },
        {
            path: "*",
            element: <Error />,
        }
    ]);

    return (
        <div className="App" style={{ minWidth: '100vw' }}>
            <Header />
            <div style={{ margin: '30px' }}>
                <RouterProvider router={router} />
            </div>
        </div>
    );
}

export default App;
