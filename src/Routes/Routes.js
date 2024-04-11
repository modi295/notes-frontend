import {createBrowserRouter} from "react-router-dom";
import React from 'react';
import Navigation from '../Component/Navigation';
import Home from '../Screen/Home';
import Faq from '../Screen/Faq';
import ContactUs from '../Screen/contactUs';
import SearchNote from '../Screen/searchNote';
import Login from '../Screen/Login';
import Register from "../Screen/Register";
import ForgotPassword from "../Screen/ForgotPassword";

import Protected from "./protected";
import UserProfile from "../Screen/UserProfile";

const router = createBrowserRouter([
    {
      path: "/",
      element: <div><Navigation /><Home /> </div>,
    },
    {
      path: "/faq",
      element: <div><Navigation />{<Protected Component={Faq}/>}</div>,
    },
    {
      path: "/login",
      element: <div><Navigation /><Login /></div>,
    },
    {
        path: "/register",
        element: <div><Navigation /><Register /></div>,
      },
    {
      path: "/searchNote",
      element: <div><Navigation /><SearchNote /></div>,
    },
    {
      path: "/contactUs",
      element: <div><Navigation />{<Protected Component={ContactUs}/>}</div>,
    },
    {
      path: "/forgotPassword",
      element: <div><Navigation /><ForgotPassword /></div>,
    },
    {
      path: "/userprofile",
      element: <div><Navigation /><UserProfile /></div>,
    },
  ]);
  export default router