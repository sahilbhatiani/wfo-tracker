import firebase from "firebase/compat/app";
import { FirestoreDataConverter, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"; 

export const datesConvertor: FirestoreDataConverter<Map<string, Array<number>>> = {
    toFirestore: (leaveDates: Map<string, Array<number>>) => {
        const customFirstoreObj: { [key: string]: Array<number> } = {};
        leaveDates.forEach((dates: Array<number>, monthYear:string) => {
            customFirstoreObj[monthYear] = dates;
        })
        return customFirstoreObj;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options: firebase.firestore.SnapshotOptions) => {
        const firestoreData = snapshot.data(options);
        if (!firestoreData) {
            // Return a default value or handle the case where data is not present
            return new Map<string, Array<number>>();
        }
        var leaveDates: Map<string, Array<number>> = new Map();
        for (const monthYear in firestoreData) {
                leaveDates.set(monthYear, firestoreData[monthYear]);
            }
        return leaveDates;
    } 
};