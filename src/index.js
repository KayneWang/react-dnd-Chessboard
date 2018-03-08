import React from 'react'
import ReactDom from 'react-dom'
import Board from './components/Board'
import { observe } from './components/Game'

const rootEl = document.getElementById('app')

observe(knightPosition => ReactDom.render(<Board knightPosition={knightPosition} />, rootEl))