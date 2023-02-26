import React, { useState, useEffect } from 'react'
import "../../styles/notes.css"
import { Link } from 'react-router-dom'

export default function NotesCmp(props) {
    const [search, setSearch] = useState("") 
    const [firstLngNote, setFirstLngNote] = useState('')
    const [secondLngNote, setSecondLngNote] = useState('')
    const [editFirstLanguage, setEditFirstLanguage] = useState("")
    const [noteId, setNoteId] = useState("")
    const [editSecondLanguage, setEditSecondLanguage] = useState("")

    const params = props.params
    const notes = props.notes
    const url = props.url
    const setDisplayNoteBanner = props.setDisplayNoteBanner
    const setDeleteId = props.setDeleteId
    const fetchData = props.fetchData
    const setSelectValue = props.setSelectValue
    const selectValue = props.selectValue
    const setSlides = props.setSlides

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

  return (
    <>
    {params.language ? (
        <>
            <div id="modeDiv">
                <button id="modeButton" onClick={() => {setSlides(true)}}>
                    Slide Show
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
            <div id="modeDiv">
                <button id="modeButton" onClick={() => {setSlides(true)}}>
                    Slide Show
                </button>
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
                        className="noteTextarea secondNoteInput" 
                        type="text"
                        defaultValue={`${item.secondLanguage}`} 
                        name="secondLanguage"
                        onChange={(e) => {setNoteId(item._id); setEditFirstLanguage(item.firstLanguage); setEditSecondLanguage(e.target.value)}}
                    />
                    {/* <button 
                        className="submitEditButton"
                        type="submit" 
                        href="url_to_delete" 
                    >
                    </button> */}

                    <div className='optionDropDown'>

                        <div className="optionButton">
                            {/* <svg className="dotsDiv" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v2A1.5 1.5 0 0 0 1.5 5h8A1.5 1.5 0 0 0 11 3.5v-2A1.5 1.5 0 0 0 9.5 0h-8zm5.927 2.427A.25.25 0 0 1 7.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0l-.396-.396zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2H1zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
                            </svg> */}
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
    {/* {params.language &&(
        <div id="settingsDiv">
            <button onClick={() => {setDisplayEditBanner("editBanner")}}>
                Edit folder name
            </button>
            <button onClick={() => {setDisplayFolderBanner("dltFolderBanner")}}>
                Delete
            </button>
        </div>
    )} */}
    </>
  )
}
