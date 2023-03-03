
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'
import store from "./app/store.js";
import { Provider } from "react-redux";
import { registerSW } from 'virtual:pwa-register'

ReactDOM.createRoot(document.getElementById('root')).render(

    <Provider store={store}>
        <App />
    </Provider>,
)

const updateSW = registerSW({
    onNeedRefresh() { },
    onOfflineReady() { },
})