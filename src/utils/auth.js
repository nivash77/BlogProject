
export const isLoggedIn = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('username') !== null;
    }
    return false;
  };
  
  export const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('username');
    }
  };
  