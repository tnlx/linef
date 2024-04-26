export default function Square({ activated, item, onClick }) {

    const activeStyle = activated ? 'square-active' : ''
    return (
        <div className={`square  ${activeStyle}`}
            onClick={onClick}>
            {item}
        </div>
    );
}