import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import auth from "./firebase"

const AuthForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignInWithEmail = async () => {
        try{
        const userCred = await signInWithEmailAndPassword(auth, email, password)
        }catch(err){
            console.log(err)
        }
    }

    const handlePasswordReset = async () => {
        sendPasswordResetEmail(auth, email)
        .then(() =>
            console.log("Password reset email sent!")
        )
        .catch((error) => {
            console.log(error.message)
        })
    }

    return (
        <div className="flex flex-col items-center">
            <span className="flex gap-2">
                <label>Email</label>
                <input className="border-2" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </span>
            <span className="flex gap-2">
                <label>Password</label>
                <input className="border-2" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </span>
            <span className="mt-2 gap-10 flex">
                <button className="border-2" onClick={handleSignInWithEmail}>Sign in</button>
                <button className="border-2" onClick={handlePasswordReset}>Reset password</button>
            </span>

        </div>
    )
}


export default AuthForm;