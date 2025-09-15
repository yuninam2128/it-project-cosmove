import { auth } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

export class AuthService {
  async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  async updateUserProfile(displayName, photoURL) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}