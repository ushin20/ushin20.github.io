import "../css/about.css";

function About() {
  //const pdfUrl = '/helloworld.pdf'; // public/
  const handleViewPdf = () => {
    alert("It will be updated soon.");
    //window.open(pdfUrl, '_blank');
  };
  return (
    <div className='about-container'>
      <div className='img-container'>
        <img alt='Yooshin Kim' src='img/me.jpg'></img>
      </div>

      <div className='content'>
        <h1>About</h1>
        <h2>I'm Yooshin. A scientist, developer, and problem solver.</h2>
        <p>
          Currently I am a integrated MS & Ph.D student in Computational Theory
          and Application Lab at DGIST, advised by Prof. Donghoon Shin.
        </p>
        <p>
          My work crosses the realms of AD and IDS in ICS. Currently, I’m
          interested in developing new techniques that authenticate users
          without extra behavior, such as passive authentication.
        </p>
        <p className='title'>Experience</p>
        <p>
          - Research Intern in CTAL <br />
          - Research Intern in RTCL <br />
          - Happybuilder 9th in POSCO E&C <br />
        </p>
        <p className='title'>Education</p>
        <p>
          - The integrated MS/PhD degree in Electronical Engineering and
          Computer Science in DGIST <br />
          - The B.S. degree in Transdisciplinary Science in DGIST <br />
          - Freshmen Global Leadership Program in University of California,
          Berkeley <br />
        </p>
        <p className='title'>Skills</p>
        <p className='last'>
          Python / C++ / MySQL / JavaScript / HTML / CSS / React.js / Node.js /
          AWS / Java
        </p>
        <div>
          <button onClick={handleViewPdf}>My CV</button>
        </div>
      </div>
    </div>
  );
}

export default About;
