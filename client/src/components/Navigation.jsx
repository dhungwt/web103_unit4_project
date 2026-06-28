import React from 'react'
import '../App.css'
import '../css/Navigation.css'

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><h1>Dream Park 🎡🎠🏰</h1></li>
            </ul>

            <ul>
                <li><a href='/' role='button'>Create Park</a></li>
                <li><a href='/customparks' role='button'>View Parks</a></li>
            </ul>
            
        </nav>
    )
}

export default Navigation