import React, { Fragment, useState, useEffect, useRef} from 'react';
import { findDOMNode } from 'react-dom'
import './board.css';

function Board(props) {
    var canvasRef = useRef(null);
    var contextRef = useRef(null);
    var canvasContext = null;
    const [isDrawing, setIsDrawing] = useState(false);

    const [sessionGen] = useState(btoa(Math.random()).substr(9, 9));
    const [holderId] = useState(props.holderId || 'react-board-holder-'+sessionGen);
    const [boardId] = useState(props.boardId || 'react-board-canvas-'+sessionGen);

    useEffect(() => {
        //Initializing
        const canvas = canvasRef.current;
        let holderStyle = window.getComputedStyle(document.getElementById(holderId));
        let verticalPadding = parseInt(holderStyle.paddingTop) + parseInt(holderStyle.paddingBottom);
        let horizontalPadding = parseInt(holderStyle.paddingLeft) + parseInt(holderStyle.paddingRight);

        canvas.width =  (document.getElementById(holderId).clientWidth - horizontalPadding) * 2;
        canvas.height =  (document.getElementById(holderId).clientHeight - verticalPadding) * 2;
        canvas.style.width =  `${(document.getElementById(holderId).clientWidth - horizontalPadding)}px`;
        canvas.style.height =  `${(document.getElementById(holderId).clientHeight - verticalPadding)}px`;

        console.log('Height Width', canvas.style.width, canvas.style.height)
        console.log('Style Height Width', canvas.style.width, canvas.style.height)
        
        canvasContext = canvas.getContext('2d');

        canvasContext.lineJoin = 'round';
        canvasContext.lineCap = 'round';
        canvasContext.strokeStyle = '#000';
        canvasContext.lineWidth = 2;
        canvasContext.scale(2, 2);
        contextRef.current = canvasContext;
    }, []);

    const startDrawing = ({nativeEvent}) => {
        console.log('Event', nativeEvent);
        const {offsetX, offsetY} = nativeEvent;
        console.log('Offsets', offsetX, offsetY)
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    }

    const endDrawing = ({nativeEvent}) => {
        contextRef.current.closePath();
        setIsDrawing(false);
    }

    const draw = ({nativeEvent}) => {
        if (isDrawing) {
            const {offsetX, offsetY} = nativeEvent; 
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
        }
    }

    return (
        <Fragment>
            <div id={holderId} className={'react-board-holder' + (props.boardHolderClassName || '')}>
                <canvas 
                    id={boardId} 
                    ref={canvasRef}
                    className={'react-board' + (props.boardClassName || '')}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    onMouseMove={draw}
                    >
                </canvas>
            </div>
        </Fragment>
    );
}

export default Board;
