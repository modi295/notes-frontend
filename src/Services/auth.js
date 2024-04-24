
export const isLoggedIn = () => {
    return localStorage.getItem('email') && localStorage.getItem('token');
  };
  
  export const login = (email, token) => {
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
  };
  
  export const logout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
  };
  