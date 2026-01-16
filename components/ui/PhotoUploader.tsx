"use client";

import { useState, useCallback, useRef } from "react";

export interface UploadedPhoto {
    id: string;
    file: File;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'done' | 'error';
    url?: string;
    error?: string;
}

interface PhotoUploaderProps {
    maxFiles?: number;
    maxSizeMB?: number;
    onPhotosChange: (photos: UploadedPhoto[]) => void;
    disabled?: boolean;
}

export function PhotoUploader({
    maxFiles = 5,
    maxSizeMB = 5,
    onPhotosChange,
    disabled = false
}: PhotoUploaderProps) {
    const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback((files: FileList | File[]) => {
        if (disabled) return;

        setError(null);
        const fileArray = Array.from(files);

        // Validate files
        const validFiles: File[] = [];
        const errors: string[] = [];

        fileArray.forEach(file => {
            const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
            const isValidSize = file.size <= maxSizeMB * 1024 * 1024;

            if (!isValidType) {
                errors.push(`"${file.name}" desteklenmeyen format`);
            } else if (!isValidSize) {
                errors.push(`"${file.name}" ${maxSizeMB}MB'dan büyük`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            setError(errors.join(', '));
        }

        const newPhotos: UploadedPhoto[] = validFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: 'pending',
        }));

        const remainingSlots = maxFiles - photos.length;
        const photosToAdd = newPhotos.slice(0, remainingSlots);

        if (newPhotos.length > remainingSlots) {
            setError(`En fazla ${maxFiles} fotoğraf yükleyebilirsiniz`);
        }

        const updatedPhotos = [...photos, ...photosToAdd];
        setPhotos(updatedPhotos);
        onPhotosChange(updatedPhotos);
    }, [photos, maxFiles, maxSizeMB, onPhotosChange, disabled]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
    }, [handleFiles, disabled]);

    const removePhoto = useCallback((id: string) => {
        const photoToRemove = photos.find(p => p.id === id);
        if (photoToRemove) {
            URL.revokeObjectURL(photoToRemove.preview);
        }
        const updatedPhotos = photos.filter(p => p.id !== id);
        setPhotos(updatedPhotos);
        onPhotosChange(updatedPhotos);
    }, [photos, onPhotosChange]);

    const handleClick = () => {
        if (!disabled) inputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {error}
                </div>
            )}

            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${disabled
                        ? 'cursor-not-allowed opacity-50 border-gray-200 dark:border-gray-700'
                        : 'cursor-pointer'
                    } ${isDragging
                        ? 'border-accent bg-accent/5 scale-[1.02] shadow-xl shadow-accent/10'
                        : 'border-gray-300 dark:border-gray-700 hover:border-accent/50 hover:bg-gray-50 dark:hover:bg-[#22303e]'
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                    disabled={disabled}
                />

                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${isDragging
                        ? 'bg-accent text-white scale-110 shadow-lg shadow-accent/30'
                        : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                    <span className={`material-symbols-outlined text-4xl ${isDragging ? 'text-white animate-bounce' : 'text-blue-500'
                        }`}>
                        {isDragging ? 'file_download' : 'cloud_upload'}
                    </span>
                </div>

                <h4 className="font-bold text-lg text-primary dark:text-white mb-2">
                    {isDragging ? 'Bırakın!' : 'Fotoğrafları sürükleyip bırakın'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    veya dosya seçmek için tıklayın
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500">
                        <span className="material-symbols-outlined text-sm">photo_size_select_large</span>
                        Max {maxSizeMB}MB
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500">
                        <span className="material-symbols-outlined text-sm">image</span>
                        JPG, PNG, WebP
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500">
                        <span className="material-symbols-outlined text-sm">collections</span>
                        {photos.length}/{maxFiles} dosya
                    </div>
                </div>
            </div>

            {/* Preview Grid */}
            {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow"
                        >
                            <img
                                src={photo.preview}
                                alt={photo.file.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Progress Overlay */}
                            {photo.status === 'uploading' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                    <div className="w-16 h-16 relative">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle
                                                cx="32" cy="32" r="28"
                                                stroke="white"
                                                strokeWidth="4"
                                                fill="none"
                                                opacity="0.3"
                                            />
                                            <circle
                                                cx="32" cy="32" r="28"
                                                stroke="white"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeDasharray={175.93}
                                                strokeDashoffset={175.93 * (1 - photo.progress / 100)}
                                                className="transition-all duration-300"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                                            {photo.progress}%
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Error Overlay */}
                            {photo.status === 'error' && (
                                <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center text-white p-2">
                                    <span className="material-symbols-outlined text-2xl mb-1">error</span>
                                    <span className="text-xs text-center">{photo.error || 'Hata oluştu'}</span>
                                </div>
                            )}

                            {/* Delete Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                disabled={disabled}
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>

                            {/* Success Badge */}
                            {photo.status === 'done' && (
                                <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-white text-sm">check</span>
                                </div>
                            )}

                            {/* File Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs truncate font-medium">{photo.file.name}</p>
                                <p className="text-white/70 text-xs">{(photo.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
