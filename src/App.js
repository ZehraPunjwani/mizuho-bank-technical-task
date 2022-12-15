import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Container } from 'react-bootstrap';
import Header from './components/Header/';
import About from "./components/About";
import Error from "./components/Error";
import TimeSeriesIntraday from "./components/TimeSeriesIntraday";
import './App.css';

function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <TimeSeriesIntraday />,
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
