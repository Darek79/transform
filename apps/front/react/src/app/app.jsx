import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
const StyledApp = styled.div`
    // Your style here
`;
export function App() {
    const [load, setLoad] = useState(false);
    const urlRef = useRef(null);
    useEffect(() => {
        if (load) {
            fetch('/api')
                .then((response) => response.blob())
                .then((blob) => {
                    if (urlRef.current) {
                        window.URL.revokeObjectURL(urlRef.current);
                        console.log('cleared');
                    }
                    urlRef.current = window.URL.createObjectURL(blob);
                    if (blob.size) {
                        setLoad(false);
                    }
                });
        }
    }, [load]);

    function loadHanlder() {
        setLoad(true);
    }

    return (
        <StyledApp>
            <div>{`is loafing ${load}`}</div>
            <button onClick={loadHanlder}>get file</button>
            {load ? (
                <div>loading</div>
            ) : (
                <a href={urlRef.current} download="data.csv">
                    Download CSV
                </a>
            )}
        </StyledApp>
    );
}
export default App;
