import imagkit from '../config/imagekit.js';


const uploadfile=async ()=>{
    try {
        const result=await imagekit.upload({
            file: req.file.buffer, 
            fileName:'file.jpg',
            folder: "/my_folder",
    useUniqueFileName: true
        })
        return result.url
        
    } catch (error) {
        console.log(error)
        
    }
}

export default uploadfile;