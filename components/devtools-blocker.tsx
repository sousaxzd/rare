'use client'

import { useEffect } from 'react'
import disableDevtool from 'disable-devtool'

export function DevToolsBlocker() {
    useEffect(() => {
        disableDevtool()
    }, [])

    return null
}
