import '../css/main.css';
import { Link } from 'react-router-dom';

function Main() {
    return (
        <div className="main-container">
            <div className="profile">
                <div className="name">Yooshin Kim</div>
                <div className="jobTitle">Developer / Computer Scientist</div>
                <div className="work">
                    Currently working full-time as an integrated MS & Ph.D student at&nbsp;
                    <a href="https://ctal-dgist.github.io">CTAL</a>, DGIST
                </div>
            </div>
            <div className="link-container">
                <Link to="/about">About</Link>
                <Link to="/publication">publication</Link>
                <Link to="/project">project</Link>
                <Link to="/contact">contact</Link>
            </div>
        </div>
    );
}

export default Main;
