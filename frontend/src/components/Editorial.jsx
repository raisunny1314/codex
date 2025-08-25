import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Rewind, Forward, Volume2, VolumeX, Maximize } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
    const videoRef = useRef(null);
    const playerWrapperRef = useRef(null); // Ref for the main player container for fullscreen
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [volume, setVolume] = useState(1); // State for volume level (0 to 1)
    const [playbackRate, setPlaybackRate] = useState(1); // State for playback speed

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Rewind video by 10 seconds
    const handleRewind = () => {
        if (videoRef.current) {
            videoRef.current.currentTime -= 10;
        }
    };

    // Forward video by 10 seconds
    const handleForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime += 10;
        }
    };

    // Handle volume changes from the slider
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
        }
    };

    // Mute or unmute the video
    const toggleMute = () => {
        if (videoRef.current) {
            const newVolume = videoRef.current.volume === 0 ? 1 : 0;
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
        }
    };

    // Cycle through playback speeds
    const handlePlaybackRateChange = () => {
        const rates = [0.5, 1, 1.5, 2];
        const currentRateIndex = rates.indexOf(playbackRate);
        const nextRate = rates[(currentRateIndex + 1) % rates.length];
        if (videoRef.current) {
            videoRef.current.playbackRate = nextRate;
            setPlaybackRate(nextRate);
        }
    };

    // Toggle fullscreen mode
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerWrapperRef.current?.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Update current time during playback
    useEffect(() => {
        const video = videoRef.current;

        const handleTimeUpdate = () => {
            if (video) setCurrentTime(video.currentTime);
        };

        if (video) {
            video.addEventListener('timeupdate', handleTimeUpdate);
            return () => video.removeEventListener('timeupdate', handleTimeUpdate);
        }
    }, []);

    return (
        <div
            ref={playerWrapperRef}
            className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-200/80 group bg-black"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={secureUrl}
                poster={thumbnailUrl}
                onClick={togglePlayPause}
                className="w-full aspect-video cursor-pointer"
            />

            {/* Video Controls Overlay */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 transition-opacity duration-300 ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
            >
                {/* Progress Bar */}
                <div className="flex items-center gap-x-3">
                    <span className="text-white text-sm font-mono w-12 text-center select-none">
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={(e) => {
                            if (videoRef.current) {
                                videoRef.current.currentTime = Number(e.target.value);
                            }
                        }}
                        className="range range-xs flex-1 accent-gray-200"
                    />
                    <span className="text-white text-sm font-mono w-12 text-center select-none">
                        {formatTime(duration)}
                    </span>
                </div>

                {/* Main Controls Row */}
                <div className="flex items-center mt-2">
                    {/* Left Controls */}
                    <div className="flex items-center gap-x-2 w-1/3">
                        <button
                            onClick={toggleMute}
                            className="btn btn-ghost btn-circle text-white hover:bg-white/20"
                            aria-label={volume === 0 ? "Unmute" : "Mute"}
                        >
                            {volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="range range-xs w-20 accent-gray-200"
                        />
                    </div>

                    {/* Center Controls */}
                    <div className="flex-grow flex justify-center gap-x-2 w-1/3">
                        <button
                            onClick={handleRewind}
                            className="btn btn-ghost btn-circle text-white hover:bg-white/20"
                            aria-label="Rewind 10 seconds"
                        >
                            <Rewind className="w-6 h-6" />
                        </button>

                        <button
                            onClick={togglePlayPause}
                            className="btn btn-ghost btn-circle text-white hover:bg-white/20"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <Pause className="w-8 h-8" />
                            ) : (
                                <Play className="w-8 h-8" />
                            )}
                        </button>

                        <button
                            onClick={handleForward}
                            className="btn btn-ghost btn-circle text-white hover:bg-white/20"
                            aria-label="Forward 10 seconds"
                        >
                            <Forward className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center justify-end gap-x-2 w-1/3">
                        <button
                            onClick={handlePlaybackRateChange}
                            className="btn btn-ghost text-white hover:bg-white/20 text-sm font-semibold w-20"
                            aria-label={`Change playback speed. Current speed: ${playbackRate}x`}
                        >
                            {playbackRate}x
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="btn btn-ghost btn-circle text-white hover:bg-white/20"
                            aria-label="Toggle Fullscreen"
                        >
                            <Maximize className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editorial;