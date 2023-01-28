import React, {useEffect, useState} from 'react'
import { Link, useParams } from 'react-router-dom'
import '../styles/style.css'
import {url} from '../App'

export default function Home() {

    let params = useParams()

    const [folder, setFolder] = useState([])
    const [notes, setNotes] = useState([]) 
    const [search, setSearch] = useState("") 
    const [firstLngNote, setFirstLngNote] = useState('')
    const [secondLngNote, setSecondLngNote] = useState('')
    const [checkBox, setCheckBox] = useState(false)
    const [selectValue, setSelectValue] = useState('all')
    const [noteId, setNoteId] = useState("")
    const [editFirstLanguage, setEditFirstLanguage] = useState("")
    const [editSecondLanguage, setEditSecondLanguage] = useState("")

    useEffect(() => {
        fetchData()
    }, [params])
    


    async function fetchData() {
        if (params.language) {
            fetch(`${url}/note/language/${params.language}`, {
                mode: 'cors',
            })
            .then(res => res.json())
            .then(data => {
                setFolder(data.folder)
                setNotes(data.noteLanguage)
            })
        } else {
            await fetch(`${url}/note/language`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(res => res.json())
            .then(data => {
                setFolder(data.folder)
                setNotes(data.noteLanguage)
            })
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
        setFirstLngNote('')
        setSecondLngNote('')
        fetchData()

    }


    useEffect(() => {
            if (noteId) {
                sendEditNote()
            }
    }, [editFirstLanguage, editSecondLanguage, noteId])

    console.log(checkBox)

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
    

    // const checkBoxForm = useRef(null)
    // const checkBoxInput = useRef(null)

    // const handleCheckBoxInput = () => {
    //     // console.log(checkBoxInput.current.value)
    //     setCheckBoxValue(checkBoxInput.current.value)
    //     handleCheckBox()
    //     // console.log(checkBoxValue)
    // }    

    

    async function handleCheckBox(id){
        console.log(id)
        // e.preventDefault()
    //     console.log(checkBoxInput.current.value)
    //     if (params.language) {
    //         var url1 = `/note/checkBox/${params.language}`
    //     } else {
    //         var url1 = "/note/checkBox"
    //     }
        
    //     console.log(url)
        await fetch(`${url}/note/checkBox`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({checkBox: id})
        })
        fetchData()
    }



    // const handleCheckBoxSubmit = () => {
    //     checkBoxForm.current.submit()
    // }

    console.log(search)

  return (
    <div>
        <Link id="homeLink" to="/">
            <button id="homeButton">Home</button>
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
                            <Link to={`/${item.languageName}`}>
                                <li className="folderListItem" onClick={fetchData}>
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
                        <h1 id="folderHeadline">{params.language}</h1>
                        <div id="modeDiv">
                            <button id="modeButton"><Link to={`${url}/slideshow/${params.language}`}>Slide Show</Link></button>
                            <select onChange={(e) => {setSelectValue(e.target.value)}} name="filterOption" id="modeSelect">
                                <option value="all">All</option>
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
                        <select onChange={(e) => {setSelectValue(e.target.value)}} name="filterOption" id="modeSelect">
                            <option value="all">All</option>
                            <option value="new">New</option>
                            <option value="learnt">Learnt</option>
                        </select>
                    </div>
                </>
                )}

                <input id="searchBar" onChange={(e) => (setSearch(e.target.value))} placeholder="Search through your notes"/>

                <div id="noteDiv">
                {notes
                .filter((item) => {
                    if (selectValue === 'learnt' && search) {
                        return item.learnt === true && (item.firstLanguage.toLowerCase().includes(search.toLowerCase()) || item.secondLanguage.toLowerCase().includes(search.toLowerCase()))
                    } else if (selectValue === 'learnt') {
                        return item.learnt === true
                    } else if (selectValue === 'new' && search) {
                        return item.learnt === false && (item.firstLanguage.toLowerCase().includes(search.toLowerCase()) || item.secondLanguage.toLowerCase().includes(search.toLowerCase()))
                    } else if (selectValue === 'new') {
                        return item.learnt === false
                    } else if (search) {
                        return item.firstLanguage.toLowerCase().includes(search.toLowerCase()) || item.secondLanguage.toLowerCase().includes(search.toLowerCase())
                    } else if (selectValue === 'all') {
                        return item 
                    }
                })
                .map((item, index) => {
                        return (
                            <div id="noteContainer">
                                {params.language ? true :(
                                    <p className='languageNameParagraph'>{item.languageName}</p>
                                )}
                                <form className="noteForm" method="POST" action={`${url}/note/edit/${params.language}`}>
                                    <textarea 
                                        key={item.firstLanguage}
                                        className="noteTextarea" 
                                        type="text"
                                        name="firstLanguage"
                                        defaultValue={item.firstLanguage} 
                                        onChange={(e) => {setNoteId(item._id); setEditFirstLanguage(e.target.value); setEditSecondLanguage(item.secondLanguage)}}
                                    />
                                    <textarea 
                                        key={item.secondLanguage}
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
                                                    <label className="switch">
                                                        <input 
                                                            key={item._id}
                                                            // ref={checkBoxInput}
                                                            type="checkbox" 
                                                            name="checkbox"
                                                            defaultChecked={item.learnt}
                                                            // value={item._id}
                                                            onClick={() => {handleCheckBox(item._id)}}
                                                        />
                                                        {/* <p>{item._id}</p> */}
                                                        <span className="slider round"></span>
                                                    </label>
                                                ) : (
                                                    <>
                                                        {/* <form ref={checkBoxForm} action={`${url}/note/language`}> */}
                                                            <label className="switch">
                                                                <input 
                                                                    type="checkbox" 
                                                                    name="checkbox"
                                                                    defaultChecked={item.learnt}
                                                                    // onClick={handleCheckBoxSubmit}
                                                                    value={item.learnt}
                                                                />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        {/* </form> */}
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
                }
                </div>
            </div>
        </div>
    </div>
  )
}
