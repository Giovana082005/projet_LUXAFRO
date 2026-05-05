import { Outlet } from "react-router-dom";
import Header from "./Header";
//import Footer from "./Footer";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Header />
      
      {/* Contenu principal */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
     {/* <Footer />*/}
    </div>
  );
}

export default Layout;