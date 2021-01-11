import React, { useState, useRef, useEffect } from 'react'
import { gsap, TimelineMax } from 'gsap'
import Tile from './Tile'
import Cover from './Cover'
import GameManager from '../../game/game-manager'

const game = new GameManager(4)
const keyMap = {
    38: 0, // Up
    87: 0, // W
    37: 1, // Left
    65: 1, // A
    40: 2, // Down
    83: 2, // S
    39: 3, // Right
    68: 3, // D
}

let imageSize = 0
let tileGap = 0
let touchStartClientX = 0
let touchStartClientY = 0

const Grid = (props) => {
    const [status, setStatus] = useState({
        board: game.board.board,
        moveable: true,
        inputSeq: '',
        tileSeq: [game.startTile[0], game.startTile[1]],
    })
    const [success, setSuccess] = useState(0)
    const [useImage, setUseImage] = useState(true)
    const [result, setResult] = useState({ moved: false })
    const gridRef = useRef()
    let tileRef = []

    const addEventListeners = () => {
        document.addEventListener('keydown', handleKey)
        gridRef.current.addEventListener('touchstart', handleTouchStart)
        gridRef.current.addEventListener('touchmove', (e) => {
            e.preventDefault()
        })
        gridRef.current.addEventListener('touchend', handleTouchEnd)
    }

    const removeEventListeners = () => {
        document.removeEventListener('keydown', handleKey)
        gridRef.current.removeEventListener('touchstart', handleTouchStart)
        gridRef.current.removeEventListener('touchmove', (e) => {
            e.preventDefault()
        })
        gridRef.current.removeEventListener('touchend', handleTouchEnd)
    }

    const handleTouchStart = (event) => {
        if (event.touches.length > 1) return
        touchStartClientX = event.touches[0].clientX
        touchStartClientY = event.touches[0].clientY
        event.preventDefault()
    }

    const handleTouchEnd = (event) => {
        if (event.touches.length > 0) return
        let dx = event.changedTouches[0].clientX - touchStartClientX
        let absDx = Math.abs(dx)
        let dy = event.changedTouches[0].clientY - touchStartClientY
        let absDy = Math.abs(dy)
        if (Math.max(absDx, absDy) > 40) {
            // (right : left) : (down : up)
            let move = absDx > absDy ? (dx > 0 ? 3 : 1) : dy > 0 ? 2 : 0
            setResult(game.listen(move))
        }
    }

    const handleKey = (event) => {
        let mapped = keyMap[event.keyCode]
        if (mapped !== undefined) {
            setResult(game.listen(mapped))
            event.preventDefault()
        }
    }

    const handleRetry = () => {
        game.reset()
        setStatus({
            board: game.board.board,
            moveable: true,
            inputSeq: '',
            tileSeq: [game.startTile[0], game.startTile[1]],
        })
        setSuccess(0)
        setUseImage(useImage)
        addEventListeners()
        props.scoreHandler(game.score)
    }

    const handleSubmit = async (name) => {
        const response = await fetch('http://localhost:8000/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                inputSeq: status.inputSeq,
                tileSeq: status.tileSeq,
                score: game.score,
            }),
        })
        game.clearBoardTags()
        if (response.ok) {
            window.localStorage.setItem('name', name)
            setSuccess(1)
        } else {
            setSuccess(-1)
            if (response.status === 400) {
                alert(
                    '점수 집계 중 문제가 발생하였습니다. 관리자에게 스크린샷과 함께 제보하세요'
                )
            }
        }
    }

    useEffect(() => {
        imageSize = gsap.getProperty('.tile', 'width')
        tileGap = gsap.getProperty('.tile', 'margin-right')
        addEventListeners()
        return removeEventListeners
    }, [])

    useEffect(() => {
        if (result.moved) {
            let animation = new TimelineMax({ paused: true })
            animation.eventCallback('onComplete', () => {
                props.scoreHandler(game.score)
                if (!result.isMoveable) {
                    removeEventListeners()
                }
                setStatus((prevState) => ({
                    board: game.board.board,
                    moveable: result.isMoveable,
                    inputSeq: prevState.inputSeq + result.direction.toString(),
                    tileSeq: [...prevState.tileSeq, result.newTile],
                }))
            })
            tileRef.forEach((ref, index) => {
                let dx = result.moveVector[index].x * (imageSize + tileGap)
                let dy = result.moveVector[index].y * (imageSize + tileGap)
                animation.to(
                    ref.current,
                    {
                        x: dx,
                        y: dy,
                        duration: 0.1,
                        clearProps: 'transform',
                    },
                    0
                )
            })
            animation.play()
        }
    }, [result])

    let board = status.board.map((row, x) => {
        let tileRow = row.map((tile, y) => {
            tileRef[4 * x + y] = useRef()
            return (
                <Tile
                    key={4 * x + y}
                    tile={tile}
                    useImage={useImage}
                    forwardRef={tileRef[4 * x + y]}
                />
            )
        })
        return (
            <div key={`grid-row-${x}`} className="grid-row">
                {tileRow}
            </div>
        )
    })

    return (
        <div>
            <input
                id="image"
                type="checkbox"
                checked={useImage}
                onChange={() => {
                    setUseImage(!useImage)
                }}
            />
            <label htmlFor="image">Play with School Icons</label>
            <div ref={gridRef} className="grid-container" align="center">
                <Cover
                    display={!status.moveable}
                    success={success}
                    handleRetry={handleRetry}
                    handleSubmit={handleSubmit}
                    score={game.score}
                />
                {board}
            </div>
        </div>
    )
}

export default Grid
