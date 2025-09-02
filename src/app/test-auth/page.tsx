'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('test@mybodyrules.com');
  const [password, setPassword] = useState('test123');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      console.log('Sign in result:', result);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">NextAuth Test</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Session Durumu:</h2>
          <p className="text-sm text-gray-600">
            Status: <span className="font-mono">{status}</span>
          </p>
          {session && (
            <div className="mt-2 p-3 bg-green-50 rounded">
              <p className="text-sm">
                <strong>Kullanıcı:</strong> {session.user?.name || session.user?.email}
              </p>
              <p className="text-sm">
                <strong>ID:</strong> {session.user?.id}
              </p>
            </div>
          )}
        </div>

        {!session ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Şifre:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        ) : (
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Çıkış Yap
          </button>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Test Endpoint:</h3>
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/test-auth');
                const data = await response.json();
                console.log('Test endpoint response:', data);
                alert(JSON.stringify(data, null, 2));
              } catch (error) {
                console.error('Test endpoint error:', error);
                alert('Hata: ' + error);
              }
            }}
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Test Endpoint&apos;i Çağır
          </button>
        </div>
      </div>
    </div>
  );
}

