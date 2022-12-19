import React, {useEffect, useState, useRef} from 'react'
import { Link, useParams } from 'react-router-dom'
import '../styles/style.css'

export default function SlideShow() {

    // FOLLOWED THIS TUTORIAL FOR SLIDESHOW: https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react

    let params = useParams()
    const delay = 2500;

    const [folder, setFolder] = useState([])
    const [noteLanguage, setNoteLanguage] = useState([])  
    const [filterMode, setFilterMode] = useState([])    
    const [index, setIndex] = React.useState(0);
    const timeoutRef = React.useRef(null);


    useEffect(() => {
        if (params.language) {
            fetch(`/note/slideshow/${params.language}`, {
                mode: 'cors',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
            })
            .then(res => res.json())
            .then(data => {
                setFolder(data.folder)
                setNoteLanguage(data.noteLanguage)
                setFilterMode(data.noteLanguage)
            })
        } else {
            fetchData()
        }
    }, [params.language])

    function fetchData() {
        fetch('/note/slideshow', {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => {
            setFolder(data.folder)
            setNoteLanguage(data.noteLanguage)
            setFilterMode(data.noteLanguage)
        })
    }
    
    const selectValue = useRef(null)

    const handleSelectValue = () => {
        if (selectValue.current.value === 'learnt') {
            console.log(noteLanguage.filter(item => item.learnt))
            setFilterMode(noteLanguage.filter(item => item.learnt))
        } else if (selectValue.current.value === 'new') {
            setFilterMode(noteLanguage.filter(item => item.learnt === false))
        } else if (selectValue.currentvalue === 'all') {
            setFilterMode(noteLanguage)
        }
    }

    function resetTimeout() {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
    }

    React.useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
          () =>
            setIndex((prevIndex) =>
              prevIndex === noteLanguage.length - 1 ? 0 : prevIndex + 1
            ),
          delay
        );
    
        return () => {
            resetTimeout();
        };
      }, [index]);

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
                            <select ref={selectValue} name="filterOption" onChange={handleSelectValue} id="modeSelect">
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
                            <select ref={selectValue} name="filterOption" onChange={handleSelectValue} id="modeSelect">
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
                        {filterMode && (
                            filterMode.map((item, index) => {
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
                        )}
                    </div>
                    <div className="slideshowDots" >
                        {filterMode.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`slideshowDot${index === idx ? " active" : ""}`}
                                onClick={() => {
                                    setIndex(idx);
                                }}
                            >
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
