class AppController {
    constructor() {

        // get all the needed elements references
        this.fileViewEl = document.querySelector('.file-view') 
        this.addMorePhotoBtnEl = document.querySelector('.add-photo')
        this.fileInput = document.querySelector('#file-input')
        this.inputLoadPhotosEl = document.querySelector('#input-load-photos')

        this.files = [] // this is the global file variable that holds all the files
        this.fileViewElements = [] // this is the global variable that holds the file views variable
        this.initialize() // this init the plugin

    }

    initialize() {

        this.initEvents() // call the init events method/function

    }

    initEvents() {

        //check if the element is available or visible
        if(this.inputLoadPhotosEl) {
            // add the click event to the load photos button if true
            this.inputLoadPhotosEl.addEventListener('click', e => {
                //check if the file input exists
                if(this.fileInput) this.fileInput.click()
            })
        }

        //check if the file input element exists
        if(this.fileInput) {
            //if true then add the change event
            this.fileInput.addEventListener('change', e => {

                // if(this.files.length >= 3) return alert('Oops, limit is 3 files...');

                // iterate through the array and push the files to the global files variable
                [...e.target.files].forEach(file => {
                    this.files.push(file)
                })

                this.pluginLoadPhotos(this.files)
                
            })
        }

        //check if the add or attach more files exists
        if(this.addMorePhotoBtnEl) {
            //if true then add the click event to the add more files button element
            this.addMorePhotoBtnEl.addEventListener('click', e => {
                //check if the file input exists
                if(this.fileInput) this.fileInput.click()
            })
        }

    }

    //load photos plugin
    loadPhotos(files) {

        let promises = []

        for(const file of files) {

            promises.push(new Promise((resolve, reject) => {

                const fileReader = new FileReader()
    
                fileReader.onload = _ => {
                    resolve(fileReader.result)
                }
    
                fileReader.onerror = error => {
                    reject(error)
                }

                switch(file.type) {
                    case "audio/mp3":
                    case "audio/mpeg":
                    case "audio/ogg":
                        resolve("img/icon/audio-icon.jpg")
                        break
                    case "video/mp4":
                    case "video/ogg":
                    case "video/webm":
                        resolve("img/icon/video-icon.png")
                        break
                    case "image/png":
                    case "image/jpg":
                    case "image/jpeg":
                    case "image/gif":
                        fileReader.readAsDataURL(file)
                        break
                    default:
                        resolve("img/icon/file-icon.png")
                        
                }
    
            }))

        }

        return Promise.all(promises)

    }

    // append files to the file view
    appendFiles(imgURL, index) {

        const div = document.createElement("div")
        div.classList.add("file")

        div.dataset.index = index

        const btnClose = document.createElement("button")
        btnClose.classList.add("close")
        btnClose.innerHTML = `&times;`

        //add the discard image click event
        this.discardFileEvent(btnClose)

        div.innerHTML = 
        `
            <img src="${imgURL}">
        `

        div.prepend(btnClose)

        this.fileViewElements.push(div)
        
        this.fileViewEl.prepend(div)

    }

    //remove a file from the file view element
    removeFile(position) {

        this.files.splice(position, 1)
        this.pluginLoadPhotos(this.files)
        
    }

    //
    pluginLoadPhotos(files) {

        this.loadPhotos(files).then(responses => {

            // iterate through the array and delete all the visible file El
            this.fileViewElements.forEach(div => {
                if(div) this.fileViewEl.removeChild(div)
            })

            this.fileViewElements = []

            responses.forEach((result, index) => {

                this.appendFiles(result, index)

            })

            //hide the image viewer element
            if(this.files.length == 0) {

                this.toggleFileViewer(true)

            }else {

                this.toggleFileViewer(false)

            }

            

        }).catch(error => {

            console.error(error)

        })

    }

    //toggle the file viewer
    toggleFileViewer(status = false) {

        if(!status) {

            this.inputLoadPhotosEl.style.display = 'none'
            this.fileViewEl.style.display = "flex"  

        }else {

            this.fileViewEl.style.display = "none"  
            this.inputLoadPhotosEl.style.display = "block"

        }
       
    }

    // this method deletes or discards an image from the image viewer
    discardFileEvent(element) {
        element.addEventListener("click", e => {
            const index = element.parentElement.dataset.index
            this.removeFile(index)
        })
    }

}