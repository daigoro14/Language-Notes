import React, {useEffect, useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import '../styles/style.css'
import {url} from '../App'


export default function Home() {


    let params = useParams()
    const navigate = useNavigate()

    const [folder, setFolder] = useState([])
    const [notes, setNotes] = useState([]) 
    const [folderName, setFolderName] = useState('')
    const [search, setSearch] = useState("") 
    const [firstLngNote, setFirstLngNote] = useState('')
    const [secondLngNote, setSecondLngNote] = useState('')
    const [selectValue, setSelectValue] = useState('all')
    const [noteId, setNoteId] = useState("")
    const [editFirstLanguage, setEditFirstLanguage] = useState("")
    const [editSecondLanguage, setEditSecondLanguage] = useState("")
    const [deleteId, setDeleteId] = useState("")
    const [displayNoteBanner, setDisplayNoteBanner] = useState("hideDltNoteBanner")
    const [displayFolderBanner, setDisplayFolderBanner] = useState("hideDltFolderBanner")
    const [displayEditBanner, setDisplayEditBanner] = useState("hideEditBanner")
    const [editFolder, setEditFolder] = useState(params.language)

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
    

    async function createFolder() {
        await fetch(`${url}/note/language`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({languageName: folderName})
        })
        .then(res => {
            res.json()
            navigate(`/${folderName}`)
        })
        setFolderName('')
        fetchData()

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


    async function handleCheckBox(id){
        await fetch(`${url}/note/checkBox`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({checkBox: id})
        })
        fetchData()
    }

    async function dltNoteBanner() {
        await fetch(`${url}/note/deleteNote`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({deleteId})
        })
        setDisplayNoteBanner("hideDltNoteBanner")
        fetchData()
    }

    async function dltFolderBanner() {
        await fetch(`${url}/note/deleteFolder`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({language: params.language})
        })
        setDisplayFolderBanner("hideDltFolderBanner")
        (params.language === "")
        fetchData()
    }

    async function editFolderName() {
        console.log(editFolder)
        await fetch(`${url}/note/editFolder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({oldLng: params.language, newLng: editFolder})
        })
        .then(res => {
            res.json()
            navigate(`/${editFolder}`)
        })
        setDisplayEditBanner("hideEditBanner")
        fetchData()
    }

  return (
    <div>
        <Link id="homeLink" to="/">
            <button id="homeButton">Home</button>
        </Link>

        {/* FOLDERS */}

        <div id="sideMenu">
            <div id="createFolderForm">
                <label htmlFor="languageName">Create Folder</label>
                    <input 
                        id="createFolderInput" 
                        type="text" 
                        placeholder="Put in a language"
                        Defaultvalue={folderName} 
                        onChange={(e) => {setFolderName(e.target.value)}}
                    />
                    <button id="createFolderBtn" type="submit" onClick={createFolder}>Create</button>
            </div>
                <ul id="folderList">
                    {folder && (
                    folder.map((item) => {
                        return (
                            <li 
                                className="folderListItem" 
                                onClick={() => {navigate(`/${item.languageName}`)}}
                                key={item.languageName}
                            >
                                    {item.languageName}
                            </li>
                        )
                        })
                    )}
                </ul>
        </div>

        {/* BANNERS */}

        <div className={displayNoteBanner}>
            <p>Are you sure you want to delete this note?</p>
            <button className="bannerDltBtn" onClick={dltNoteBanner}>
                Delete
            </button>
            <button className="bannerNvmBtn" onClick={() => {setDisplayNoteBanner("hideDltNoteBanner")}}>
                Nevermind
            </button>
        </div>

        {/* CONTENT */}

        <div id="contentDesign">
            <div id="content">
                {params.language ? (
                    <>
                        <h1 id="folderHeadline" key={params.language}>{params.language}</h1>
                        <div id="modeDiv">

                            <button id="modeButton">
                                <Link to={`/Slideshow/${params.language}`}>
                                    Slide Show
                                </Link>
                            </button>

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
                            <div id="noteContainer" key={item._id}>
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
                                                    <label className="switch">
                                                        <input 
                                                            key={item._id}
                                                            type="checkbox" 
                                                            name="checkbox"
                                                            defaultChecked={item.learnt}
                                                            onClick={() => {handleCheckBox(item._id)}}
                                                        />
                                                        <span className="slider round"></span>
                                                    </label>
                                            <span>Learnt</span>
                                        </div>
                                        <button className="deleteButton" onClick={() => {setDisplayNoteBanner("dltNoteBanner"); setDeleteId(item._id)}}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        )
                        })
                }
                </div>
                {params.language &&(
                    <div id="settingsDiv">
                        <button onClick={() => {setDisplayEditBanner("editBanner")}}>
                            Edit folder name
                        </button>
                        <button onClick={() => {setDisplayFolderBanner("dltFolderBanner")}}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* FOLDER BANNER */}

        <div className={displayFolderBanner}>
            <p>Are you sure you want to delete this Folder?</p>
            <Link to="/">
                <button className="bannerDltBtn" onClick={dltFolderBanner}>
                    Delete
                </button>
            </Link>
            <button className="bannerNvmBtn" onClick={() => {setDisplayFolderBanner("hideDltFolderBanner")}}>
                Nevermind
            </button>
        </div>

        {/* EDIT BANNER */}

        <div className={displayEditBanner}>
            <p>Edit folder name</p>
            <a className="close" onClick={() => {{setDisplayEditBanner("hideEditBanner")}; setEditFolder(params.language)}}></a>
            <div id="editFolderForm">
                <input 
                    id="editFolderInput"
                    // key={editFolder}
                    type="text" 
                    value={editFolder}
                    onChange={(e) => {setEditFolder(e.target.value)}}
                />
                    <button id="editUpdateBtn" onClick={editFolderName}>
                        Update
                    </button>
            </div>
        </div>

    </div>
  )
}
