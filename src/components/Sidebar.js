import { Link, useLocation } from "react-router-dom";
import "../css/sidebar.css";

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  let container;

  if (currentPath === "/") {
    // home
    container = (
      <div className='container'>
        <div className='navlink-item'>
          <a className='navlink' href='https://ushin20-skin.tistory.com'>
            ti
          </a>
        </div>
      </div>
    );
  } else {
    // others
    container = (
      <div className='container'>
        <div className='navlink-item'>
          <Link to='/'>Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className='sidebar'>
      {container}
      <div className='sidebar-line' />
      <div className='sidebar-copyright'>
        <span className='cpright'>&copy;</span> / ushin20
      </div>
    </div>
  );
}

export default Sidebar;
