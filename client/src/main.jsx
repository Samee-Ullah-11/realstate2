import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLayout from './pages/admin/AdminLayout'
import Login from './pages/admin/Login'
import Listings from './pages/admin/Listings'
import PropertyForm from './pages/admin/PropertyForm'
import Enquiries from './pages/admin/Enquiries'
import Subscribers from './pages/admin/Subscribers'

const NotFound = () => (
  <section className="container-page pt-20 text-center">
    <h1 className="text-3xl font-medium">Page not found</h1>
    <Link to="/" className="btn btn-dark mt-6">Back to home</Link>
  </section>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<Login />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Listings />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/:id" element={<PropertyForm />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="subscribers" element={<Subscribers />} />
        </Route>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
