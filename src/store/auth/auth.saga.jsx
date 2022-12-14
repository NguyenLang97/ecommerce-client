import { call, take, put, all } from 'redux-saga/effects'
import { AUTH_START, authSuccess, authFail, LOGOUT_START, logoutSuccess, logoutFail } from '../auth/auth.action'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '../../firebase/firebase_config'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

async function registerUser({ email, password, firstName, lastName }) {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'user', res.user.uid), {
            email,
            password,
            firstName,
            lastName,
            timestamp: serverTimestamp(),
        })
        return res
    } catch (error) {
        console.log('error is :', error.message)
    }
}

function loginUser({ email, password }) {
    return (
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Lay id
                // const userToken = await userCredential.user.getIdToken()

                const userID = userCredential.user.uid
                console.log('useid', userID)
                const docRef = doc(db, 'users', userID)
                const docSnap = await getDoc(docRef)
                console.log('logged')
                console.log('infor', {
                    userID,
                    user: { ...docSnap.data() },
                })
                return {
                    userID,
                    user: { ...docSnap.data() },
                }
            })
            // .then((user) => user)
            .catch((error) => {
                console.log('error :', error.message)
            })
    )
}

function logoutUser() {
    return signOut(auth)
        .then(() => {})
        .catch((error) => {
            console.log('error :', error.message)
        })
}

function* authenticate({ email, password, isRegister, firstName, lastName }) {
    let data
    try {
        if (isRegister) {
            console.log('isRegister :', isRegister)
            data = yield call(registerUser, { email, password, firstName, lastName })
            console.log('data register :', data.user.uid)
        } else {
            data = yield call(loginUser, { email, password })
            console.log('data login123 :', data)
        }
        yield put(authSuccess(data))
        return data.userID
    } catch (error) {
        yield put(authFail(error.message))
        console.log('error.message', error.message)
    }
}
function* logout() {
    try {
        yield call(logoutUser)
        console.log('logout - start')
        yield put(logoutSuccess())
    } catch (error) {
        yield put(logoutFail())
    }
}
function* authFlow() {
    while (true) {
        const { payload } = yield take(AUTH_START)
        console.log('isRegister :: ', payload.isRegister)
        const uid = yield call(authenticate, payload)
        console.log('uid :', uid)
        if (uid) {
            yield take(LOGOUT_START)
            yield call(logout)
        }
    }
}
function* Saga() {
    yield all([authFlow()])
}

export default Saga
