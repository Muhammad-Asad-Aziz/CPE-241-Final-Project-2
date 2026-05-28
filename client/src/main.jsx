// App entry: defines which URL path renders which page (routes)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TransferList from "./pages/transfers/TransferList.jsx";
import TransferPage from "./pages/transfers/TransferPage.jsx";
import PlayerList from "./pages/players/PlayerList.jsx";
import PlayerPage from "./pages/players/PlayerPage.jsx";
import ItemList from "./pages/items/ItemList.jsx";
import ItemPage from "./pages/items/ItemPage.jsx";
import ChestList from "./pages/chests/ChestList.jsx";
import ChestPage from "./pages/chests/ChestPage.jsx";
import VillagerList from "./pages/villagers/VillagerList.jsx";
import VillagerPage from "./pages/villagers/VillagerPage.jsx";
import RecipeList from "./pages/recipes/RecipeList.jsx";
import RecipePage from "./pages/recipes/RecipePage.jsx";
import EnchantmentList from "./pages/enchantments/EnchantmentList.jsx";
import EnchantmentPage from "./pages/enchantments/EnchantmentPage.jsx";
import Reports from "./pages/reports/Reports.jsx";

import CraftingsList from "./pages/craftings/CraftingsList.jsx"; //Supanut
import CraftingsPage from "./pages/craftings/CraftingsPage.jsx"; //Crafting
// (GUIDE) #3.9.1 ADD YOUR WORK HERE

import { http } from "./api/http.js";
import "./index.css";

// Collapsible submenu
function SubMenu({ icon, label, children, basePath }) {
  const location = window.location.pathname;
  const isActive = location.startsWith(basePath);
  const [isOpen, setIsOpen] = React.useState(isActive);

  return (
    <div className={`nav-group ${isOpen ? 'open' : ''}`}>
      <button 
        type="button" 
        className={`nav-item nav-group-toggle ${isActive ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
        <span style={{ flex: 1 }}>{label}</span>
        <svg 
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div className="nav-submenu" style={{ display: isOpen ? 'block' : 'none' }}>
        {children}
      </div>
    </div>
  );
}

function Sidebar() {
  // NavLink injects isActive when the current URL matches this link
  const getLinkClass = ({ isActive }) => isActive ? "nav-item active" : "nav-item";
  const getSubLinkClass = ({ isActive }) => isActive ? "nav-subitem active" : "nav-subitem";

  return (
    <aside className="sidebar no-print">
      <div className="sidebar-header">
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          CraftLess
        </div>
      </div>
      <nav className="sidebar-nav">
        {/* Transfers (Primary Function) */}
        <NavLink to="/transfers" className={getLinkClass}>
          <svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
          Transfers
        </NavLink>

        {/* Crafting (Primary Function) */}
<NavLink to="/craftings" className={getLinkClass}>
          <svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="12" width="20" height="3" rx="0.5" />
            <line x1="5" y1="15" x2="5" y2="22" />
            <line x1="19" y1="15" x2="19" y2="22" />
            <line x1="2" y1="19" x2="22" y2="19" />
            <path d="M15 4h-4v4h4z" />
            <line x1="13" y1="8" x2="13" y2="12" />
            <path d="M6 12V9h3v3" />
          </svg>
          Crafting
        </NavLink>

        {/* (GUIDE) #3.9.2 ADD YOUR WORK HERE */}

        {/* Players */}
        <NavLink to="/players" className={getLinkClass}>
          <svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Players
        </NavLink>

        {/* Chests */}
        <NavLink to="/chests" className={getLinkClass}>
          <svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          Storage Chests
        </NavLink>

        {/* Items */}
        <NavLink to="/items" className={getLinkClass}>
          <svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 21.5L5 12V2h10l9.5 9.5a2.12 2.12 0 0 1 0 3l-7 7a2.12 2.12 0 0 1-3 0z"></path></svg>
          MC Items
        </NavLink>

        {/* Villagers */}
        <NavLink to="/villagers" className={getLinkClass}>
          <svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Villagers
        </NavLink>

        {/* Recipes */}
        <NavLink to="/recipes" className={getLinkClass}>
          <svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          Recipes
        </NavLink>

        {/* Enchantments */}
        <NavLink to="/enchantments" className={getLinkClass}>
          <svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Enchantments
        </NavLink>

        {/* Reports Submenu */}
        <SubMenu 
          basePath="/reports"
          icon={<svg style={{ marginRight: 10 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>}
          label="Reports"
        >
          <NavLink to="/reports/chest-inventory" className={getSubLinkClass}>
            Chest Inventory
          </NavLink>
          <NavLink to="/reports/daily-transfers" className={getSubLinkClass}>
            Daily Transfers
          </NavLink>
          <NavLink to="/reports/chest-utilization" className={getSubLinkClass}>
            Capacity Utilization
          </NavLink>

        
          <NavLink to="/reports/crafting-history" className={getSubLinkClass}>
            Crafting History
          </NavLink>
          <NavLink to="/reports/recipe-requirements" className={getSubLinkClass}>
          Recipe Requirements
          </NavLink>
          <NavLink to="/reports/top-crafted"className={getSubLinkClass}>
          Top Crafted Items
          </NavLink>

        </SubMenu>
      </nav>
    </aside>
  );
}

// Banner when repo has newer commits (server returns updateAvailable if GIT_SHA is set and behind GitHub)
function UpdateBanner() {
  const [show, setShow] = React.useState(false);
  const [repoUrl, setRepoUrl] = React.useState("");
  const DISMISS_KEY = "invoicedoc2-update-banner-dismissed";

  React.useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    http("/api/updates-check")
      .then((data) => {
        if (data.updateAvailable && data.repoUrl) {
          setShow(true);
          setRepoUrl(data.repoUrl);
        }
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="update-banner no-print">
      <span>
        Update available: the repo has new changes — run <code>git pull origin</code> in your project folder to get the latest, or check{" "}
        <a href={repoUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </span>
      <button type="button" className="update-banner-dismiss" onClick={dismiss} aria-label="Close">
        ×
      </button>
    </div>
  );
}

// Mobile warning overlay
function MobileWarning() {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;
  
  return (
    <div className="mobile-warning">
      <div className="mobile-warning-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        <h3>Whoa there! 📱</h3>
        <p>FAKE: TA was too busy touching grass to make this mobile-friendly.<br/>Please grab a laptop. We believe in you.</p>
        <p>REAL: TA was too lazy to make this mobile-friendly.<br/>TA please take your ass back inside and finish the mobile view</p>
        <button className="btn btn-primary" onClick={() => setDismissed(true)}>
          Okay, I'll suffer
        </button>
      </div>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="layout-container">
      <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} theme="light" />
      <MobileWarning />
      <UpdateBanner />
      <div className="top-banner no-print">
        Minecraft Resource & Economy Management System (CraftLess). ⛏️
      </div>
      <div className="app-layout">
        <Sidebar />
        <main className="main-wrapper">
          {children}
        </main>
      </div>
    </div>
  );
}

// Route definitions: path → component
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Default route → transfers list */}
        <Route path="/" element={<Navigate to="/transfers" replace />} />
        
        {/* Transfers */}
        <Route path="/transfers" element={<Layout><TransferList /></Layout>} />
        <Route path="/transfers/new" element={<Layout><TransferPage mode="create" /></Layout>} />
        <Route path="/transfers/:id" element={<Layout><TransferPage mode="view" /></Layout>} />
        <Route path="/transfers/:id/edit" element={<Layout><TransferPage mode="edit" /></Layout>} />
        
        {/* Players */}
        <Route path="/players" element={<Layout><PlayerList /></Layout>} />
        <Route path="/players/new" element={<Layout><PlayerPage mode="create" /></Layout>} />
        <Route path="/players/:id" element={<Layout><PlayerPage mode="view" /></Layout>} />
        <Route path="/players/:id/edit" element={<Layout><PlayerPage mode="edit" /></Layout>} />
        
        {/* Items */}
        <Route path="/items" element={<Layout><ItemList /></Layout>} />
        <Route path="/items/new" element={<Layout><ItemPage mode="create" /></Layout>} />
        <Route path="/items/:id" element={<Layout><ItemPage mode="view" /></Layout>} />
        <Route path="/items/:id/edit" element={<Layout><ItemPage mode="edit" /></Layout>} />
        
        {/* Chests */}
        <Route path="/chests" element={<Layout><ChestList /></Layout>} />
        <Route path="/chests/new" element={<Layout><ChestPage mode="create" /></Layout>} />
        <Route path="/chests/:id" element={<Layout><ChestPage mode="view" /></Layout>} />
        <Route path="/chests/:id/edit" element={<Layout><ChestPage mode="edit" /></Layout>} />
        
        {/* Villagers */}
        <Route path="/villagers" element={<Layout><VillagerList /></Layout>} />
        <Route path="/villagers/new" element={<Layout><VillagerPage mode="create" /></Layout>} />
        <Route path="/villagers/:id" element={<Layout><VillagerPage mode="view" /></Layout>} />
        <Route path="/villagers/:id/edit" element={<Layout><VillagerPage mode="edit" /></Layout>} />
        
        {/* Recipes */}
        <Route path="/recipes" element={<Layout><RecipeList /></Layout>} />
        <Route path="/recipes/new" element={<Layout><RecipePage mode="create" /></Layout>} />
        <Route path="/recipes/:id" element={<Layout><RecipePage mode="view" /></Layout>} />
        <Route path="/recipes/:id/edit" element={<Layout><RecipePage mode="edit" /></Layout>} />

        {/* Enchantments */}
        <Route path="/enchantments" element={<Layout><EnchantmentList /></Layout>} />
        <Route path="/enchantments/new" element={<Layout><EnchantmentPage mode="create" /></Layout>} />
        <Route path="/enchantments/:id" element={<Layout><EnchantmentPage mode="view" /></Layout>} />
        <Route path="/enchantments/:id/edit" element={<Layout><EnchantmentPage mode="edit" /></Layout>} />

        {/* Reports */}
        <Route path="/reports" element={<Navigate to="/reports/chest-inventory" replace />} />
        <Route path="/reports/chest-inventory" element={<Layout><Reports type="chest-inventory" /></Layout>} />
        <Route path="/reports/daily-transfers" element={<Layout><Reports type="daily-transfers" /></Layout>} />
        <Route path="/reports/chest-utilization" element={<Layout><Reports type="chest-utilization" /></Layout>} />

        <Route path="/reports/crafting-history" element={<Layout><Reports type="crafting-history" /></Layout>} />
        <Route path="/reports/recipe-requirements" element={<Layout><Reports type="recipe-requirements" /></Layout>} />
        <Route path="/reports/top-crafted" element={<Layout><Reports type="top-crafted" /></Layout>} />

        {/* Craftings */}
        <Route path="/craftings" element={<Layout><CraftingsList /></Layout>} />
        <Route path="/craftings/new" element={<Layout><CraftingsPage mode="create" /></Layout>} />
        <Route path="/craftings/:id" element={<Layout><CraftingsPage mode="view" /></Layout>} />
        <Route path="/craftings/:id/edit" element={<Layout><CraftingsPage mode="edit" /></Layout>} />


        {/* (GUIDE) #3.9.3 ADD YOUR ROUTES HERE*/}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
