import React, {useEffect, useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import '../styles/style.css'
import '../styles/banners.css'
import {url} from '../App'
import NotesCmp from '../components/notePage/NotesCmp'
import NavBar from '../components/NavBar'
import SlidesCmp from '../components/slideshow/SlidesCmp'


export default function NotePage() {
    let params = useParams()
    const navigate = useNavigate()

    const [folder, setFolder] = useState([])
    const [notes, setNotes] = useState([]) 
    const [folderName, setFolderName] = useState('')
    const [deleteId, setDeleteId] = useState("")
    const [displayNoteBanner, setDisplayNoteBanner] = useState("hideDltNoteBanner")
    const [displayFolderBanner, setDisplayFolderBanner] = useState("hideDltFolderBanner")
    const [displayEditBanner, setDisplayEditBanner] = useState("hideEditBanner")
    const [editFolder, setEditFolder] = useState(params.language)
    const [selectValue, setSelectValue] = useState('all')
    const [slides, setSlides] = useState(false)

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
        <NavBar 
            setDisplayEditBanner={setDisplayEditBanner}
            setDisplayFolderBanner={setDisplayFolderBanner}
            params={params}
            folder={folder}
            folderName={folderName}
            setFolderName={setFolderName}
            createFolder={createFolder}
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
                {slides ? (
                    <SlidesCmp
                    notes={notes}
                    params={params}
                    selectValue={selectValue}
                    setSelectValue={setSelectValue}
                    fetchData={fetchData}
                    setSlides={setSlides}
                    />    
                ):(
                    <NotesCmp 
                    params={params}
                    notes={notes}
                    url={url}
                    // handleCheckBox={handleCheckBox}
                    setDisplayNoteBanner={setDisplayNoteBanner}
                    setDeleteId={setDeleteId}
                    fetchData={fetchData}
                    selectValue={selectValue}
                    setSelectValue={setSelectValue}
                    setSlides={setSlides}
                    />
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
