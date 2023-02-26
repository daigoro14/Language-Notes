import React, { useEffect, useRef, useState } from 'react'
import '../../styles/slideShow.css'




export default function SlidesCmp(props) {

const [play, setPlay] = useState(true)
const [noteLength, setNoteLength] = useState()
const [delay, setDelay] = useState(10000)
const [index, setIndex] = useState(0);
const [loadingBar, setLoadingBar] = useState({
    transition: `${delay}ms`, 
    width: "0%", 
    backgroundColor: "greenyellow",
})

const notes = props.notes
const setSelectValue = props.setSelectValue
const selectValue = props.selectValue
const params = props.params
const fetchData = props.fetchData
const setSlides = props.setSlides

const timeoutRef = useRef(null);

useEffect(() => {
        if (selectValue === 'learnt') {
            setNoteLength(notes.filter((item) => {return item.learnt === true}).length)
        } else if (selectValue === 'new') {
            setNoteLength(notes.filter((item) => {return item.learnt === false}).length)
        } else if (selectValue === 'all') {
            setNoteLength(notes.length)
        }

}, [selectValue]);

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

function indexTimeout() {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
        if (play) {
            setIndex((prevIndex) =>
                prevIndex === noteLength - 1 ? 0 : prevIndex + 1
            )
        }
    }, delay);


    return () => {
        resetTimeout();
    };
}

    useEffect(() => {
        indexTimeout()
    }, [index, delay, selectValue]);


  useEffect(() => {
    setLoadingBar({
      transition: `${delay}ms`,
      width: '100%',
    });
  }, [index]);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingBar({
        transition: '0s',
        width: '0',
        backgroundColor: 'greenyellow',
      });
    }, delay - 100);
  
    return () => clearTimeout(timeout);
  }, [loadingBar]);


//   useEffect(() => {
//     setLoadingBar({
//         transition: `${delay}ms`, 
//         width: "100%",
//     })
//     setTimeout(() => {
//         setLoadingBar({
//             transition: `0s`, 
//             width: "0", 
//             backgroundColor: "greenyellow"
//         })
//     }, delay)

//   }, [index]);


  return (
    <>
    {params.language ? (
    <>
        <div id="modeDiv">
            <button id="modeButton" onClick={() => {setSlides(false)}}>
                Notes
            </button>
            <select onChange={(e) => {setSelectValue(e.target.value); {setIndex(0)}; setLoadingBar({transition: `0s`, width: "0", backgroundColor: "greenyellow"})}} name="filterOption" id="modeSelect">
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="learnt">Learnt</option>
            </select>
        </div>
    </>
    ) : (
    <>
        <div id="modeDiv">
            <button id="modeButton" onClick={() => {setSlides(false)}}>
                Notes
            </button>
            <select onChange={(e) => {setSelectValue(e.target.value); setLoadingBar({transition: `0s`, width: "0", backgroundColor: "greenyellow"})}} name="filterOption" id="modeSelect">
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="learnt">Learnt</option>
            </select>
        </div>
    </>
    )}

    {/* SLIDESHOW */}
    <div className="slideshow">
        <div key={notes} className="slideshowSlider" style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
            {notes
            .filter((item) => {
                if (selectValue === 'learnt') {
                    return item.learnt === true
                } else if (selectValue === 'new') {
                    return item.learnt === false
                } else if (selectValue === 'all') {
                    return item
                }
            }).map((item, index) => {
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
            <button id="remoteLeft" onClick={() => {setIndex((prevIndex) => prevIndex - 1 === -1 ? noteLength - 1 : prevIndex - 1); setLoadingBar({transition: `0s`, width: "0", backgroundColor: "greenyellow"})}}>
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
                <button id="pauseBtn" onClick={() => {setPlay(true); setIndex((prevIndex) => prevIndex === noteLength - 1 ? 0 : prevIndex + 1)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                    </svg>
                </button>
            )}

            <button id="remoteRight" onClick={() => {setIndex((prevIndex) => prevIndex === noteLength - 1 ? 0 : prevIndex + 1); setLoadingBar({transition: `0s`, width: "0", backgroundColor: "greenyellow"})}}>
                <div className="slideLoading" style={loadingBar}></div>

                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                </svg>
            </button>
        </div>
    </div>
    </>
  )
}
