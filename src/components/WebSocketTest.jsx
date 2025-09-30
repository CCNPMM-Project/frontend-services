import React, { useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

const WebSocketTest = () => {
  const { isConnected, unreadCount, notifications } = useWebSocket();
  const [testResult, setTestResult] = useState(null);

  const testWebSocket = async () => {
    try {
      const response = await fetch('http://localhost:8080/test-websocket');
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <h3 className="text-lg font-semibold mb-2">WebSocket Test</h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">Connection:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Unread Count:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            {unreadCount}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Notifications:</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
            {notifications.length}
          </span>
        </div>
        
        <button
          onClick={testWebSocket}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Test WebSocket
        </button>
        
        {testResult && (
          <div className={`p-2 rounded text-xs ${
            testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {testResult.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebSocketTest;
