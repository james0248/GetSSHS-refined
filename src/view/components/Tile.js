import React, { useEffect } from 'react'
import gsap from 'gsap'
import { image, color } from './images'

const Tile = (props) => {
    let { isNew, isMerged, rank } = props.tile
    const ref = props.forwardRef

    useEffect(() => {
        if (isNew) {
            gsap.fromTo(ref.current, { scale: 0 }, { scale: 1, duration: 0.2 })
        }
        if (isMerged) {
            gsap.fromTo(
                ref.current,
                { scale: 1 },
                {
                    scale: 1.1,
                    duration: 0.08,
                    yoyo: true,
                    repeat: 1,
                }
            )
        }
    }, [isNew, isMerged])

    let size = null
    let textColor = 'white'
    if (1 << rank < 100) {
        if (1 << rank < 8) {
            textColor = '#776E65'
        }
        size = '55px'
    } else if (1 << rank < 1000) {
        size = '45px'
    } else {
        size = '35px'
    }

    let tile = props.useImage ? (
        <div
            className="grid"
            ref={ref}
            style={{
                backgroundImage: `url(${image[rank - 1]})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}
        ></div>
    ) : (
        <div
            className="grid"
            ref={ref}
            style={{
                background: color[rank - 1],
                fontSize: size,
                color: textColor,
            }}
        >
            {' '}
            {1 << rank}{' '}
        </div>
    )
    if (rank === 0) {
        tile = <div className="empty" ref={ref}></div>
    }
    return (
        <div className="tile">
            <div className="tile-background"></div>
            {tile}
        </div>
    )
}

export default Tile
