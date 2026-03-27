import { Routes, Route } from "react-router-dom";

//pages and components imports
import Header from "../components/Header"; 
import HomePage from "./homePage";
import ShopPage from "./CakesPage";
import CakeDetailPage from "../components/CakeDetailPage";
import OrderPage from "./OrderPage";
import ProfilePage from "./ProfilePage";
import MyOrdersPage from "../components/MyOrdersPage";
import AboutPage from "./AboutPage";
import Contact from "./Contact";
import AccessoriesPage from "./Accessories";
import AccessoriesOverview from "../components/AccessoriesOverview";
import PaymentPage from "./PaymentPage";
import MyPayments from "./MyPayments";
import FeedbackForm from "./Feedback";
import DriverDashboard from "./DriverDashboard"
import CustomerTrack from "../components/CustomerTrack";


export default function LinkPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header /> 
            
            <main className="flex-grow  pt-10">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/Cakes" element={<ShopPage/>}/>
                    <Route path="/cake/:id" element={<CakeDetailPage />} />
                    <Route path="/order" element={<OrderPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-orders/:userId" element={<MyOrdersPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/Accessories" element={<AccessoriesPage />} />
                    <Route path="/accessory/:id" element={<AccessoriesOverview />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/my-payments" element={<MyPayments />} />
                    <Route path="/feedback" element={<FeedbackForm />} />
                    <Route path="/driver" element={<DriverDashboard/>}/>
                    <Route path="/my-delivery/:userId" element={<CustomerTrack />} />

                </Routes>
            </main>
        </div>
    );
}