/**
 * Tenant Storage Service
 * يخزّن بيانات النسخ المباعة في localStorage على جهاز المالك
 * لا يحتاج Firestore أو أي أذونات خارجية
 */

import type { Tenant } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const CURRENT_APP_DB_ID = (firebaseConfig as any).firestoreDatabaseId ?? 'default';

export async function getAllTenants(): Promise<Tenant[]> {
  const q = query(collection(db, 'tenants'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tenant));
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const docRef = doc(db, 'tenants', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Tenant;
  }
  return null;
}

export async function createTenant(data: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> {
  const docRef = await addDoc(collection(db, 'tenants'), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...data, createdAt: new Date().toISOString() } as Tenant;
}

export async function updateTenant(id: string, data: Partial<Omit<Tenant, 'id' | 'createdAt'>>): Promise<Tenant | null> {
  const docRef = doc(db, 'tenants', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  return getTenantById(id);
}

export async function deleteTenant(id: string): Promise<boolean> {
  const docRef = doc(db, 'tenants', id);
  await deleteDoc(docRef);
  return true;
}

export async function getCurrentTenant(): Promise<Tenant | null> {
  const tenants = await getAllTenants();
  return tenants.find((t) => t.dbId === CURRENT_APP_DB_ID) ?? null;
}
