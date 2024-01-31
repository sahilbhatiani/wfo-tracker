import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import auth from "./firebase"
import { MyButton } from "./common";
import clsx from "clsx";

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
        <div className="flex flex-col h-screen">
            <div className='flex flex-row h-12 px-4 mt-2'>
                <h1 className="flex items-center justify-center font-mono text-slate-800 text-2xl font-extrabold ">WORK FROM OFFICE TRACKER</h1>
            </div>

            {/* Sign IN/UP Tabs */}
            <div className="flex flex-col self-center my-auto border-4 w-2/3 aspect-square max-w-xl border-slate-700 rounded-t-2xl shadow-2xl">
                <div className="flex flex-row place-content-around h-12 bg-slate-700 rounded-t-md shadow-md">
                    <h1 className={clsx("flex-auto hover:cursor-pointer font-semibold flex items-center justify-center rounded-tl-2xl",
                        {'bg-slate-50 text-black hover:bg-slate-100' : isSignInComponent},
                        {'text-white bg-slate-700 border-slate-700 hover:bg-slate-500':!isSignInComponent}
                    )} onClick={() => {setIsSignInComponent(true)}}>SIGN IN </h1>
                    <h1 className={clsx("flex-auto hover:cursor-pointer font-semibold flex items-center justify-center rounded-tr-2xl",
                        {'bg-slate-50 text-black hover:bg-slate-100' : !isSignInComponent},
                        {'text-white bg-slate-700 border-slate-700 hover:bg-slate-500 hover:border-slate-500': isSignInComponent}
                    )} onClick={() => {setIsSignInComponent(false)}}>SIGN UP</h1>
                </div>
                <div className="border-2 h-full flex flex-col justify-center items-center">
                    <div className="flex flex-col">
                        <label>Email</label>
                        <input className="border-2" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div className="flex flex-col">
                        <label>Password</label>
                        <input type='password' className="border-2" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                { isSignInComponent ?
                    <div className="mt-2 gap-6 flex">
                        <MyButton className="" color='slate' onClick={handleSignInWithEmail}>Sign in</MyButton>
                        <MyButton className="" color='slate' onClick={handlePasswordReset}>Reset password</MyButton>
                    </div> 
                    :
                    <span className="mt-4 gap-10 flex">
                        <MyButton className="" color='slate' onClick={handleSignUp}>Sign Up</MyButton>
                    </span> 
                }
                </div>
            </div>
        </div>
    )
}


export default AuthForm;