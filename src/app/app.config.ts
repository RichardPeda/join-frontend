import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync('animations'), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"join-3a828","appId":"1:188028272306:web:41b7cf2e2258d188ae93ab","storageBucket":"join-3a828.appspot.com","apiKey":"AIzaSyBAZKSCxgykwzxg22qpK_nfE4Sjf4OmFqM","authDomain":"join-3a828.firebaseapp.com","messagingSenderId":"188028272306"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
