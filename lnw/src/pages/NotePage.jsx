import React, {useEffect, useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import '../styles/style.css'
import {url} from '../App'
import FolderCmp from '../components/notePage/FolderCmp'
import NotesCmp from '../components/notePage/NotesCmp'


export default function NotePage() {
    let params = useParams()
    const navigate = useNavigate()

    const [folder, setFolder] = useState([])
    const [notes, setNotes] = useState([]) 
    const [folderName, setFolderName] = useState('')
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

        <FolderCmp 
            folder={folder}
            folderName={folderName}
            setFolderName={setFolderName}
            createFolder={createFolder}
            navigate={navigate}
        />

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
                <NotesCmp 
                    params={params}
                    selectValue={selectValue}
                    setSelectValue={setSelectValue}
                    firstLngNote={firstLngNote}
                    setFirstLngNote={setFirstLngNote}
                    secondLngNote={secondLngNote}
                    setSecondLngNote={setSecondLngNote}
                    // createNote={createNote}
                    notes={notes}
                    url={url}
                    setNoteId={setNoteId}
                    setEditFirstLanguage={setEditFirstLanguage}
                    setEditSecondLanguage={setEditSecondLanguage}
                    // handleCheckBox={handleCheckBox}
                    setDisplayEditBanner={setDisplayEditBanner}
                    setDisplayNoteBanner={setDisplayNoteBanner}
                    setDeleteId={setDeleteId}
                    setDisplayFolderBanner={setDisplayFolderBanner}
                    fetchData={fetchData}
                    noteId={noteId}
                    editFirstLanguage={editFirstLanguage}
                    editSecondLanguage={editSecondLanguage}
                />
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
