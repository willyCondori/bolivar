import React from 'react';

const QRReader = React.memo(function QRReader({
    scanning,
}) {

    return (
        <div className="qr-reader-wrap">

            {!scanning && (
                <div className="qr-placeholder">
                    📷 Cámara detenida
                </div>
            )}

            <div
                id="qr-reader"
                style={{
                    width: '100%',
                    minHeight: scanning
                        ? '320px'
                        : '0px',
                    display: scanning
                        ? 'block'
                        : 'none',
                }}
            />
        </div>
    );
});

export default QRReader;