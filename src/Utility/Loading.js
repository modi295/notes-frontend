import React from 'react';
import { Oval } from 'react-loader-spinner'; 

function Loading() {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',  
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,  
                backdropFilter: 'blur(5px)', 
            }}
        >
            <div style={{ textAlign: 'center', color: '#fff' }}>
                {}
                <Oval
                    height={80}
                    width={80}
                    color="#ffffff"
                    ariaLabel="loading"
                    secondaryColor="#734dc4"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                />
                {/* Loading text */}
                <p style={{ marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e0e0' }}>
                    Please wait...
                </p>
            </div>
        </div>
    );
}

export default Loading;
