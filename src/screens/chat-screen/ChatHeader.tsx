import { DotsVerticalIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Suporte } from '../../interfaces';

export function ChatHeader({ id }: any) {
  const [suporte, setSuporte] = useState<Suporte>({} as Suporte);

  useEffect(() => {
    loadSuporte();
  }, [id]);

  async function loadSuporte() {
    try {
      const { data } = await axios.get(`suportes/${id}`);

      setSuporte(data);
    } catch (error) {}
  }

  if (!suporte.id) {
    return null;
  }

  return (
    <div className='bg-white shadow-sm items-center flex flex-row h-16  px-6'>
      <div className='mr-3 cursor-pointer'>
          {suporte.image_url ? (
        <img
          className='w-10 rounded-full'
          src={suporte.image_url}
          alt=''
        />) : <div className="w-10 h-10 bg-gray-400 rounded-full" />}
      </div>
      <div>
        <h1>{suporte.pushname}</h1>
        <div className='text-xs text-gray-500'>Online</div>
      </div>
      <div className='cursor-pointer ml-auto transition-all p-3 rounded-full hover:bg-gray-100'>
        <DotsVerticalIcon className='w-5' />
      </div>
    </div>
  );
}
