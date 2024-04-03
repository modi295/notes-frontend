import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Navigation from './Component/Navigation';
import Home from './Screen/Home';
import Faq from './Screen/Faq';
import ContactUs from './Screen/contactUs';
import SearchNote from './Screen/searchNote';
import Login from './Screen/Login';


const router = createBrowserRouter([
  {
    path: "/",
    element: <div><Navigation /><Home /> </div>,
  },
  {
    path: "/faq",
    element: <div><Navigation /><Faq /></div>,
  },
  {
    path: "/login",
    element: <div><Navigation /><Login /></div>,
  },
  {
    path: "/searchNote",
    element: <div><Navigation /><SearchNote /></div>,
  },
  {
    path: "/contactUs",
    element: <div><Navigation /><ContactUs /></div>,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />  
    </div>
  );
}

export default App;
