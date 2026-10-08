import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CarritoDrawer from './components/CarritoDrawer'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tienda from './pages/Tienda'
import FAQ from './pages/FAQ'
import Contacto from './pages/Contacto'
import Acceso from './pages/Acceso'
import Cuenta from './pages/Cuenta'

export default function App() {
  return (
    <>
      <Navbar />
      <CarritoDrawer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Acceso modo="login" />} />
          <Route path="/registro" element={<Acceso modo="registro" />} />
          <Route path="/cuenta" element={<Cuenta />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}