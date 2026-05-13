import React from 'react';

const CameraPreview = React.memo(function CameraPreview({
    videoRef,
    status,
}) {

    return (
        <div className="rf-videoWrap">

            <video
                ref={videoRef}
                className="rf-video"
                playsInline
                muted
                autoPlay
            />

            {status !== 'running' && (
                <div className="rf-placeholder">
                    Vista previa
                </div>
            )}
        </div>
    );
});

export default CameraPreview;