import { DateTime } from 'luxon';
import { useContext, useEffect, useState } from 'react';
import { MessageItem } from '../../components/MessageItem';
import { ChatContext } from './ChatContext';

export function ChatMessages({ id }: any) {
  const [containerRef, setContainerRef] = useState<any>(null);

  const { suporte, loadingSuporte } = useContext(ChatContext);

  useEffect(() => {
    scrollBottom();
  }, [suporte.messages, loadingSuporte]);

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
        {loadingSuporte && (
          <div className="h-screen flex items-center justify-center">
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900'></div>
          </div>
        )}
        {suporte?.messages &&
          !loadingSuporte &&
          suporte.messages.map((message: any, index) => {
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
