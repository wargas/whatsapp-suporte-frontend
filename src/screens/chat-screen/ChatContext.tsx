import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Suporte } from '../../interfaces';

interface contextProps {
  suportes: Suporte[];
  fila: number;
  suporte: Suporte;
  status: string;
  setSuportes: any;
  setFila: any;
  setStatus: (status: string) => void;
  loadSuportes: () => void;
  loadSuporte: () => void;
}

export const ChatContext = createContext<contextProps>({} as contextProps);

export function ChatProvider({ children }: any) {
  const [suportes, setSuportes] = useState([]);
  const [fila, setFila] = useState(0);
  const [suporte, setSuporte] = useState<Suporte>({} as Suporte);
  const [status, setStatus] = useState('');

  const { chat_id: id = null } = useParams<{ chat_id: string }>();

  useEffect(() => {
    loadSuportes();
  }, []);

  useEffect(() => {
    loadSuporte();
  }, [id]);

  async function loadSuportes() {
    try {
      const { data } = await axios.get<{ suportes: any; fila: number }>(
        'suportes/user'
      );

      setSuportes(data.suportes);
      setFila(data.fila);

      console.log(suportes);
    } catch (error) {}
  }

  async function loadSuporte() {
    try {
      const { data } = await axios.get(`suportes/${id}`);

      setSuporte(data);
    } catch (error) {}
  }

  return (
    <ChatContext.Provider
      value={{
        setStatus,
        status,
        suporte,
        suportes,
        loadSuportes,
        loadSuporte,
        setSuportes,
        fila,
        setFila,
      }}>
      {children}
    </ChatContext.Provider>
  );
}
