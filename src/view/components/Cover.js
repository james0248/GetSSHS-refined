import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import TextInput from './TextInput'
import success from '../../public/images/check.svg'
import fail from '../../public/images/x.svg'

const Cover = (props) => {
    const [name, setName] = useState(window.localStorage.getItem('name') || '')
    const [display, setDisplay] = useState(true)
    const ref = useRef()

    const onChange = (event) => {
        setName(event.target.value)
    }

    useEffect(() => {
        if (props.display && display) {
            gsap.fromTo(
                ref.current,
                { opacity: 0 },
                {
                    delay: 0.5,
                    opacity: 1,
                    duration: 1.5,
                    onComplete: () => {
                        setDisplay(false)
                    },
                }
            )
        }
    }, [props.display])

    let submitButton = (
        <a
            id="submit"
            className="button"
            onClick={(e) => {
                e.preventDefault()
                props.handleSubmit(name)
            }}
            onTouchEnd={(e) => {
                e.preventDefault()
                props.handleSubmit(name)
            }}
        >
            Submit
        </a>
    )
    if (props.success === 1) {
        submitButton = <img id="submit" src={success}></img>
    } else if (props.success === -1) {
        submitButton = <img id="submit" src={fail}></img>
    }
    if (props.display) {
        return (
            <div className="grid-cover" ref={ref}>
                <p className="game-over">Game Over!</p>
                <div className="score">You Scored {props.score} points!</div>
                <div className="ranking">
                    <TextInput
                        id="name"
                        label="이름을 입력하세요"
                        onChange={onChange}
                        value={name}
                    />
                    {submitButton}
                </div>
                <a
                    className="button"
                    onClick={() => {
                        setDisplay(true)
                        props.handleRetry()
                    }}
                >
                    Retry
                </a>
            </div>
        )
    }
    return <div></div>
}

export default Cover
