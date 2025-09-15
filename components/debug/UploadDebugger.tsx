'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUploads } from '@/hooks/useUploads'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const UploadDebugger: React.FC = () => {
  const { user } = useAuth()
  const { uploadsData, loading, addUploads, refetchUploadsData } = useUploads()
  const [isAddingCredits, setIsAddingCredits] = useState(false)

  const handleAddTestCredits = async () => {
    setIsAddingCredits(true)
    try {
      await addUploads(10) // Add 10 test credits
      await refetchUploadsData()
      alert('Added 10 test credits!')
    } catch (error) {
      console.error('Error adding credits:', error)
      alert('Failed to add credits')
    } finally {
      setIsAddingCredits(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Card className="p-4 mb-6 border-yellow-200 bg-yellow-50">
      <h3 className="text-lg font-semibold text-yellow-800 mb-4">
        🐛 Upload Debugger (Test Mode)
      </h3>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">User ID:</span>
            <p className="text-gray-600 break-all">{user.uid}</p>
          </div>
          <div>
            <span className="font-medium">Email:</span>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Uploads Remaining:</span>
            <p className="text-lg font-bold text-blue-600">
              {loading ? '...' : uploadsData?.uploadsRemaining ?? 0}
            </p>
          </div>
          <div>
            <span className="font-medium">Total Uploads:</span>
            <p className="text-lg font-bold text-green-600">
              {loading ? '...' : uploadsData?.totalUploads ?? 0}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleAddTestCredits}
            disabled={isAddingCredits}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            {isAddingCredits ? 'Adding...' : 'Add 10 Test Credits'}
          </Button>
        </div>

        <div className="text-xs text-gray-600">
          <p><strong>Debug Info:</strong></p>
          <p>• Can Upload: {uploadsData ? (uploadsData.uploadsRemaining > 0 ? 'Yes' : 'No') : 'Unknown'}</p>
          <p>• Loading: {loading ? 'Yes' : 'No'}</p>
          <p>• User Authenticated: {user ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </Card>
  )
}