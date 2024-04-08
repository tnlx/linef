import React from "react";

function Ball({color}) {
    return (
        <svg height="100%" width="100%" className='ball'>
            <circle cx="50%" cy="50%" r='30%' fill={color} />
        </svg>
    );
}

function BallMaybe({color}) {
    return (
        <svg height="100%" width="100%">
            <circle cx="50%" cy="50%" r='10%' fill={color} />
        </svg>
    );
}

export {Ball, BallMaybe}