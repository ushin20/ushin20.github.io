import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../css/home.css';

function Home() {
    return (
        <div className="home">
            <Sidebar />

            <Outlet />
        </div>
    );
}

export default Home;
