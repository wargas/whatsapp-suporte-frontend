import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client'

export const SocketContex = createContext({})

export function SocketProvider({children}: any) {

    const socket = useRef<any>()

    useEffect(() => {
        socket.current = io(`ws://${process.env.REACT_APP_API}`)
    }, [])


    return (
        <SocketContex.Provider value={{}}>
            {children}
        </SocketContex.Provider>
    )
}

export function useSocket() {
    const context = useContext(SocketContex)

    return context
}