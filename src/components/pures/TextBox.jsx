function TextBox({ dfv }) {
    return (
        <textarea autoFocus autoCorrect="on" spellCheck wrap="hard" defaultValue={dfv} />
    )
}

export default TextBox