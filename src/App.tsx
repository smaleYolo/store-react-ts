import {Routes, Route} from "react-router-dom";
import Store from "./pages/Store";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import {Container} from "react-bootstrap";
import {ShoppingCartProvider} from "./context/ShoppingCartContext";

function App() {

    return (
        <ShoppingCartProvider>
            <Navbar/>
            <Container className='mb-4'>
                <Routes>
                    <Route path='/' element={<Store/>}/>
                    <Route path='*' element={<Store/>}/>
                    <Route path='/about' element={<About/>}/>
                </Routes>
            </Container>
        </ShoppingCartProvider>

    )
}

export default App
