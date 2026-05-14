import * as WebBrowser from "expo-web-browser";
import { getApps, initializeApp } from "firebase/app";
import {
    onAuthStateChanged as _onAuthStateChanged,
    signOut as _signOut,
    getAuth,
    User,
} from "firebase/auth";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

WebBrowser.maybeCompleteAuthSession();

// ── Configuración Firebase ────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBD0eIV0_U_cj43FLBTK90RiLxDiseRqfU",
  authDomain: "firstmobileapp-9f029.firebaseapp.com",
  projectId: "firstmobileapp-9f029",
  storageBucket: "firstmobileapp-9f029.firebasestorage.app",
  messagingSenderId: "883861104683",
  appId: "1:883861104683:android:c1f9e56a3f397a896da26e",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// ── Tipos ─────────────────────────────────────────────────────────
export type FirebaseUser = User;

export interface Favorite {
  movieId: number;
  title: string;
  cover_url: string;
  addedAt?: any;
}

export interface Review {
  movieId: number;
  title: string;
  rating: number;
  comment: string;
  createdAt?: any;
}

// ── AUTH ──────────────────────────────────────────────────────────
export const onAuthStateChanged = (
  callback: (user: FirebaseUser | null) => void,
) => _onAuthStateChanged(auth, callback);

export const signOut = () => _signOut(auth);

export const getCurrentUser = () => auth.currentUser;

// ── FAVORITOS ─────────────────────────────────────────────────────
const favRef = (uid: string, movieId: number) =>
  doc(db, "users", uid, "favorites", movieId.toString());

export const addFavorite = async (
  uid: string,
  movie: Omit<Favorite, "addedAt">,
) => {
  await setDoc(favRef(uid, movie.movieId), {
    ...movie,
    addedAt: serverTimestamp(),
  });
};

export const removeFavorite = async (uid: string, movieId: number) => {
  await deleteDoc(favRef(uid, movieId));
};

export const isFavorite = async (
  uid: string,
  movieId: number,
): Promise<boolean> => {
  const snap = await getDoc(favRef(uid, movieId));
  return snap.exists();
};

export const getFavorites = async (uid: string): Promise<Favorite[]> => {
  const q = query(
    collection(db, "users", uid, "favorites"),
    orderBy("addedAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Favorite);
};

// ── RESEÑAS ───────────────────────────────────────────────────────
const reviewRef = (uid: string, movieId: number) =>
  doc(db, "users", uid, "reviews", movieId.toString());

export const saveReview = async (
  uid: string,
  review: Omit<Review, "createdAt">,
) => {
  await setDoc(reviewRef(uid, review.movieId), {
    ...review,
    createdAt: serverTimestamp(),
  });
};

export const deleteReview = async (uid: string, movieId: number) => {
  await deleteDoc(reviewRef(uid, movieId));
};

export const getReview = async (
  uid: string,
  movieId: number,
): Promise<Review | null> => {
  const snap = await getDoc(reviewRef(uid, movieId));
  return snap.exists() ? (snap.data() as Review) : null;
};

export const getAllReviews = async (uid: string): Promise<Review[]> => {
  const q = query(
    collection(db, "users", uid, "reviews"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Review);
};
