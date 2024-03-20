import '../css/project.css';

function Project() {
    return (
        <div className="project-container">
            <div className="h1-container">
                <h1>Project</h1>
            </div>
            <div className="projects-list">
                <div className="one-project">
                    <a href="/project">
                        <p className="title">WOD.I</p>
                        <p className="description">Crossfit Application</p>
                    </a>
                </div>
                <div className="one-project">
                    <a href="/project">
                        <p className="title">Web Portpolio</p>
                        <p className="description">Online Resume</p>
                    </a>
                </div>
                <div className="one-project">
                    <a href="/project">
                        <p className="title">network visualization</p>
                        <p className="description">ICS network visualization</p>
                    </a>
                </div>
                <div className="one-project">
                    <a href="/project">
                        <p className="title">ICS cyber training env.</p>
                        <p className="description">Establishment of cyber training environment against cyber threats</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Project;
