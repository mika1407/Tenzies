
export default function Die(props) {
    return (
        <div className="die-face">
            <button>{props.value}</button>
        </div>
    );
}