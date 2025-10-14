import { useState } from 'react';

import FormViewer from './pages/FormViewer';
import MultiImageUploadTest from './pages/MultiImageUploadTest';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'formviewer' | 'multiupload'>('formviewer');

  return (
    <div className="App">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('multiupload')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'multiupload'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                📸 Multi-Image Upload
              </button>
              <button
                onClick={() => setActiveTab('formviewer')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'formviewer'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                📋 Form Viewer
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {activeTab === 'multiupload' && <MultiImageUploadTest />}
        {activeTab === 'formviewer' && <FormViewer />}
      </main>
    </div>
  );
}

export default App;
