export interface ErrorCodeMessages {
    "auth/email-already-in-use": string;
    "auth/internal-error": string;
    "auth/invalid-credential": string;
    "auth/invalid-email": string;
    "auth/weak-password": string
  }
  
  export const errorCodes: ErrorCodeMessages = {
    "auth/email-already-in-use": "The provided email is already in use",
    "auth/internal-error": "The Authentication server encountered an unexpected error while trying to process the request",
    "auth/invalid-credential": "Invalid credentials - Sign up if you haven't",
    "auth/invalid-email": "Invalid email",
    "auth/weak-password": "Password is too weak"
  };

  export type FirebaseAuthError =
  | 'auth/email-already-in-use'
  | 'auth/internal-error'
  | 'auth/invalid-credential'
  | 'auth/invalid-email'
  | 'auth/weak-password';

  export const UNKNOWN_ERROR: string = "An unknown error has occured";
