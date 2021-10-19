import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Message, Suporte } from '../../interfaces';
import { useSocket } from '../../providers/socket';

interface contextProps {
  suportes: Suporte[];
  fila: number;
  suporte: Suporte;
  status: string;
  setSuportes: any;
  setSuporte: any;
  loadingSuporte: boolean;
  setLoadingSuporte: (value: boolean) => void;
  setFila: any;
  setStatus: (status: string) => void;
  loadSuportes: () => void;
  loadSuporte: () => void;
}

export const ChatContext = createContext<contextProps>({} as contextProps);

export function ChatProvider({ children }: any) {
  const [suportes, setSuportes] = useState<Suporte[]>([]);
  const [fila, setFila] = useState(0);
  const [suporte, setSuporte] = useState<Suporte>({} as Suporte);
  const [loadingSuporte, setLoadingSuporte] = useState(false);
  const [status, setStatus] = useState('');

  const { chat_id: id = null } = useParams<{ chat_id: string }>();

  const { socket } = useSocket();
  const { push } = useHistory();

  useEffect(() => {
    socket?.on('message', handleMessage);
    socket?.on('ack', handleAck);

    return () => {
      socket?.off('message', handleMessage);
      socket?.off('ack', handleAck);
    };
  }, [suportes, fila, suporte, loadingSuporte, status]);

  useEffect(() => {
    loadSuportes()
  }, []) 

  useEffect(() => {
    if (id) {
      loadSuporte(true);
    } else {
      setSuporte({} as Suporte);
    }
  }, [id]);

  const handleMessage = useCallback(
    function (msg: Message) {
      if (msg.fromMe) {
        loadSuporte();
        loadSuportes();
        return;
      }

      if (msg.from === suporte.chat_id) {
        loadSuporte();
      } else {
        const owner = suportes.find(
          (item: Suporte) => item.chat_id === msg.from
        );

        if (owner) {
          toast.success(
            `Nova mensagem de ${owner.name || owner.pushname || owner.chat_id}`,
            {
              onClick: () => push(`/chat/${owner.id}`),
              theme: 'light',
              autoClose: false,
            }
          );
        }
        loadSuportes();
      }
    },
    [suporte.chat_id]
  );

  async function loadSuportes() {
    try {
      const { data } = await axios.get<{ suportes: any; fila: number }>(
        'suportes/user'
      );

      setSuportes(data.suportes);
      setFila(data.fila);
    } catch (error) {}
  }

  async function loadSuporte(withLoading = false) {
    if (withLoading) {
      setLoadingSuporte(true);
    }
    try {
      const { data } = await axios.get(`suportes/${id}`);

      setSuporte(data);

      // loadSuportes();
    } catch (error) {}
    setLoadingSuporte(false);
  }

  function handleAck(message: Message) {
    if (suporte?.messages) {
      const newMessages = suporte.messages.map((_message) => {
        if (message.id.id === _message.id.id) {
          _message.ack = message.ack;
        }
        return _message;
      });
      setSuporte((old) => ({ ...old, messages: newMessages }));
    }

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
        loadingSuporte,
        setLoadingSuporte,
        fila,
        setFila,
      }}>
      {children}
    </ChatContext.Provider>
  );
}
