import { Message } from '../interfaces';
import { DateTime } from 'luxon';
import { useState } from 'react';

import { XIcon, DownloadIcon, DocumentTextIcon } from '@heroicons/react/solid';

type Props = {
  message: Message;
  changedDate?: boolean;
};
<svg
  xmlns='http://www.w3.org/2000/svg'
  className='h-6 w-6'
  fill='none'
  viewBox='0 0 24 24'
  stroke='currentColor'>
  <path
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth={2}
    d='M6 18L18 6M6 6l12 12'
  />
</svg>;

export function MessageItem({ message, changedDate = true }: Props) {
  const [full, setFull] = useState(false);

  const currentDate = DateTime.fromMillis(message.timestamp * 1000).toFormat(
    'dd/MM/yyyy'
  );
  const hoje = DateTime.local().toFormat('dd/MM/yyyy');
  const ontem = DateTime.local().minus({ days: 1 }).toFormat('dd/MM/yyyy');

  const dateString =
    currentDate === hoje
      ? 'HOJE'
      : currentDate == ontem
      ? 'ONTEM'
      : currentDate;

  return (
    <div className='flex flex-col px-12'>
      {changedDate && (
        <div className='mx-auto mt-2 text-gray-800 text-xs bg-green-50 py-2 rounded shadow px-3'>
          {dateString}
        </div>
      )}
      <div
        style={{ minWidth: '150px' }}
        className={`p-3 text-sm max-w-md ${
          message.fromMe ? 'ml-auto bg-green-50' : 'mr-auto bg-white'
        } mx-5 my-1 rounded-t-lg rounded-l-lg  shadow-sm`}>
        {message.hasMedia && message.type === 'image' && (
          <div
            style={{ backgroundColor: full ? '#000000ee' : 'transparent' }}
            className={`${
              full &&
              'z-100 pt-16 pb-3 fixed flex items-center justify-center overflow-y-scroll left-0 top-0 bottom-0 right-0'
            }`}>
            {full && (
              <div
                style={{ backgroundColor: '#000000dd' }}
                className='absolute flex top-0 h-14 bg-white left-0 right-0'>
                <button onClick={() => setFull(false)} className='ml-auto px-3'>
                  <XIcon className='text-gray-400 w-5' />
                </button>
              </div>
            )}
            <img
              onClick={() => setFull(true)}
              className={`${!full && 'rounded-lg'} max-h-full cursor-pointer`}
              src={`http://${process.env.REACT_APP_API}/api/v1/media/${message.id._serialized}`}
              alt=''
            />
          </div>
        )}
        {message.hasMedia && message.type === 'ptt' && (
          <audio controls>
            <source
              src={`http://${process.env.REACT_APP_API}/api/v1/media/${message.id._serialized}`}
            />
          </audio>
        )}
        {message.type === 'chat' && (
          <div>{message.body.split('\n').map((p, index) => (
            <p key={index} dangerouslySetInnerHTML={{__html: p.replace(/\*([^\*]*)\*/g, "<b>$1</b>")}}></p>
          ))}</div>
        )}
        {message.type === 'document' && (
          <div className='flex items-center bg-gray-50 p-2'>
            <div>
              <DocumentTextIcon className='text-gray-500 w-6' />
            </div>
            <div className='text-gray-800'>{message.body}</div>
            <div className='ml-auto pl-3'>
              <a
                target='_blank'
                href={`http://${process.env.REACT_APP_API}/api/v1/media/${message.id._serialized}`}
                className='border p-2 rounded-full'>
                <DownloadIcon className='text-gray-600 w-4 h-4' />
              </a>
            </div>
          </div>
        )}
        {message.type === 'location' && (
          <a
            target='_blank'
            href={`https://www.google.com.br/maps/@${message.location.latitude},${message.location.longitude},15z`}>
            <img
              className='rounded'
              src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${message.location.longitude},${message.location.latitude},10,0/400x200?access_token=pk.eyJ1Ijoid2FyZ2FzdGVpeGVpcmEiLCJhIjoiY2tqcGtvemR1MGZxNzJ0cDV0bHVma2wxYyJ9.rF2xlSh2R8iqTLRLUfwfrg`}
              alt=''
            />
          </a>
        )}
        {message.type === 'vcard' && (
          <div className='cursor-pointer'>
            <span className='text'>
              {extractVcard(message.vCards[0]).number}
            </span>{' '}
            <br />
            <span className='text-gray-400 text-sm'>
              {extractVcard(message.vCards[0]).name}
            </span>{' '}
            <br />
          </div>
        )}
        <div className='flex items-center justify-end mt-1'>
          <span className='text-xs text-gray-400'>
            {DateTime.fromMillis(message.timestamp * 1000).toFormat('HH:mm')}
          </span>
          {message.fromMe && <AckItem className='ml-2' ack={message.ack} />}
        </div>
      </div>
    </div>
  );
}

type AckProps = {
  ack: Number;
  className?: string;
};

export function AckItem({ className = '', ack }: AckProps) {
  if (ack === 0) {
    return (
      <svg
        viewBox='0 0 16 15'
        width='16'
        height='15'
        className={`text-gray-400 ${className}`}>
        <path
          fill='currentColor'
          d='M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z'></path>
      </svg>
    );
  }

  if (ack === 1) {
    return (
      <svg
        viewBox='0 0 16 15'
        width='16'
        height='15'
        className={`text-gray-400 ${className}`}>
        <path
          fill='currentColor'
          d='M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z'></path>
      </svg>
    );
  }

  return (
    <svg
      viewBox='0 0 16 15'
      width='16'
      height='15'
      className={`text-${ack === 2 ? 'gray-400' : 'green-300'} ${className}`}>
      <path
        fill='currentColor'
        d='M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z'></path>
    </svg>
  );
}

type vCard = {
  name: string;
  number: string;
};

export function extractVcard(vcard: string): vCard {
  return {
    name: vcard.split(':')[4]?.split('TEL')[0] || '-',
    number: vcard.split(':')[4].split('waid=')[1],
  };
}
