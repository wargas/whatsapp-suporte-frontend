import { DateTime } from 'luxon';
import { useContext, useEffect, useState } from 'react';
import { MessageItem } from '../../components/MessageItem';
import { ChatContext } from './ChatContext';

export function ChatMessages({ id }: any) {
  const [containerRef, setContainerRef] = useState<any>(null);

  const { suporte } = useContext(ChatContext);

  useEffect(() => {
    scrollBottom();
  }, [suporte.messages]);

  function scrollBottom() {
    if (containerRef) {
      containerRef.scrollTop = containerRef.scrollHeight;
    }
  }

  
  return (
    <div
      ref={setContainerRef}
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'white' }}
      className='flex-1 overflow-y-scroll'>
      <div className='flex min-h-screen flex-col justify-end'>
        {suporte?.messages && suporte.messages.map((message: any, index) => {
          let changedDate = true;
          if (index > 0) {
            const lastMsg = suporte.messages[index - 1];

            const lastDate = DateTime.fromMillis(
              lastMsg.timestamp * 1000
            ).toSQLDate();
            const currDate = DateTime.fromMillis(
              message.timestamp * 1000
            ).toSQLDate();

            changedDate = lastDate !== currDate;
          }

          return (
            <MessageItem
              changedDate={changedDate}
              message={message}
              key={message.id._serialized}
            />
          );
        })}
      </div>
    </div>
  );
}
