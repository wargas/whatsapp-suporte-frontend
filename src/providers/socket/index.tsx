import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client'

export const SocketContex = createContext<contextProps>({} as contextProps)

export function SocketProvider({children}: any) {

    const socket = io(`ws://${process.env.REACT_APP_API}`)

    

    return (
        <SocketContex.Provider value={{socket}}>
            {children}
        </SocketContex.Provider>
    )
}

export function useSocket(): contextProps {
    const context = useContext(SocketContex)

    return context
}

export interface contextProps {
    socket: Socket
}