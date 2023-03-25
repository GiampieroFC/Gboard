import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    color: '#7bffff',
    fontSize: '18',
    font: 'Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace',
    glow: '6',
}

export const textBoxSlice = createSlice({
    name: 'textBox',
    initialState,
    reducers: {
        changeColor: (state, color) => { state.color = color.payload },
        changeFontSize: (state, size) => { state.fontSize = size.payload },
        changeFont: (state, font) => { state.font = font.payload },
        changeGlow: (state, glow) => { state.glow = glow.payload }
    }
})

export const { changeColor, changeFontSize, changeFont, changeGlow } = textBoxSlice.actions

export default textBoxSlice.reducer