import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import VideoUpload from '../components/VideoUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Faceless Social Tool</h1>
          {/* Add VideoUpload component here once created */}
        </Card>
      </div>
    </div>
  )
}

export default App