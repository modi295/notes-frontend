import { createBrowserRouter } from "react-router-dom";
import MainLayout from '../Routes/MainLayout';
import '../css/route.css'
import React from 'react';
import Navigation from '../Component/Navigation';
import Home from '../Screen/Home';
import Faq from '../Screen/Faq';
//import ContactUs from '../Screen/contactUs';
import SearchNote from '../Screen/searchNote';
//import Login from '../Screen/Login';
import Register from "../Screen/Register";
import ForgotPassword from "../Screen/ForgotPassword";
import Protected from "./protected";
import UserProfile from "../Screen/UserProfile";
import ChangePassword from "../Screen/ChangePassword";
import AddNotes from "../Screen/AddNotes";
import SellNotes from "../Screen/SellNotes";
import EditNotes from "../Screen/EditNotes";
import ViewNotes from "../Screen/ViewNotes";
import MyDownload from "../Screen/MyDownload";
import SoldNotes from "../Screen/SoldNotes";
import BuyRequest from "../Screen/BuyRequest";
import AdminDashboard from "../Screen/AdminDashboard";
import DownloadNotes from "../Screen/DownloadNotes";
import UnderReview from "../Screen/UnderReview";
import RejectedNotes from "../Screen/RejectedNotes";
import AllPublishNotes from "../Component/allPublishNotes";
import Member from "../Screen/Member";
import MemberDetails from "../Screen/MemberDetails";
import AddAdministrator from "../Screen/AddAdministrator";
import Administrator from "../Screen/Administrator";
import EditAdministrator from "../Screen/EditAdministrator";
import VerifyEmail from "../Screen/VerifyEmail";
import Lookup from "../Screen/Lookup";
import AddLookup from "../Screen/AddLookup";
import EditLookup from "../Screen/EditLookup";
import MyRejectedNotes from "../Screen/MyRejectedNotes";
import SpamReport from "../Screen/SpamReport";
import ManageSupport from "../Screen/ManageSupport";
import LoginMU from "../MUScreen/Login"
import ContactUsMU from "../MUScreen/Contact"

const withLayout = (Component, isProtected = false, access = false) => (
  <MainLayout>
    {isProtected ? <Protected Component={Component} access={access} /> : <Component />}
  </MainLayout>
);

const router = createBrowserRouter([
  { path: "/", element: <><Navigation /><Home /></> },
  { path: "/faq", element: withLayout(Faq, true, true) },
  { path: "/login", element: <><Navigation /><LoginMU /></> },
  { path: "/loginmu", element: <><Navigation /><LoginMU /></> },
  { path: "/register", element: <><Navigation /><Register /></> },
  { path: "/contactUs", element: withLayout(ContactUsMU, true) },
  { path: "/changePassword", element: withLayout(ChangePassword, true) },
  { path: "/forgotPassword", element: withLayout(ForgotPassword) },
  { path: "/userprofile", element: withLayout(UserProfile, true) },
  { path: "/addNotes", element: withLayout(AddNotes, true) },
  { path: "/sellNotes", element: withLayout(SellNotes, true) },
  { path: "/editNotes/:id", element: withLayout(EditNotes, true) },
  { path: "/viewNotes/:id", element: withLayout(ViewNotes) },
  { path: "/searchNote", element: withLayout(SearchNote) },
  { path: "/downloadNotes", element: withLayout(MyDownload, true) },
  { path: "/soldNotes", element: withLayout(SoldNotes, true) },
  { path: "/myRejectedNotes", element: withLayout(MyRejectedNotes, true) },
  { path: "/BuyRequest", element: withLayout(BuyRequest, true) },
  { path: "/adminDashboard", element: withLayout(AdminDashboard, true) },
  { path: "/downloadNotes/:id", element: withLayout(DownloadNotes, true) },
  { path: "/alldownloadNotes", element: withLayout(DownloadNotes, true) },
  { path: "/underReview", element: withLayout(UnderReview, true) },
  { path: "/underReview/:email", element: withLayout(UnderReview, true) },
  { path: "/publishNotes", element: withLayout(AllPublishNotes, true) },
  { path: "/publishNotes/:email", element: withLayout(AllPublishNotes, true) },
  { path: "/rejectedNotes", element: withLayout(RejectedNotes, true) },
  { path: "/member", element: withLayout(Member, true) },
  { path: "/memberDetail/:email", element: withLayout(MemberDetails, true) },
  { path: "/administrator", element: withLayout(Administrator, true) },
  { path: "/addadministrator", element: withLayout(AddAdministrator, true) },
  { path: "/editadministrator/:email", element: withLayout(EditAdministrator, true) },
  { path: "/lookup", element: withLayout(Lookup, true) },
  { path: "/addlookup", element: withLayout(AddLookup, true) },
  { path: "/editlookup/:typeId", element: withLayout(EditLookup, true) },
  { path: "/spamReport", element: withLayout(SpamReport, true) },
  { path: "/support", element: withLayout(ManageSupport, true) },
  { path: "/verify-email/:token", element: withLayout(VerifyEmail) },
]);

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <div><Navigation /><Home /> </div>,
//   },
//   {
//     path: "/faq",
//     element: <div><Navigation />{<Protected Component={Faq} access={true} />}</div>,
//   },
//   {
//     path: "/login",
//     element: <div><Navigation /><Login /></div>,
//   },
//   {
//     path: "/loginmu",
//     element: <div><Navigation /><LoginMU /></div>,
//   },
//   {
//     path: "/register",
//     element: <div><Navigation /><Register /></div>,
//   },
//   {
//     path: "/searchNote",
//     element: <div><Navigation /><SearchNote /> <Footer /></div>,
//   },
//   {
//     path: "/contactUs",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={ContactUsMU} />} </div><Footer /></div>,
//   },
//   {
//     path: "/changePassword",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={ChangePassword} />}</div><Footer /></div>,
//   },
//   {
//     path: "/forgotPassword",
//     element: <div><Navigation /><div className="screen-content"><ForgotPassword /></div><Footer /></div>,
//   },
//   {
//     path: "/userprofile",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={UserProfile} />}</div><Footer /></div>,
//   },
//   {
//     path: "/addNotes",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={AddNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/sellNotes",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={SellNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/editNotes/:id",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={EditNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/viewNotes/:id",
//     element: <div><Navigation /><div className="screen-content"><ViewNotes /></div><Footer /></div>,
//   },
//   {
//     path: "/downloadNotes",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={MyDownload} />}</div><Footer /></div>,
//   },
//   {
//     path: "/soldNotes",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={SoldNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/myRejectedNotes",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={MyRejectedNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/BuyRequest",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={BuyRequest} />}</div><Footer /></div>,
//   },
//   {
//     path: "/adminDashboard",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={AdminDashboard} />}</div><Footer /></div>,
//   },
//   {
//     path: "/downloadNotes/:id",
//     element: <div style={{ paddingTop: "100px" }}><Navigation /><div className="screen-content">{<Protected Component={DownloadNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/alldownloadNotes",
//     element: <div style={{ paddingTop: "100px" }}><Navigation /><div className="screen-content">{<Protected Component={DownloadNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/underReview",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={UnderReview} />}</div><Footer /></div>,
//   },
//   {
//     path: "/underReview/:email",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={UnderReview} />}</div><Footer /></div>,
//   },
//   {
//     path: "/publishNotes",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={AllPublishNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/publishNotes/:email",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={AllPublishNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/rejectedNotes",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={RejectedNotes} />}</div><Footer /></div>,
//   },
//   {
//     path: "/member",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={Member} />}</div><Footer /></div>,
//   },
//   {
//     path: "/memberDetail/:email",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={MemberDetails} />}</div><Footer /></div>,
//   },
//   {
//     path: "/administrator",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={Administrator} />}</div><Footer /></div>,
//   },
//   {
//     path: "/addadministrator",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={AddAdministrator} />}</div><Footer /></div>,
//   },
//   {
//     path: "/editadministrator/:email",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={EditAdministrator} />}</div><Footer /></div>,
//   },
//   {
//     path: "/lookup",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={Lookup} />}</div><Footer /></div>,
//   },
//   {
//     path: "/addlookup",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={AddLookup} />}</div><Footer /></div>,
//   },
//   {
//     path: "/editlookup/:typeId",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={EditLookup} />}</div><Footer /></div>,
//   },
//   {
//     path: "/spamReport",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={SpamReport} />}</div><Footer /></div>,
//   },
//   {
//     path: "/support",
//     element: <div><Navigation /><div className="screen-content">{<Protected Component={ManageSupport} />}</div><Footer /></div>,
//   },
//   {
//     path: "/verify-email/:token",
//     element: <div><Navigation /><div className="screen-content"><VerifyEmail /></div><Footer /></div>,
//   },

// ]);
export default router