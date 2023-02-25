import React, {useEffect, useState, useRef} from 'react'
import { Link, useParams } from 'react-router-dom'
import '../styles/style.css'
import {url} from '../App'
import NavBar from '../components/NavBar'


export default function SlideShowPage() {

    let params = useParams()

    console.log(params)
    
    const [folder, setFolder] = useState([])
    const [notes, setNotes] = useState([])    
    const [selectValue, setSelectValue] = useState('all')
    const [play, setPlay] = useState(true)
    const [delay, setDelay] = useState(10000)
    const [index, setIndex] = useState(0);
    const [slideNav, setSlideNav] = useState("/SlideShow")
    const [loadingBar, setLoadingBar] = useState({transition: `${delay}ms`, width: "0%", backgroundColor: "greenyellow"})

    const timeoutRef = useRef(null);

    useEffect(() => {
        if (params.language) {
            console.log("useEffect")
            fetch(`${url}/note/slideshow/${params.language}`, {
                mode: 'cors',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
            })
            .then(res => res.json())
            .then(data => {
                setFolder(data.folder)
                if (selectValue === 'learnt') {
                    setNotes(
                        data.noteLanguage.filter((item) => {
                            return item.learnt === true
                        })
                    )
                } else if (selectValue === 'new') {
                    setNotes(
                        data.noteLanguage.filter((item) => {
                            return item.learnt === false
                        })
                    )
                } else if (selectValue === 'all') {
                    setNotes(data.noteLanguage)
                }  
            })
        } else {
            fetchData()
        }
        setIndex(0)
    }, [params, selectValue])

    function fetchData() {
        console.log("fetchData")
        fetch(`${url}/note/slideshow`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => {
            setFolder(data.folder)
            if (selectValue === 'learnt') {
                setNotes(
                    data.noteLanguage.filter((item) => {
                        return item.learnt === true
                    })
                )
            } else if (selectValue === 'new') {
                setNotes(
                    data.noteLanguage.filter((item) => {
                        return item.learnt === false
                    })
                )
            } else if (selectValue === 'all') {
                setNotes(data.noteLanguage)
            }  
            setIndex(0)
        })
    }
    

    function resetTimeout() {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = 0
        }
    }

    function pauseTimeout() {
        setLoadingBar({transition: `0s`, width: "0", backgroundColor: "greenyellow"})
        setPlay(false);
        resetTimeout()
    }

    async function indexTimeout() {
        setLoadingBar({transition: `${delay}ms`, width: "100%"})

        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            if (play) {
                setLoadingBar({transition: `0s`, width: "0", backgroundColor: "greenyellow"})
                setIndex((prevIndex) =>
                    prevIndex === notes.length - 1 ? 0 : prevIndex + 1
            )

            }
        }, delay);
        
        console.log(loadingBar)
        return () => {
            resetTimeout();
        };
    }
    
    useEffect(() => {
        indexTimeout()
      }, [index, delay, selectValue]);


  return (
    <div>
        {/* <Link id="homeLink" to="/">
            <button id="homeButton" onClick={fetchData}>Home</button>
        </Link> */}

        <NavBar
            slideNav={slideNav}
            params={params}
            folder={folder}
        />

        <div id="contentDesign">
            <div id="content">
                {params.language ? (
                    <>
                        <h1 id="folderHeadline">Slide Show {params.language}</h1>
                        <div id="modeDiv">
                            <button id="modeButton"><Link to={`/${params.language}`}>Notes</Link></button>
                            <select onChange={(e) => {setSelectValue(e.target.value)}} name="filterOption" id="modeSelect">
                                <option value="all">All</option>
                                <option value="new">New</option>
                                <option value="learnt">Learnt</option>
                            </select>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 id="folderHeadline">Slide Show All Languages</h1>
                        <div id="modeDiv">
                            <button id="modeButton" onClick={(fetchData)}><Link to="/">Notes</Link></button>
                            <select onChange={(e) => {setSelectValue(e.target.value)}} name="filterOption" id="modeSelect">
                                <option value="all">All</option>
                                <option value="new">New</option>
                                <option value="learnt">Learnt</option>
                            </select>
                        </div>
                    </>
                )}

                {console.log(selectValue, notes)}
                {/* SLIDESHOW */}
                <div className="slideshow">
                    <div key={notes} className="slideshowSlider" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
                        {notes.map((item, index) => {
                                return (
                                    <div className="slide" key={index}>
                                        <div className="slideContent" >
                                            <b><p>First Language:</p></b>
                                            <h4>{item.firstLanguage}</h4><br/>
                                            <><b><p>{item.languageName}: </p></b></>
                                            <h4 className="secondLanguageNote">{item.secondLanguage}</h4>
                                        </div>
                                    </div>
                                )
                        })
                        }
                    </div>
                    
                    <div id="remote">
                        <select defaultValue={10000} onChange={(e) => {setDelay(parseInt(e.target.value)); setLoadingBar({transition: `0s`, width: "0", backgroundColor: "greenyellow"})}} id="setTime">
                            <option value={3000}>3 sec</option>
                            <option value={5000}>5 sec</option>
                            <option value={10000}>10 sec</option>
                            <option value={20000}>20 sec</option>
                        </select>
                        <button id="remoteLeft" onClick={() => {setIndex((prevIndex) => prevIndex - 1 === -1 ? notes.length - 1 : prevIndex - 1); setLoadingBar({transition: `0s`, width: "0", backgroundColor: "greenyellow"})}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                            </svg>
                        </button>

                        {play ? (
                            <button id="playBtn" onClick={() => {pauseTimeout()}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                            </button>
                        ):(
                            <button id="pauseBtn" onClick={() => {setPlay(true); setIndex((prevIndex) => prevIndex === notes.length - 1 ? 0 : prevIndex + 1)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                                </svg>
                            </button>
                        )}

                        <button id="remoteRight" onClick={() => {setIndex((prevIndex) => prevIndex === notes.length - 1 ? 0 : prevIndex + 1); setLoadingBar({transition: `0s`, width: "0", backgroundColor: "greenyellow"})}}>
                            <div className="slideLoading" style={loadingBar}></div>

                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </button>
                    </div>

                    {/* SLIDE SHOW DOTS */}

                    {/* <div className="slideshowDots" >
                        {notes.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`slideshowDot${index === idx ? " active" : ""}`}
                                onClick={() => {
                                    setIndex(idx);
                                }}
                            >
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>
        </div>
    </div>
  )
}
