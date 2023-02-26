import React, { useState } from 'react'
import '../styles/navBar.css'
import {Link, useNavigate} from 'react-router-dom'



export default function NavBar(props) {
  
  const navigate = useNavigate()

  const [navBar, setNavBar] = useState('navShow')
  const params = props.params
  const folder = props.folder
  const folderName = props.folderName
  const setFolderName = props.setFolderName
  const createFolder = props.createFolder
  const setDisplayEditBanner = props.setDisplayEditBanner
  const setDisplayFolderBanner = props.setDisplayFolderBanner

  var prevScrollpos = window.pageYOffset;

  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      setNavBar('navShow')
      console.log('visible')
    } else {
      setNavBar('navHide')
      console.log('invisble')
    }
    prevScrollpos = currentScrollPos;
  }

  return (
    <div className={`navBar ${navBar}`}>
        <button className="lngMenuDrpDwn">
          <svg className="lngMenuBtn" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </button>

        {params.language ? (
          <h1>{params.language}</h1>
        ):(
          <h1>All notes</h1>
        )}

        <button className="settingDrpDwn">
          <svg className="settingBtn" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
          </svg>
        </button>

        {/* Language Menu */}
        <div id="sideMenu">
            <div id="createFolderForm">
                <label htmlFor="languageName">Create Folder</label>
                    <input 
                        id="createFolderInput" 
                        type="text" 
                        placeholder="Put in a language"
                        defaultValue={folderName} 
                        onChange={(e) => {setFolderName(e.target.value)}}
                        required
                    />
                    <button id="createFolderBtn" type="submit" onClick={createFolder}>Create</button>
            </div>
            <ul className="folderList">
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

        {/* Settings Menu */}
        <div className="settingsMenu">
            <ul className="settingsList">
                <li 
                    className="settingsListItem" 
                    // onClick={() => {navigate(`/${item.languageName}`)}}
                >
                  Profile
                </li>
                <li className="settingsListItem">Logout</li>
                {params.language && (
                <>
                    <li className="settingsListItem"
                        onClick={() => {setDisplayEditBanner("editBanner")}}
                    >
                      Edit
                    </li>
                    <li className="settingsListItem dltBtnSettings"
                        onClick={() => {setDisplayFolderBanner("dltFolderBanner")}}
                    >
                      Delete
                    </li>
                </>
                )}
            </ul>
        </div>
    </div>
  )
}

