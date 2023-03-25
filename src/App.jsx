import EditorContainer from "./components/containers/EditorContainer"
import { auth, db, sendDoc } from "./app/firebaseApp";
import { useAuthState, useSignInWithGoogle, useSignOut } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore'


function App() {




    return (
        <>
            <div className="container">
                <EditorContainer />
            </div>
        </>
    )
}

export default App
