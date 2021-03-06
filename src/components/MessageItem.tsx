import { Message } from '../interfaces';
import { DateTime } from 'luxon';
import {
  LegacyRef,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  XIcon,
  DownloadIcon,
  DocumentTextIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/solid';
import { ChatContext } from '../screens/chat-screen/ChatContext';

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
          <MessageImage message={message} />
        )}
        {message.hasMedia && message.type === 'ptt' && (
          <MessageAudio message={message} />
        )}
        {message.type === 'chat' && (
          <div>
            {message.body.split('\n').map((p, index) => (
              <p
                key={index}
                dangerouslySetInnerHTML={{
                  __html: p.replace(/\*([^\*]*)\*/g, '<b>$1</b>'),
                }}></p>
            ))}
          </div>
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
          d='M9.75 7.713H8.244V5.359a.5.5 0 0 0-.5-.5H7.65a.5.5 0 0 0-.5.5v2.947a.5.5 0 0 0 .5.5h.094l.003-.001.003.002h2a.5.5 0 0 0 .5-.5v-.094a.5.5 0 0 0-.5-.5zm0-5.263h-3.5c-1.82 0-3.3 1.48-3.3 3.3v3.5c0 1.82 1.48 3.3 3.3 3.3h3.5c1.82 0 3.3-1.48 3.3-3.3v-3.5c0-1.82-1.48-3.3-3.3-3.3zm2 6.8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2v3.5z'></path>
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

export function MessageAudio({ message }: { message: Message }) {
  const [paused, setPaused] = useState(false);
  const [position, setPosition] = useState(0);
  const [canPlay, setCanPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { audioVelocidade, setAudioVelocidade } = useContext(ChatContext)

  useEffect(() => {
    if(audioRef.current) {
      audioRef.current.playbackRate = audioVelocidade
    }
  }, [audioVelocidade])
  
  function handlerPlay() {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setPaused(false);
      } else {
        audioRef.current.pause();
        setPaused(true);
      }
    }
  }

  function handlerTimeUpdate() {
    if (audioRef.current) {
      const { currentTime = 0, duration = 0 } = audioRef.current;
      setPosition(currentTime / duration);
    }
  } 

  function handleCanPlay(ev: any) {
    setCanPlay(true)
  }

  function handlerSetVelocidade() {
    switch(audioVelocidade) {
      case 1: 
        setAudioVelocidade(1.5)
        break;
      case 1.5:
        setAudioVelocidade(2)
        break;
      default:
        setAudioVelocidade(1)
        break
    }
  }

  return (
    <div>
      <div className='flex items-center w-60'>
        <button onClick={handlerPlay}>
          {(!audioRef.current?.paused && canPlay) && <PauseIcon className='w-9 text-gray-300' />}
          {(audioRef.current?.paused || !canPlay) && <PlayIcon className='w-9 text-gray-300' />}
        </button>
        <div className='flex-1 ml-2'>
          <div className='h-1 bg-gray-300 relative rounded-full'>
            <div 
              style={{
                top: -4,
                left: `${position * 95}%`,
              }}
              className={`bg-${canPlay ? 'blue' : 'gray'}-400 w-3 h-3 transition-all absolute   rounded-full`}></div>
          </div>
        </div>
        <div className={`ml-3 ${!canPlay && 'hidden'}`}>
          <button 
            onClick={handlerSetVelocidade}
            className="text-xs w-10 flex justify-center items-center bg-gray-400 text-white px-3 rounded-full shadow-xs">
            {audioVelocidade}x
          </button>
        </div>
      </div>
      <audio
        onCanPlay={handleCanPlay}
        ref={audioRef}
        onTimeUpdate={handlerTimeUpdate}
        controls={false}
        preload='none'>
        <source
          src={`http://${process.env.REACT_APP_API}/api/v1/media/${message.id._serialized}`}
        />
      </audio>
    </div>
  );
}

export function MessageImage({ message }: { message: Message }) {
  const [full, setFull] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [src, setSrc] = useState('');

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio > 0) {
              setSrc(
                `http://${process.env.REACT_APP_API}/api/v1/media/${message.id._serialized}`
              );
            }
          });
        },
        {
          threshold: [1, 0.1],
        }
      );

      observer.observe(imageRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [imageRef]);

  function handlerLoadImage() {
    setLoading(false);
  }

  function handlerError() {
    if (src !== '') {
      setError(true);
    }
  }

  return (
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
      {loading && (
        <div className='p-12'>
          <div className='loading w-6 h-6 border-green-600'></div>
        </div>
      )}
      {error && src !== '' && (
        <div className='p-12'>
          <div>ERROR</div>
        </div>
      )}
      <img
        ref={imageRef}
        onLoad={handlerLoadImage}
        onError={handlerError}
        onClick={() => setFull(true)}
        className={`${!full && 'rounded-lg'} ${
          loading && 'hidden'
        } max-h-full cursor-pointer`}
        src={src}
        alt=''
      />
    </div>
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
