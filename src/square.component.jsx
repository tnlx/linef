import { Ball, BallMaybe } from './ball.component';

export default function Square({ activated, item, onClick }) {

    function ball(ballprop) {
        return ballprop.isPresentItem() ? <Ball color={ballprop.color} /> : <BallMaybe color={ballprop.color} />;
    }

    const activeStyle = activated ? 'square-active' : ''
    return (
        <div className={`square  ${activeStyle}`}
            onClick={onClick}>
            {item ? ball(item) : null}
        </div>
    );
}