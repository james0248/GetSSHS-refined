import React, { useState, useEffect } from 'react'

const LeaderBoard = (props) => {
    const [ranking, setRanking] = useState([])

    const updateRanking = async () => {
        const response = (
            await (await fetch('http://localhost:8000/ranking')).json()
        ).map((info, index) => {
            return (
                <tr key={index} className="ranking-row">
                    <th>{'#' + (index + 1).toString()}</th>
                    <th>{info.name}</th>
                    <th>{info.score}</th>
                </tr>
            )
        })
        setRanking(response)
    }

    useEffect(() => {
        updateRanking()
    }, [])

    return (
        <div className="leaderBoard">
            <div className="ranking-header">
                <h2>LeaderBoard</h2>
                <div
                    onClick={updateRanking}
                    onTouchEnd={updateRanking}
                    className="button"
                    id="refresh"
                >
                    Refresh
                </div>
            </div>
            <hr></hr>
            <table>
                <tbody>
                    <tr className="ranking-row">
                        <th>등수</th>
                        <th>이름</th>
                        <th>점수</th>
                    </tr>
                    {ranking}
                </tbody>
            </table>
        </div>
    )
}

export default LeaderBoard
