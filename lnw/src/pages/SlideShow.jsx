import React, {useEffect, useState, useRef} from 'react'
import { Link, useParams } from 'react-router-dom'
import '../styles/style.css'
import {url} from '../App'


export default function SlideShow() {

    // FOLLOWED THIS TUTORIAL FOR SLIDESHOW: https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react

    let params = useParams()
    const delay = 2500;

    const [folder, setFolder] = useState([])
    // const [noteLanguage, setNoteLanguage] = useState([])  
    const [notes, setNotes] = useState([])    
    const [selectValue, setSelectValue] = useState('all')
    const [play, setPlay] = useState(true)

    const [index, setIndex] = useState(0);
    const timeoutRef = useRef(null);


    useEffect(() => {
        if (params.language) {
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
    }, [params && selectValue])

    function fetchData() {
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
        }
    }

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
          () =>
            setIndex((prevIndex) =>
              prevIndex === notes.length - 1 ? 0 : prevIndex + 1
            ),
          delay
        );
    
        return () => {
            resetTimeout();
        };
      }, [index]);


    //   console.log(index, notes)

  return (
    <div>
        <Link id="homeLink" to="/">
            <button id="homeButton" onClick={fetchData}>Home</button>
        </Link>

        <div id="sideMenu">
            <form id="createFolderForm" method="POST" action="/note/language">
                <label htmlFor="languageName">Create Note</label>
                <div>
                    <input id="createFolderInput" name="languageName" type="text"/>
                    <button id="createFolderBtn" type="submit">Create</button>
                </div>
            </form>
                <ul id="folderList">
                    {folder && (
                    folder.map((item, index) => {
                        return (
                            <Link 
                                to={`/slideshow/${item.languageName}`} 
                                key={item._id}>
                                    <li 
                                        className="folderListItem" 
                                    >
                                            {item.languageName}
                                    </li>
                            </Link>
                        )
                        })
                    )}
                </ul>
        </div>
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

                
                {/* SLIDESHOW */}
                <div className="slideshow">
                    <div className="slideshowSlider" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
                        {notes.map((item, index) => {
                                return (
                                    <div className="slide" key={index}>
                                        <div className="slideContent">
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
                        <button id="remoteLeft">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                            </svg>
                        </button>

                        {play ? (
                            <button id="playBtn" onClick={() => {setPlay(false)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
                                <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                            </svg>
                            </button>
                        ):(
                            <button id="pauseBtn" onClick={() => {setPlay(true)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-pause" viewBox="0 0 16 16">
                                <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                            </button>
                        )}


                        <button id="remoteRight">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
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
