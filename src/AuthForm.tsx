import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import auth from "./firebase"
import { MyButton } from "./common";

const AuthForm = () => {
    const [isSignInComponent, setIsSignInComponent] = useState(true);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignInWithEmail = async () => {
        try{
        await signInWithEmailAndPassword(auth, email, password)
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

    const handleSignUp = async () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Signed up!")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });

    }

    return (
        <div className="flex flex-col items-center">
            { isSignInComponent ?
            <div>
                <h1>Sign In Tab</h1>
                <span className="flex gap-2">
                    <label>Email</label>
                    <input className="border-2" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </span>
                <span className="flex gap-2">
                    <label>Password</label>
                    <input className="border-2" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </span>
                <span className="mt-2 gap-10 flex">
                    <MyButton className="" color='slate' onClick={handleSignInWithEmail}>Sign in</MyButton>
                    <MyButton className="" color='slate' onClick={handlePasswordReset}>Reset password</MyButton>
                    <MyButton className="" color='slate' onClick={() => {setIsSignInComponent(false)}}>Sign Up</MyButton>
                </span> 
            </div> 
            :
            <div>
                <h2>Sign Up Tab</h2>
                <span className="flex gap-2">
                    <label>Email</label>
                    <input className="border-2" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </span>
                <span className="flex gap-2">
                    <label>Password</label>
                    <input className="border-2" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </span>
                <span className="mt-2 gap-10 flex">
                    <button className="border-2" onClick={handleSignUp}>Sign Up</button>
                    <button className="border-2" onClick={() => {setIsSignInComponent(true)}}>Sign In</button>
                </span> 
            </div>
            }
        </div>
    )
}


export default AuthForm;