import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Message, Suporte } from '../../interfaces';
import { useSocket } from '../../providers/socket';

interface contextProps {
  suportes: Suporte[];
  fila: number;
  suporte: Suporte;
  status: string;
  setSuportes: any;
  setSuporte: any;
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

  const { socket } = useSocket();

  useEffect(() => {
    loadSuportes();
    socket?.on('message', handleMessage);
    socket?.on('ack', handleAck)

    return () => {
      socket?.off('message', handleMessage);
      socket?.off('ack', handleAck)
    };
  }, [id]);

  useEffect(() => {
    if(id) {
      loadSuporte();
    }
  }, [id]);

  function handleMessage() {
    loadSuporte();
    loadSuportes();
  }

  async function loadSuportes() {
    try {
      const { data } = await axios.get<{ suportes: any; fila: number }>(
        'suportes/user'
      );

      setSuportes(data.suportes);
      setFila(data.fila);
    } catch (error) {}
  }

  async function loadSuporte () {
    
    try {
      const { data } = await axios.get(`suportes/${id}`);

      setSuporte(data);

      loadSuportes();
    } catch (error) {}
  }

  function handleAck(message: Message) {
    setSuporte((_suporte: Suporte) => {

      _suporte.messages = _suporte.messages.map(_message => {

        if(message.id.id === _message.id.id) {
          _message.ack = message.ack
        }

        return _message
      })

      return _suporte
    });
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
        setSuporte,
        fila,
        setFila,
      }}>
      {children}
    </ChatContext.Provider>
  );
}
