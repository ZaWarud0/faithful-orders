import React from 'react'

const Title = ({title, sub}) => {
    return (
        <div>
            <h1 className="title m">{title} <span style={{color: 'black', fontSize: '.65em'}}>{sub}</span></h1>
            <div className="title sm"><span style={{color: 'black', fontSize: '.65em'}}>{sub}</span></div>
        </div>
    )
}

export default Title
