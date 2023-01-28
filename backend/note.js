const express = require('express')
const Deasync = require('deasync')

const router = express.Router()

const {Language} = require('./models/language')
const {Note} = require('./models/note')

router.get('/language', async (req, res) => {
    const noteLanguage = await Note.find({})
    noteLanguage.sort((a, b) => {
        const dateA = a.date
        const dateB = b.date
        if (dateA > dateB) {
            return -1
        } else if (dateA < dateB) {
            return 1
        } else {
            return 0
        }
    })
    const folder = await Language.find()
    res.json({folder, noteLanguage})
})

router.get('/language/:language', async (req, res) => {
    const noteLanguage = await Note.find({languageName: req.params.language})
    noteLanguage.sort((a, b) => {
        const dateA = a.date
        const dateB = b.date
        if (dateA > dateB) {
            return -1
        } else if (dateA < dateB) {
            return 1
        } else {
            return 0
        }
    })
    // console.log(noteLanguage)
    const folder = await Language.find()
    res.json({folder, noteLanguage})
})

router.post('/language/:language', async (req, res) => {
    // console.log(req.body)
    // console.log(req.params)
    const {firstLanguage, secondLanguage} = req.body
    const languageName = req.params.language
    // const folder = await Language.find({languageName})
    if (firstLanguage, secondLanguage) {
        const newNote = new Note({firstLanguage, secondLanguage, languageName})
        await newNote.save()
    }
    res.send({})
    // res.redirect(`/note/language/${languageName}`)
    // res.redirect(`/${languageName}`)
})

router.post('/language', async (req, res) => {
    console.log('hello', req.body)
    if(req.body.languageName) {
        const folder = new Language({languageName: req.body.languageName})
        await folder.save()
        res.redirect(`/${req.body.languageName}`)
    } else {
        res.redirect('/')
    }
})

router.post('/edit', async (req, res) => {
    const noteID = req.body.noteId
    const firstLanguage = req.body.firstLanguage
    const secondLanguage = req.body.secondLanguage
    const editNote = await Note.findById(noteID)
    await editNote.updateOne({firstLanguage: firstLanguage, secondLanguage: secondLanguage})
    res.send({})
})

router.post('/mode', async (req,res) => {
    console.log('mode', req.body)
    var noteLanguage = await Note.find()
    if (req.body.filterOption == 'learnt') {
        noteLanguage = await Note.find({learnt: true})
    } else if (req.body.filterOption == 'new'){
        noteLanguage = await Note.find({learnt: false})
    }
    console.log(noteLanguage)
    res.redirect('/')
})

router.post('/checkBox', async (req, res) => {
    // await Note.updateOne({_id: req.body.checkBox}, {$set: {learnt: false}})
    console.log("Hi from the backend")

    const note = await Note.findOne({_id: req.body.checkBox})
    console.log(note.learnt)
    if (note.learnt === true) {
        await Note.updateOne({_id: req.body.checkBox}, {$set: {learnt: false}})
    } else {
        await Note.updateOne({_id: req.body.checkBox}, {$set: {learnt: true}})
    }
    res.json({})
    // res.redirect('/')
})

router.post('/checkBox/:language', async (req, res) => {
    const languageName = req.params.language
    const note = await Note.find({_id: req.body.checkBox})
    if (note[0].learnt === true) {
        await Note.updateOne({_id: req.body.checkBox}, {$set: {learnt: false}})
    } else {
        await Note.updateOne({_id: req.body.checkBox}, {$set: {learnt: false}})
    }
    console.log(note[0].learnt)
    // console.log(note)
    
    // res.redirect(`/${languageName}`)
})

// SLIDESHOW

router.get('/slideshow', async (req, res) => {
    const noteLanguage = await Note.find()
    noteLanguage.sort((a, b) => {
        const dateA = a.date
        const dateB = b.date
        if (dateA > dateB) {
            return -1
        } else if (dateA < dateB) {
            return 1
        } else {
            return 0
        }
    })
    // console.log(req.params)
    const folder = await Language.find()
    res.json({folder, noteLanguage})
})

router.get('/slideshow/:language', async (req, res) => {
    const noteLanguage = await Note.find({languageName: req.params.language})
    noteLanguage.sort((a, b) => {
        const dateA = a.date
        const dateB = b.date
        if (dateA > dateB) {
            return -1
        } else if (dateA < dateB) {
            return 1
        } else {
            return 0
        }
    })
    // console.log(req.params)
    const folder = await Language.find()
    res.json({folder, noteLanguage})
})

exports.router = router