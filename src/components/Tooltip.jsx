import React from 'react'

const Tooltip = ({ tooltip }) => {
    return (
        <div
            className="tooltip"
            style={{
                position: "absolute",
                top: tooltip.y + 10,
                left: tooltip.x + 10,
                backgroundColor: "#f5f5dc",
                color: "black",
                padding: "5px",
                borderRadius: "5px",
                border:"1px solid black",
                fontSize:"13px"
            }}
        >
            {tooltip.text}
        </div>
    )
}

export default Tooltip