import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { AuthContextProps, User } from '../../interfaces';
import { useHistory } from 'react-router';

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const LSTOKEN = 'auth_token';

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState<string | null>('');
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true)

  const { push } = useHistory()

  useEffect(() => {
    const lsToken = localStorage.getItem(LSTOKEN);
    
    setToken(lsToken);
  }, []);

  useEffect(() => {
    if (token !== null) {
      if(token.length > 0) {
        localStorage.setItem(LSTOKEN, token);
        loadUser()
      }
    } else {
      localStorage.removeItem(LSTOKEN);
      setUser(null);
      setLoading(false)
    }
  }, [token]);

  async function loadUser() {
    setLoading(true)
    try {
        const { data } = await axios.get('auth/me')

        setUser(data as User)
    } catch( err: any ) {

    }
    setLoading(false)
  }

  function login(token: string) {
    setToken(token);
    push('/')
  }

  function logout() {
    setToken(null);
  }

  if(loading) {
    return <p>Carregando...</p>
  }
  

  return <AuthContext.Provider value={{login, logout, user}}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextProps {
  const ctx = useContext(AuthContext);

  return ctx;
}
