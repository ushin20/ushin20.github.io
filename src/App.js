import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Main from './pages/Main';
import About from './pages/About';
import Publication from './pages/Publication';
import Project from './pages/Project';
import Contact from './pages/Contact';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />}>
                    <Route path="/" element={<Main />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/publication" element={<Publication />} />
                    <Route path="/project" element={<Project />} />
                    <Route path="/contact" element={<Contact />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
