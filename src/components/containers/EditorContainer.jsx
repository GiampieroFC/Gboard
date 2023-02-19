import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import { changeColor, changeFontSize, changeFont, changeGlow } from "../../features/textBox/textBoxSlice.js";
import JSConfetti from "js-confetti";

let nInter
const jsConfetti = new JSConfetti()
function EditorContainer() {

    const { color, fontSize, font, glow } = useSelector((state) => state.textBox)

    const dispatch = useDispatch()

    function handlerColorGlow(color, glow) {
        dispatch(changeColor(color))
        dispatch(changeGlow(glow))
        window.localStorage.setItem('color', color)
        window.localStorage.setItem('glow', glow)
        document.getElementsByTagName('textarea')[0].style.textShadow = `0px 0px ${glow}px ${color}`
        document.getElementsByTagName('textarea')[0].style.color = color
    }

    function handlerFontSize(fontSize) {
        dispatch(changeFontSize(fontSize))
        window.localStorage.setItem('fontSize', fontSize)
        document.getElementsByTagName('textarea')[0].style.fontSize = `${fontSize}px`
    }

    function handlerFont(font) {
        dispatch(changeFont(font))
        window.localStorage.setItem('font', font)
        document.getElementsByTagName('textarea')[0].style.fontFamily = `${font}`
    }


    useEffect(() => {
        const textContentStorage = window.localStorage.getItem('textContent')

        const colorStorage = window.localStorage.getItem('color')
        const glowStorage = window.localStorage.getItem('glow')
        const fontSizeStorage = window.localStorage.getItem('fontSize')
        const fontStorage = window.localStorage.getItem('font')
        const studentStorage = window.localStorage.getItem('student')
        const formatStorage = window.localStorage.getItem('format')


        if (textContentStorage) {
            document.querySelector('textarea').value = textContentStorage;
        }
        if (studentStorage) {
            document.querySelector('#student').value = studentStorage;
        }
        if (formatStorage) {
            document.querySelector('#format').value = formatStorage
        }
        if (fontSizeStorage) {
            handlerFontSize(fontSizeStorage)
        } else {
            handlerFontSize(fontSize)
        }
        if (fontStorage) {
            handlerFont(fontStorage)
        }
        if (colorStorage) {
            handlerColorGlow(colorStorage, glowStorage)
        } else {
            handlerColorGlow(color, glow)
        }


    }, [])

    function copy() {
        navigator.clipboard.writeText(document.querySelector('textarea').value)
    }

    function download() {
        let date = new Date(Date.now()).toISOString().split('T')[0]
        const format = document.querySelector('#format').value

        const rgx = /[a-z0-9 -]*/ig
        const student = document.querySelector('#student')
            .value
            .match(rgx)
            .join('')
            .toLowerCase()
            .replace(/\s{1,}|-{1,}/g, ' ')
            .trim()
            .replace(/\s{1,}|-{1,}/g, '-')

        const textToWrite = document.querySelector('textarea').value;
        const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
        const fileNameToSaveAs = `${date}-${student || 'apuntes'}${format}`;
        const downloadLink = document.createElement("a");

        downloadLink.download = fileNameToSaveAs;
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);

        const destroyClickedElement = (event) => { document.body.removeChild(event.target) }
        document.body.appendChild(downloadLink);
        downloadLink.onclick = destroyClickedElement;

        downloadLink.click();
    }


    function save() {
        window.localStorage.setItem("textContent", document.querySelector('textarea').value)
    }

    function handlerWheelFontSize(e) {
        if (e.deltaY < 0) {
            let fontSize = parseInt(e.target.value) + 4
            handlerFontSize(fontSize)
        }
        if (e.deltaY > 0) {
            let fontSize = parseInt(e.target.value) - 4
            fontSize < 8 ? fontSize = 8 : fontSize
            handlerFontSize(fontSize)
        }
    }
    function handlerWheelGlow(e) {
        if (e.deltaY < 0) {
            let glow = parseInt(e.target.value) + 2
            glow > 100 ? glow = 100 : glow
            handlerColorGlow(color, glow)
        }
        if (e.deltaY > 0) {
            let glow = parseInt(e.target.value) - 2
            glow < 0 ? glow = 0 : glow
            handlerColorGlow(color, glow)
        }
    }


    function handlerParty(e) {

        if (e.target.checked) {
            nInter = setInterval(() => {
                jsConfetti.addConfetti({
                    emojis: ['🎉', '🥳', '👍', document.querySelector('#student').value],
                    emojiSize: 25,
                    confettiNumber: 5,
                })

                const genRanHex = () => [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
                handlerColorGlow(`#${genRanHex()}`, 100)
            }, 300)

        } else {
            jsConfetti.clearCanvas()
            clearInterval(nInter)
        }

    }

    function clean() {
        clearInterval(nInter)
        localStorage.clear()
        window.location.reload()
    }

    return (
        <>
            <div className="controlsContainer">

                <input className="controls"
                    type="text"
                    name="student"
                    id="student"
                    autoComplete="on"
                    onChange={(e) => window.localStorage.setItem('student', e.target.value)}
                />

                <input className="controls"
                    type="number"
                    min="8"
                    step="1"
                    onWheel={handlerWheelFontSize}
                    value={fontSize}
                    onChange={e => handlerFontSize(e.target.value)}
                />

                <input className="controls"
                    type="color"
                    id="color"
                    value={color}
                    onChange={(e => handlerColorGlow(e.target.value, glow))}
                />
                <input className="controls"
                    type="number"
                    min="0"
                    max="100"
                    onWheel={handlerWheelGlow}
                    value={glow}
                    onChange={e => handlerColorGlow(color, e.target.value)}
                />

                <select className="controls" value={font} onChange={(e) => handlerFont(e.target.value)} name="font" id="font">
                    <option value='"Lucida Console", Courier, monospace'>"Lucida Console", Courier, monospace</option>
                    <option value='math'>math</option>
                    <option value='fantasy'>fantasy</option>
                    <option value='emoji'>emoji</option>
                    <option value='Verdana, Arial, Helvetica, sans-serif'>Verdana, Arial, Helvetica, sans-serif</option>
                    <option value='cursive'>cursive</option>
                </select>

                <span>
                    <input type="checkbox" name="party" id="party" onClick={(e) => handlerParty(e)} />
                    <label htmlFor="party">🥳🎉</label>
                </span>



                <button className="controls" onClick={copy}>Copy</button>

                <button className="controls" onClick={save}>Save</button>

                <button className="controls" onClick={clean}>Clean</button>

                <select onChange={(e) => window.localStorage.setItem('format', e.target.value)} className="controls" name="format" id="format">
                    <option value=".txt">.txt</option>
                    <option value=".md">.md</option>
                    <option value=".csv">.csv</option>
                    <option value=".json">.json</option>
                    <option value=".html">.html</option>
                    <option value=".xml">.xml</option>
                </select>

                <button className="controls" onClick={download}>Download</button>
            </div>
            <textarea
                onChange={save}
                autoFocus="on"
                autoCorrect="on"
                spellCheck
                autoCapitalize="sentences"
                wrap="hard"
            />
        </>
    )
}

export default EditorContainer