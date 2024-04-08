import React from 'react';
import { Ball, BallMaybe } from './ball.component';

export default function Square({ isActivated, item, onClick }) {

    function ball(ballprop) {
        if (!ballprop) {
            return null;
        }
        return ballprop.isPresentItem() ? <Ball color={ballprop.color} /> : <BallMaybe color={ballprop.color} />;
    }

    const activeStyle = isActivated ? 'square-active' : ''
    return (
        <div className={`square  ${activeStyle}`}
            onClick={onClick}>
            {ball(item)}
        </div>
    );
};