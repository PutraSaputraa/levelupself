export function getFirebaseErrorMessage(error, action = 'Firebase') {
  const code = error?.code ?? ''

  const messages = {
    'auth/configuration-not-found':
      'Firebase Authentication belum dikonfigurasi. Aktifkan Email/Password di Firebase Console > Authentication > Sign-in method.',
    'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan login.',
    'auth/invalid-credential': 'Email atau password tidak cocok.',
    'auth/invalid-email': 'Format email belum valid.',
    'auth/weak-password': 'Password terlalu lemah. Gunakan minimal 6 karakter.',
    'auth/network-request-failed': 'Koneksi ke Firebase gagal. Cek internet atau konfigurasi project.',
    'permission-denied':
      'Akses Firestore ditolak. Pastikan rules Firestore sudah sesuai dan user sedang login.',
  }

  return messages[code] ?? `${action} gagal: ${error?.message ?? 'Terjadi error.'}`
}
