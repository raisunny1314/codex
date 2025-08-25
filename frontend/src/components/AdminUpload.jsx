import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient'

function AdminUpload() {

  const { problemId } = useParams();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0];

    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset(); // Reset form after successful upload

    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FA] font-sans">
      <div className="w-full max-w-lg animate-[fadeIn_0.5s_ease-in-out]">
        <div className="card bg-white shadow-lg border border-gray-200/80 rounded-2xl">
          <div className="card-body p-8 sm:p-10">
            <h2 className="card-title text-3xl font-bold text-gray-900 mb-6 justify-center">
              Upload Video
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-gray-600">Choose video file (Max 100MB)</span>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  {...register('videoFile', {
                    required: 'Please select a video file',
                    validate: {
                      isVideo: (files) => {
                        if (!files || !files[0]) return 'Please select a video file';
                        const file = files[0];
                        return file.type.startsWith('video/') || 'Please select a valid video file';
                      },
                      fileSize: (files) => {
                        if (!files || !files[0]) return true;
                        const file = files[0];
                        const maxSize = 100 * 1024 * 1024; // 100MB
                        return file.size <= maxSize || 'File size must be less than 100MB';
                      }
                    }
                  })}
                  className={`file-input file-input-bordered w-full bg-gray-50 border-gray-300 text-gray-800 focus:border-gray-500 focus:outline-none ${errors.videoFile ? 'border-red-500' : ''}`}
                  disabled={uploading}
                />
                {errors.videoFile && (
                  <label className="label">
                    <span className="label-text-alt text-red-600 mt-1">{errors.videoFile.message}</span>
                  </label>
                )}
              </div>

              {selectedFile && !uploading && !uploadedVideo && (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">
                  <div>
                    <h3 className="font-bold text-gray-800">Selected File:</h3>
                    <p className="text-sm break-all">{selectedFile.name}</p>
                    <p className="text-sm font-medium">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full h-3 bg-gray-200"
                    value={uploadProgress}
                    max="100"
                  ></progress>
                </div>
              )}

              {errors.root && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                  <span>{errors.root.message}</span>
                </div>
              )}

              {uploadedVideo && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                  <div>
                    <h3 className="font-bold">Upload Successful!</h3>
                    <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
                    <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="card-actions justify-end pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`btn w-full h-12 bg-gray-800 hover:bg-gray-900 text-white font-bold text-base transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${uploading ? 'loading' : ''}`}
                >
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


export default AdminUpload;