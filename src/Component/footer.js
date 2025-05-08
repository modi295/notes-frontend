import React, { useEffect, useState } from 'react';
import api from '../Services/api';
import '../css/footer.css';

function Footer() {
  const [supportLinks, setSupportLinks] = useState({
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
  });

  useEffect(() => {
    api.get('/support')
      .then((response) => {
        const data = response.data;
        setSupportLinks({
          facebookUrl: data.facebookUrl || '',
          twitterUrl: data.twitterUrl || '',
          linkedinUrl: data.linkedinUrl || '',
        });
      })
      .catch((error) => {
        console.error('Error fetching support links:', error);
      });
  }, []);

  return (
    <footer className="bg-light text-dark pt-3 pb-3 d-flex flex-wrap justify-content-between align-items-center">
      <div className="col-md-6 mb-0">
        <p>
          &copy; 2025 Tatvasoft. All Rights Reserved. |
          <a href="mailto:company@email.com" className="text-dark text-decoration-none ms-1">
            Tatvasoft@gmail.com
          </a>
        </p>
      </div>
      <div className="text-end">
        {supportLinks.linkedinUrl && (
          <a href={supportLinks.linkedinUrl} target="_blank" rel="noopener noreferrer">
            <img src="/linkedin.png" alt="LinkedIn" className="me-3 social-icon" />
          </a>
        )}
        {supportLinks.twitterUrl && (
          <a href={supportLinks.twitterUrl} target="_blank" rel="noopener noreferrer">
            <img src="/twitter.png" alt="Twitter" className="me-3 social-icon" />
          </a>
        )}
        {supportLinks.facebookUrl && (
          <a href={supportLinks.facebookUrl} target="_blank" rel="noopener noreferrer">
            <img src="/facebook.png" alt="Facebook" className="me-3 social-icon" />
          </a>
        )}
      </div>
    </footer>
  );
}

export default Footer;