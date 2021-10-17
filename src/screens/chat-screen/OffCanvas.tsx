import { createContext, FC, useContext, useRef, useState } from 'react';

interface Props {
  open: (Componet: () => JSX.Element, cb?: (data: any) => void) => void;
  close: (data: any) => void
}

export const OffCanvasContext = createContext<Props>({} as Props);

export function OffCanvas({ children }: any) {
  const [show, setShow] = useState(false);
  const [Component, setComponent] = useState<FC>(() => DefaultComponent);
  const [callback, setCallback] = useState<(data: any) => void>();

  function open(_Component: () => JSX.Element, cb = (data: any) => {}) {
    setCallback(() => cb);
    setShow(true);
    setComponent(() => _Component);
  }

  function close(data = null) {
    setShow(false);
    if(callback) {
        callback(data)
    }
  }

  return (
    <OffCanvasContext.Provider value={{ open, close }}>
      {show && (
        <div
          onClick={() => close(null)}
          style={{ backgroundColor: '#00000030' }}
          className='z-50 absolute left-0 top-0 bottom-0 right-0'></div>
      )}
      <div
        className={`${
          show ? 'right-0' : '-right-72'
        } transition-all absolute shadow bg-white z-50 top-0 bottom-0 w-72`}>
        {show && <Component />}
      </div>
      {children}
    </OffCanvasContext.Provider>
  );
}

export function useOffCanvas() {
  const ctx = useContext(OffCanvasContext);

  return ctx;
}

export const DefaultComponent = () => <p>default</p>;
