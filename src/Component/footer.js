import React from 'react'

function footer() {
  return (
    <footer class="bg-light text-dark pt-3 pb-3 d-flex flex-wrap justify-content-between align-items-center">
  <div class="col-md-6 mb-0">
    <p class="text-muted">&copy; 2024 Company Name. All Rights Reserved. | <a href="mailto:company@email.com" class="text-dark text-decoration-none">company@email.com</a></p>
  </div>
  <div class="text-end">
    <a href="s"><img src="linkedin1.png" alt="LinkedIn" width="30" height="30" class="me-3"/></a>
    <a href="d"><img src="twitter1.png" alt="Twitter" width="30" height="30" class="me-3"/></a>
    <a href="l"><img src="instagram1.png" alt="Instagram" width="30" height="30"/></a>
  </div>
</footer>

  
  )
}

export default footer