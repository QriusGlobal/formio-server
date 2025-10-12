import { useState } from 'react';
import { MultiImageUpload, UploadedFile } from '../components/MultiImageUpload';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function MultiImageUploadTest() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleChange = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    console.log('Uploaded files:', files);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📸 Multi-Image Upload Test</h1>
          <p className="text-gray-400">
            Test the Uppy 5.0 + TUS multi-image upload component with automatic numbering,
            compression, and metadata extraction.
          </p>
        </header>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-300">
            <li>✅ Upload up to 20 images/videos</li>
            <li>✅ TUS resumable uploads (localhost:1080)</li>
            <li>✅ Automatic numbering (Site Image 1-20)</li>
            <li>✅ 60% image compression (1920x1080 max)</li>
            <li>✅ EXIF metadata extraction (geolocation)</li>
            <li>✅ File validation (magic numbers)</li>
            <li>✅ Filename sanitization</li>
            <li>✅ Offline support (24h cache)</li>
            <li>✅ Webcam capture</li>
            <li>✅ WCAG 2.1 AA accessible</li>
          </ul>
        </div>

        <ErrorBoundary>
          <MultiImageUpload
            formKey="site_images"
            maxFiles={20}
            compressionQuality={0.8}
            autoNumbering={true}
            extractMetadata={true}
            onChange={handleChange}
            value={uploadedFiles}
          />
        </ErrorBoundary>

        {uploadedFiles.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              📊 Upload Summary ({uploadedFiles.length} files)
            </h2>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                        #
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                        Size
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                        Location
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {uploadedFiles.map((file, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 text-sm text-gray-300">{file.number}</td>
                        <td className="px-4 py-2 text-sm text-gray-300 truncate max-w-xs">
                          {file.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-300">
                          {(file.size / 1024).toFixed(1)} KB
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-300">
                          {file.latitude && file.longitude
                            ? `${file.latitude.toFixed(6)}, ${file.longitude.toFixed(6)}`
                            : 'N/A'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-300">
                          {new Date(file.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">JSON Output</h3>
                <pre className="bg-gray-900 rounded p-4 overflow-x-auto text-xs">
                  {JSON.stringify(uploadedFiles, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Technical Details</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-semibold text-gray-300">TUS Server:</dt>
              <dd className="text-gray-400">http://localhost:1080/files/</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-300">Chunk Size:</dt>
              <dd className="text-gray-400">5MB</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-300">Compression:</dt>
              <dd className="text-gray-400">80% quality, max 1920x1080px</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-300">Retry Strategy:</dt>
              <dd className="text-gray-400">0ms, 1s, 3s, 5s</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-300">Offline Cache:</dt>
              <dd className="text-gray-400">24 hours with Service Worker</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
