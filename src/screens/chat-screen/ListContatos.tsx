import { ChevronLeftIcon, DotsVerticalIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Contato } from '../../interfaces';
import { ChatContext } from './ChatContext';
import { useOffCanvas } from './OffCanvas';

export function ListContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [search, setSearch] = useState('');
  const [filtreds, setFiltreds] = useState<Contato[]>([]);
  const [status, setStatus] = useState('');

  const { loadSuportes } = useContext(ChatContext);
  const { close } = useOffCanvas();

  useEffect(() => {
    setFiltreds(
      contatos
        .filter((contato) => {
          return JSON.stringify(contato)
            .toLowerCase()
            .includes(search.toLowerCase());
        })
        .filter((contrato) => !contrato.isGroup)
        .filter(
          (contato) => contato.name || contato.pushname || contato.shortname
        )
    );
  }, [contatos, search]);

  useEffect(() => {
    loadContatos();
  }, []);

  async function loadContatos() {
    setStatus('loading');
    try {
      const { data } = await axios.get<Contato[]>(`whatsapp/contacts`);

      setContatos(data);
    } catch (error) {}
    setStatus('');
  }

  async function handleContato(contato: Contato) {
    setStatus('loading');
    try {
      const { data } = await axios.get(
        `suportes/${contato.id._serialized}/novo`
      );
      await loadSuportes();

      toast.success(`Suporte para ${contato.pushname}`);

      close(contato);
    } catch (error) {}
    setStatus('');
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-16 bg-green-600 items-center flex text-white'>
        <button
          onClick={() => close(null)}
          className='p-3 mx-3 rounded-full transition-all hover:bg-green-500'>
          <ChevronLeftIcon className='w-4 h-4' />
        </button>
        <h1 className='uppercase font-bold'>Contatos</h1>
        <div className='ml-auto bg-green-800 px-2 rounded-full mr-3 text-xs text-gray-200'>
          {filtreds.length}/{contatos.length}
        </div>
      </div>
      <div className='p-3 border-b'>
        <input
          onChange={(ev) => setSearch(ev.target.value)}
          value={search}
          className='bg-gray-50 px-5 text-sm focus:outline-none w-full h-9 rounded-full'
          type='text'
          placeholder='Pesquisa Contato'
        />
      </div>
      <div
        style={{ scrollbarWidth: 'thin' }}
        className='flex-1 flex-col overflow-y-scroll cursor-pointer  flex'>
        {status === 'loading' && (
          <div className='mt-24 mx-auto'>
            <div className='w-5 h-5 loading border-green-600'></div>
          </div>
        )}
        {status !== 'loading' &&
          filtreds.map((contato) => (
            <div
              onClick={() => handleContato(contato)}
              key={contato.id._serialized}
              className='hover:bg-gray-50 transition-all flex border-b border-gray-50 items-center'>
              <div className='pl-3'>
                <div className='h-9 uppercase text-white flex items-center justify-center w-9 rounded-full bg-green-500'>
                  {contato.name ? contato.name[0] + contato.name[1] : ''}
                </div>
              </div>
              <div className=' p-3'>
                <h1 className='text-sm'>
                  {contato.name ||
                    `${contato.pushname || ''} ${contato.shortname || ''}`}
                </h1>
                <p className='text-gray-400 text-xs'>{contato.number}</p>
              </div>
              <div className='ml-auto p-3'>
                <button>
                  <DotsVerticalIcon className='h-4' />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
