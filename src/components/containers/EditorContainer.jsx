import { useState } from "react"

import TextBox from "../pures/TextBox"
import { useEffect } from "react"




function EditorContainer() {

    const [color, setColor] = useState("#ffffff")
    const [size, setSize] = useState("18")

    function handlerColor(color) {
        setColor(color)
        document.getElementsByTagName('textarea')[0].style.textShadow = `0px 0px 15px ${color}`
        document.getElementsByTagName('textarea')[0].style.color = color
    }
    function handlerSize(size) {
        setSize(size)
        document.getElementsByTagName('textarea')[0].style.fontSize = `${size}px`
    }

    useEffect(() => {
        handlerColor(color)
        handlerSize(size)
    }, [])

    function copy() {
        navigator.clipboard.writeText(document.querySelector('textarea').value)

        const textToWrite = document.querySelector('textarea').value;
        const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
        const fileNameToSaveAs = "apuntes-clase-espanol.txt";
        const downloadLink = document.createElement("a");

        downloadLink.download = fileNameToSaveAs;
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);

        const destroyClickedElement = (event) => { document.body.removeChild(event.target) }
        document.body.appendChild(downloadLink);
        downloadLink.onclick = destroyClickedElement;

        downloadLink.click();
    }


    return (
        <>
            <div className="controls">
                <input type="range" min="8" max="200" step="1" value={size} onChange={e => handlerSize(e.target.value)} />
                <input type="color" value={color} onChange={e => handlerColor(e.target.value)} />
                <button onClickCapture={copy}>Copiar</button>
            </div>
            <TextBox dfv={"\n"} />
        </>
    )
}

export default EditorContainer