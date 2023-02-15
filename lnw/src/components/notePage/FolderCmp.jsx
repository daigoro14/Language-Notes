import React from 'react'

export default function FolderCmp(props) {
    const folder = props.folder
    const folderName = props.folderName
    const setFolderName = props.setFolderName
    const createFolder = props.createFolder
    const navigate = props.navigate

  return (
    <div id="sideMenu">
        <div id="createFolderForm">
            <label htmlFor="languageName">Create Folder</label>
                <input 
                    id="createFolderInput" 
                    type="text" 
                    placeholder="Put in a language"
                    defaultValue={folderName} 
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
  )
}
