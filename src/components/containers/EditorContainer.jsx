import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux";
import { changeColor, changeFontSize, changeFont, changeGlow } from "../../features/textBox/textBoxSlice.js";
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { auth, db, sendDoc, provider, delDoc } from "../../app/firebaseApp.js";
import JSConfetti from "js-confetti";
import { signInWithRedirect } from "firebase/auth";


const jsConfetti = new JSConfetti()

function EditorContainer() {


    const [user] = useAuthState(auth);
    const [signOut] = useSignOut(auth);

    const [value] = useCollection(collection(db, `${user?.email}`))


    const { color, fontSize, font, glow } = useSelector((state) => state.textBox)

    const textareaRef = useRef()
    const newStudentRef = useRef()
    const formatRef = useRef()
    const partyRef = useRef()
    const nInter = useRef(0)
    const selectRef = useRef()

    const dispatch = useDispatch()

    function handlerColorGlow(color, glow) {
        dispatch(changeColor(color))
        dispatch(changeGlow(glow))

        window.localStorage.setItem('color', color)
        window.localStorage.setItem('glow', glow)
        textareaRef.current.style.textShadow = `0px 0px ${glow}px ${color}`
        textareaRef.current.style.color = color
    }

    function handlerFontSize(fontSize) {
        dispatch(changeFontSize(fontSize))
        window.localStorage.setItem('fontSize', fontSize)
        textareaRef.current.style.fontSize = `${fontSize}px`
    }

    function handlerFont(font) {
        dispatch(changeFont(font))
        window.localStorage.setItem('font', font)
        textareaRef.current.style.fontFamily = `${font}`
    }


    useEffect(() => {


        // const textContentStorage = window.localStorage.getItem('textContent')

        const colorStorage = window.localStorage.getItem('color')
        const glowStorage = window.localStorage.getItem('glow')
        const fontSizeStorage = window.localStorage.getItem('fontSize')
        const fontStorage = window.localStorage.getItem('font')
        // const studentStorage = window.localStorage.getItem('student')
        const formatStorage = window.localStorage.getItem('format')


        // if (textContentStorage) {
        //     textareaRef.current.value = textContentStorage;
        // }
        {/*// if (studentStorage) {
        //     newStudentRef.current.value = studentStorage;
    // }*/}
        if (formatStorage) {
            formatRef.current.value = formatStorage
        }
        if (fontSizeStorage) {
            handlerFontSize(fontSizeStorage)
        } else {
            handlerFontSize(fontSize)
        }
        if (fontStorage) {
            handlerFont(fontStorage)
        } else {
            handlerFont(font)
        }
        if (colorStorage) {
            handlerColorGlow(colorStorage, glowStorage)
        } else {
            handlerColorGlow(color, glow)
        }


    }, [])

    function copy() {
        navigator.clipboard.writeText(textareaRef.current.value)
    }

    function download() {
        let date = new Date(Date.now()).toISOString().split('T')[0]
        const format = formatRef.current.value

        const rgx = /[a-z0-9 -]*/ig
        const student = newStudentRef.current.value
            .match(rgx)
            .join('')
            .toLowerCase()
            .replace(/\s{1,}|-{1,}/g, ' ')
            .trim()
            .replace(/\s{1,}|-{1,}/g, '-')

        const textToWrite = textareaRef.current.value;
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
        window.localStorage.setItem("student", newStudentRef.current.value)
        window.localStorage.setItem("textContent", textareaRef.current.value)
    }


    function saveDB() {


        if (!newStudentRef.current.value) {

            newStudentRef.current.focus();
            newStudentRef.current.placeholder = "NEED NAME!";
            newStudentRef.current.style.textShadow = '0px 0px 20px #FF0000';

        } else {

            sendDoc(user?.email, newStudentRef.current.value.trim(), textareaRef.current.value)

        }


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
            glow > 99 ? glow = 99 : glow
            handlerColorGlow(color, glow)
        }
        if (e.deltaY > 0) {
            let glow = parseInt(e.target.value) - 2
            glow < 0 ? glow = 0 : glow
            handlerColorGlow(color, glow)
        }
    }


    const handlerParty = () => {


        if (partyRef.current.checked) {


            nInter.current = setInterval(() => {

                const student = newStudentRef.current ? newStudentRef.current.value : '🤷‍♂️'

                jsConfetti.addConfetti({
                    emojis: ['🤓', '📖', '💃', '🕺', '🎉', '🥳', student],
                    emojiSize: 60,
                    confettiNumber: 1,
                })
            }, 50)

        } else {
            clearInterval(nInter.current)
            jsConfetti.clearCanvas()
            handlerColorGlow(color, glow)

        }

    }

    function clean() {
        textareaRef.current.value = '';


        clearInterval(nInter.current);

        if (partyRef.current) {
            partyRef.current.checked = false
        }

        handlerColorGlow(color, glow)

    }

    function handlerNew(e) {
        console.log(e.target.checked)
        setNewDoc(prev => prev = e.target.checked)
    }

    function handlerNameAndContent(e) {

        if (e.target.value === 'new') {

            newStudentRef.current.value = ''
            newStudentRef.current.disabled = false
            return
        }


        const nameAndContent = value.docs.filter((doc) => doc.id === e.target.value)[0].data()

        console.log(nameAndContent)

        newStudentRef.current.value = '❌ ' + nameAndContent.name + ' 🗑'
        textareaRef.current.value = nameAndContent.text
        newStudentRef.current.disabled = true
    }

    async function handlerDelete() {

        if (selectRef.current.value === 'new') {
            return
        }
        await delDoc(user.email, selectRef.current.value)
        newStudentRef.current.value = ''
        newStudentRef.current.disabled = false
    }

    async function logOut() {
        signOut(auth)
        newStudentRef.current.value = ''
        newStudentRef.current.disabled = false
    }

    return (
        <>
            <div className="controlsContainer">

                {/* <label className="controls" htmlFor="new">
                    {
                    newDoc 
                    ? 
                    'New student' 
                    : 
                    'New student?'
                    }
                    <input type="checkbox" name="new" id="new" onClick={handlerNew} />
                </label> */}


                {
                    user
                    &&

                    <select
                        id="users"
                        className="controls"
                        onChange={handlerNameAndContent}
                        defaultValue="new"
                        ref={selectRef}
                    >
                        <option value="new">- New doc 📄 -</option>
                        {
                            value?.docs.map((doc) => <option value={doc.id} key={doc.id}>
                                {doc.data().name}
                            </option>)
                        }
                    </select>


                }

                <input type="text" name="student"
                    className="controls"
                    ref={newStudentRef}
                    id="student"
                    autoComplete="on"
                    placeholder="Name..."
                    onChange={(e) => window.localStorage.setItem('student', e.target.value)
                    }
                    onClick={handlerDelete}
                    disabled={false}
                />


                <label className="controls" htmlFor="fontSize">🔠
                    <input
                        type="range"
                        min="8"
                        max="200"
                        step="1"
                        onWheel={handlerWheelFontSize}
                        id="fontSize"
                        value={fontSize}
                        onChange={e => handlerFontSize(e.target.value)}
                    /></label>


                <input className="controls"
                    type="color"
                    id="color"
                    value={color}
                    onChange={(e => handlerColorGlow(e.target.value, glow))}
                />


                <label className="controls" htmlFor="glow">🔆
                    <input
                        type="range"
                        min="0"
                        max="99"
                        step="1"
                        onWheel={handlerWheelGlow}
                        id="glow"
                        value={glow}
                        onChange={e => handlerColorGlow(color, e.target.value)}
                    /></label>

                <select className="controls" value={font} onChange={(e) => handlerFont(e.target.value)} id="font" name="font">
                    <option value='Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace'>Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace</option>
                    <option value='math'>math</option>
                    <option value='fantasy'>fantasy</option>
                    <option value='emoji'>emoji</option>
                    <option value='Verdana, Arial, Helvetica, sans-serif'>Verdana, Arial, Helvetica, sans-serif</option>
                    <option value='cursive'>cursive</option>
                </select>





                <button className="controls" onClick={copy}>Copy</button>


                {
                    user
                        ?
                        <>
                            <span className="controls">
                                <input type="checkbox" id="party" name="party" onClick={handlerParty} ref={partyRef} />
                                <label htmlFor="party">🥳🎉</label>
                            </span>

                            <button className="controls" onClick={saveDB}>Save</button>

                            <button className="controls" onClick={logOut}>log Out</button>
                        </>
                        :
                        <button className="controls" onClick={() => signInWithRedirect(auth, provider)}>log In</button>

                }



                <button className="controls" onClick={clean}>Clean</button>
                <button className="controls" onClick={() => console.log("support")}>suport ❤</button>

                <select onChange={(e) => window.localStorage.setItem('format', e.target.value)} className="controls" name="format" ref={formatRef}>
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
                ref={textareaRef}
                onChange={save}
                autoCorrect="on"
                spellCheck
                autoCapitalize="sentences"
                placeholder="Write here..."
                wrap="hard"
            />
        </>
    )
}

export default EditorContainer