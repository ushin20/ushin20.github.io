import "../css/contact.css";

function Contact() {
  //https://www.lauren-waller.com/contact
  return (
    <div className='contact-container'>
      <div className='h1-container'>
        <h1>Hello.</h1>
      </div>
      <div className='p-container'>
        <p>
          Are you passionate about exploring groundbreaking ideas and conducting
          innovative research? Get in touch.
          <br />
          <br />
          Email: &nbsp;
          <a href='mailto:yooshin0303@dgist.ac.kr'>yooshin0303@dgist.ac.kr</a>
          <br />
          On the Internet: &nbsp;<a href='https://github.com/ushin20'>Github</a>
        </p>
      </div>
    </div>
  );
}

export default Contact;
