/**
 * Super Admin Authentication
 * مصادقة مستقلة تماماً عن Firebase Auth — تعتمد على sessionStorage
 * بيانات الدخول: superadmin / F00tPrint@SuperAdmin#2025!
 * 
 * عند النجاح، يتم تسجيل دخول anonymous في Firebase Auth
 * حتى تتمكن من الكتابة في Firestore collections المحمية
 */

import { signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase';

const SUPER_ADMIN_USERNAME = 'superadmin';
const SUPER_ADMIN_PLAIN = 'F00tPrint@SuperAdmin#2025!';
const SESSION_KEY = 'sa_session_token';
const SESSION_EXPIRY_KEY = 'sa_session_expiry';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

/** Generate a random session token */
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Attempt Super Admin login
 * 1. Validates username/password locally
 * 2. Signs into Firebase anonymously (for Firestore write access)
 * 3. Stores session in sessionStorage
 */
export async function superAdminLogin(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (username.trim() !== SUPER_ADMIN_USERNAME) {
    return { success: false, error: 'اسم المستخدم غير صحيح' };
  }

  if (password !== SUPER_ADMIN_PLAIN) {
    return { success: false, error: 'كلمة المرور غير صحيحة' };
  }

  try {
    // Sign in anonymously to Firebase so Firestore rules can be satisfied
    await signInAnonymously(auth);
  } catch (err: any) {
    console.error('Firebase anonymous sign-in failed:', err);
    if (err && err.code === 'auth/admin-restricted-operation') {
      return { 
        success: false, 
        error: 'خاصية Anonymous Auth معطلة في Firebase Console. يرجى تفعيلها أولاً لتتمكن من استخدام لوحة التحكم.' 
      };
    }
    return { success: false, error: 'فشل الاتصال بـ Firebase: ' + err.message };
  }

  // Create local session
  const token = generateToken();
  const expiry = Date.now() + SESSION_DURATION_MS;
  sessionStorage.setItem(SESSION_KEY, token);
  sessionStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());

  return { success: true };
}

/** Check if Super Admin is currently logged in */
export function isSuperAdminAuthenticated(): boolean {
  const token = sessionStorage.getItem(SESSION_KEY);
  const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY);

  if (!token || !expiry) return false;
  if (Date.now() > parseInt(expiry, 10)) {
    superAdminLogout();
    return false;
  }
  return true;
}

export function ensureSuperAdminSession(): void {
  if (!isSuperAdminAuthenticated()) {
    throw new Error('Super admin session غير صالحة أو انتهت. يرجى تسجيل الدخول مرة أخرى.');
  }
}

/** Log out Super Admin — also clears Firebase anonymous session */
export async function superAdminLogout(): Promise<void> {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_EXPIRY_KEY);
  try {
    if (auth.currentUser?.isAnonymous) {
      await firebaseSignOut(auth);
    }
  } catch (err) {
    console.warn('Error signing out Firebase anonymous user:', err);
  }
}

/** Extend session (call on activity) */
export function extendSuperAdminSession(): void {
  if (isSuperAdminAuthenticated()) {
    const expiry = Date.now() + SESSION_DURATION_MS;
    sessionStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
  }
}
