'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const createTestUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/test-user', {
        method: 'POST',
      });
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: 'test@test.com',
        password: 'password123',
        redirect: false,
      });
      setTestResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult(`Login Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogout = async () => {
    try {
      await signOut({ redirect: false });
      setTestResult('Logged out successfully');
    } catch (error) {
      setTestResult(`Logout Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 ทดสอบระบบการยืนยันตัวตน</h1>
        
        {/* Session Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 สถานะเซสชัน</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            {session ? (
              <>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Name:</strong> {session.user.name}</p>
                <p><strong>Primary Role:</strong> {session.user.primaryRole}</p>
                <p><strong>Available Roles:</strong> {session.user.roles?.join(', ') || 'None'}</p>
                <p><strong>Current Role:</strong> {session.user.currentRole || 'None'}</p>
                <p><strong>Status:</strong> {session.user.status}</p>
                <p><strong>Last Refresh:</strong> {session.lastRefresh ? new Date(session.lastRefresh).toLocaleString() : 'Never'}</p>
              </>
            ) : (
              <p className="text-gray-500">ไม่ได้เข้าสู่ระบบ</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🛠️ การทำงาน</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={createTestUser}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'กำลังสร้าง...' : '1. สร้างผู้ใช้ทดสอบ'}
            </button>
            
            <button
              onClick={testLogin}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'กำลังล็อกอิน...' : '2. ทดสอบล็อกอิน'}
            </button>
            
            {session && (
              <button
                onClick={testLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                3. ล็อกเอาท์
              </button>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📝 ผลการทดสอบ</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {testResult}
            </pre>
          </div>
        )}

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">⚙️ ข้อมูล Environment</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'undefined'}</p>
            <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || 'undefined'}</p>
            <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET'}</p>
            <p><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? 'SET' : 'NOT_SET'}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">📋 วิธีการทดสอบ</h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>กดปุ่ม "สร้างผู้ใช้ทดสอบ" เพื่อสร้างบัญชีผู้ใช้ทดสอบ (test@test.com / password123)</li>
            <li>กดปุ่ม "ทดสอบล็อกอิน" เพื่อทดสอบการล็อกอินด้วยบัญชีทดสอบ</li>
            <li>ตรวจสอบว่าการล็อกอินสำเร็จและข้อมูลเซสชันถูกต้อง</li>
            <li>หากยังมีปัญหา 401 error ให้ตรวจสอบ Environment Variables และ Database connection</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 