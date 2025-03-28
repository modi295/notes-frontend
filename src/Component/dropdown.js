import React from 'react';

function Dropdown({ question = "Default question", answer = "default answer", id }) {
  return (
    <div className="accordion" style={{ width: '1000px', margin: '3px auto' }}>
      <div className="accordion-item">
        <h2 className="accordion-header" id={`heading${id}`}>
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${id}`} aria-expanded="true" aria-controls={`collapse${id}`}>
            {question}
          </button>
        </h2>
        <div id={`collapse${id}`} className="accordion-collapse collapse" aria-labelledby={`heading${id}`} data-bs-parent="#accordionExample">
          <div className="accordion-body">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
