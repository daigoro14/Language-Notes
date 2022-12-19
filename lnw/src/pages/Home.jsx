import React, {useEffect, useState, useRef} from 'react'
import { Link, useParams } from 'react-router-dom'
import '../styles/style.css'
import {url} from '../App'
import {useNavigate} from 'react-router-dom'

export default function Home() {

    const navigate = useNavigate()
    let params = useParams()

    // const [noteDatabase, setNoteDatabase] = useState([])
    const [folder, setFolder] = useState([])
    const [noteLanguage, setNoteLanguage] = useState([])  
    const [filterMode, setFilterMode] = useState([])  
    const [firstLngNote, setFirstLngNote] = useState('')
    const [secondLngNote, setSecondLngNote] = useState('')
    const [checkBoxValue, setCheckBoxValue] = useState([])
    const [noteId, setNoteId] = useState("")
    const [editFirstLanguage, setEditFirstLanguage] = useState("")
    const [editSecondLanguage, setEditSecondLanguage] = useState("")
    const [params1, setParams1] = useState("")

    // setParams1("")

    // console.log("this is params", params)
    useEffect(() => {
            // if (params1) {
            //     fetch(`${url}/note/language/${params1}`, {
            //         mode: 'cors',
            //         // headers: {
            //         //     'Content-Type': 'application/json',
            //         // },
            //     })
            //     .then(res => res.json())
            //     .then(data => {
            //         setFolder(data.folder)
            //         setNoteLanguage(data.noteLanguage)
            //         setFilterMode(data.noteLanguage)
            //     })
            // } else {
            //     fetch(`${url}/note/language`, {
            //         headers: {
            //             'Content-Type': 'application/json',
            //         }
            //     })
            //     .then(res => res.json())
            //     .then(data => {
            //         setFolder(data.folder)
            //         setNoteLanguage(data.noteLanguage)
            //         setFilterMode(data.noteLanguage)
            //     })
            // }
        

        fetchData()
    }, [])
    


    async function fetchData() {
        console.log({params1, params})
        if (params1 || params.language) {
            fetch(`${url}/note/language/${params1 || params.language}`, {
                mode: 'cors',
                // headers: {
                //     'Content-Type': 'application/json',
                // },
            })
            .then(res => res.json())
            .then(data => {
                console.log({data})
                setFolder(data.folder)
                setNoteLanguage(data.noteLanguage)
                setFilterMode(data.noteLanguage)
                console.log({filterMode})
            })
            // navigate(`/${params1 || params.language}`)
        } else {
            await fetch(`${url}/note/language`, {
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
            navigate('/')
        }
    }
    
    async function createNote() {
        await fetch(`${url}/note/language/${params.language}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({firstLanguage: firstLngNote, secondLanguage: secondLngNote})
        })
        .then(res => res.json())

        setFirstLngNote('')
        setSecondLngNote('')
        await fetchData()

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

    useEffect(() => {
            if (noteId) {
                sendEditNote()
            }
    }, [editFirstLanguage, editSecondLanguage, noteId])


    function sendEditNote() {
        fetch(`${url}/note/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstLanguage: editFirstLanguage, 
                secondLanguage: editSecondLanguage, 
                noteId: noteId
            })
        })
        .catch(rejected => {
            console.log(rejected);
        });
    }

    const checkBoxForm = useRef(null)
    const checkBoxInput = useRef(null)

    const handleCheckBoxInput = () => {
        // console.log(checkBoxInput.current.value)
        setCheckBoxValue(checkBoxInput.current.value)
        handleCheckBox()
        // console.log(checkBoxValue)
    }    

    

    function handleCheckBox(){
        // e.preventDefault()
        console.log(checkBoxInput.current.value)
        if (params.language) {
            var url1 = `/note/checkBox/${params.language}`
        } else {
            var url1 = "/note/checkBox"
        }
        
        console.log(url)
        fetch(url1, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({checkBox: checkBoxInput.current.value})
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }


    const handleCheckBoxSubmit = () => {
        checkBoxForm.current.submit()
    }

    // console.log(params.language, params1)

  return (
    <div>
        <Link id="homeLink" to="/">
            <button id="homeButton" onClick={() => setParams1("")}>Home</button>
        </Link>

        <div id="sideMenu">
            <form id="createFolderForm" method="POST" action={`${url}/note/language`}>
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
                                <li className="folderListItem" onClick={() => setParams1(item.languageName)}>
                                    {item.languageName}
                                </li>
                        )
                        })
                    )}
                </ul>
        </div>
        <div id="contentDesign">
            <div id="content">
                {params.language ? (
                    <>
                        <h1 id="folderHeadline">{params.language}</h1>
                        <div id="modeDiv">
                            <button id="modeButton"><Link to={`${url}/slideshow/${params.language}`}>Slide Show</Link></button>
                            <select ref={selectValue} name="filterOption" onChange={handleSelectValue} id="modeSelect">
                                <option defaultValue="all">All</option>
                                <option value="new">New</option>
                                <option value="learnt">Learnt</option>
                            </select>
                        </div>
                        <div id="createNoteForm">
                            <textarea name="firstLanguage" placeholder="Write in your first language. ex. Thank you" value={firstLngNote} onChange={(e) => setFirstLngNote(e.target.value)}/>
                            <textarea name="secondLanguage" placeholder="Write in your targeted language. ex. 谢谢你" value={secondLngNote} onChange={(e) => setSecondLngNote(e.target.value)}></textarea>
                            <button onClick={createNote}></button>
                        </div>
                    </>
                ) : (
                    <>
                    <h1 id="folderHeadline">All Notes</h1>
                    <div id="modeDiv">
                        <button id="modeButton"><Link to="/slideshow">Slide Show</Link></button>
                        <select ref={selectValue} name="filterOption" onChange={handleSelectValue} id="modeSelect">
                            <option name="filterOption" defaultValue="all">All</option>
                            <option name="filterOption" value="new">New</option>
                            <option name="filterOption" value="learnt">Learnt</option>
                        </select>
                    </div>
                </>
                )}
                <div id="noteDiv">
                {filterMode && (
                    filterMode.map((item, index) => {
                        return (
                            <div id="noteContainer">
                                {params.language ? true :(
                                    <p className='languageNameParagraph'>{item.languageName}</p>
                                )}
                                <form className="noteForm" method="POST" action={`${url}/note/edit/${params.language}`}>
                                    <textarea 
                                        className="noteTextarea" 
                                        type="text"
                                        name="firstLanguage"
                                        defaultValue={item.firstLanguage} 
                                        onChange={(e) => {setNoteId(item._id); setEditFirstLanguage(e.target.value); setEditSecondLanguage(item.secondLanguage)}}
                                    />
                                    <textarea 
                                        className="noteTextarea" 
                                        type="text"
                                        defaultValue={`${item.secondLanguage}`} 
                                        name="secondLanguage"
                                        onChange={(e) => {setNoteId(item._id); setEditFirstLanguage(item.firstLanguage); setEditSecondLanguage(e.target.value)}}

                                    />
                                    <button 
                                        className="submitEditButton"
                                        type="submit" 
                                        href="url_to_delete" 
                                        // onClick="return confirm('Are you sure you want to delete this item?');"
                                    >
                                    </button>
                                </form>
                                <div className='optionDropDown'>
                                    <div className="optionButton">
                                        <div className="dotsDiv">
                                            <div className="optionDots"></div>
                                            <div className="optionDots"></div>
                                            <div className="optionDots"></div>
                                        </div>
                                    </div>
                                    <div className="dropDownContent">
                                        <div className="switchDiv">
                                            <span>New</span>
                                                {params.language ? (
                                                    <div className="switch">
                                                        <input 
                                                            // ref={checkBoxInput}
                                                            type="checkbox" 
                                                            name="learnt"
                                                            // defaultChecked={item.learnt}
                                                            value={item._id}
                                                            // onChange={handleCheckBoxInput}
                                                        />
                                                        <p>{item._id}</p>
                                                        <span className="slider round"></span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <form ref={checkBoxForm} action={`${url}/note/language`}>
                                                            <label className="switch">
                                                                <input 
                                                                    type="checkbox" 
                                                                    name="checkbox"
                                                                    defaultChecked={item.learnt}
                                                                    onClick={handleCheckBoxSubmit}
                                                                    value={item.learnt}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </form>
                                                    </>
                                                )}
                                            <span>Learnt</span>
                                        </div>
                                        <button className="deleteButton">Delete</button>
                                    </div>
                                </div>
                            </div>
                        )
                        })
                )}
                </div>
            </div>
        </div>
    </div>
  )
}
