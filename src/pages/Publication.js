import "../css/publication.css";

function Publication() {
  return (
    <div className='publication-container'>
      <div className='content'>
        <h1>Publication</h1>

        <p className='title'>International Conference</p>
        <p className='title'>International Journal</p>
        <p className='title'>Domestic</p>
        <p className='domestic'>
          권남혁, 김유신, 우은규, 정다훈, 채척, 신동훈. (2023).
          산업제어시스템에서의 AI IDS 성능 향상을 위한 데이터 품질 연구 동향 및
          제언. <i>정보보호학회지</i>, 33(6), 5-14. &nbsp;
          <a href='https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11653410'>
            (link)
          </a>
        </p>
        <p className='title'>Preprint</p>
        <p>
          Kim, Y., Kwon, N., & Shin, D. (2024). KDPrint: Passive Authentication
          using Keystroke Dynamics-to-Image Encoding via Standardization.{" "}
          <i>arXiv preprint</i>&nbsp;
          <a href='https://doi.org/10.48550/arXiv.2405.01080'>
            <i>arXiv:2405.01080</i>
          </a>
          &nbsp; (2024)
        </p>
      </div>
    </div>
  );
}

export default Publication;
