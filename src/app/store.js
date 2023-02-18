import { configureStore } from '@reduxjs/toolkit'
import textBoxSliceReducer from '../features/textBox/textBoxSlice'

export default configureStore({
    reducer: {
        textBox: textBoxSliceReducer
    }
})