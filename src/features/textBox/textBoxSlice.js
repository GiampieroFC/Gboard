import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    color: '#00ff00',
    fontSize: '18',
    font: '"Lucida Console", Courier, monospace',
    // textContent: '', 👇 guardarlo en el localStorage
    // format: '.txt', 
    // student: '', 
}

export const textBoxSlice = createSlice({
    name: 'textBox',
    initialState,
    reducers: {
        changeColor: (state, color) => { state.color = color.payload },
        changeFontSize: (state, size) => { state.fontSize = size.payload },
        changeFont: (state, font) => { state.font = font.payload }
    }
})

export const { changeColor, changeFontSize, changeFont } = textBoxSlice.actions

export default textBoxSlice.reducer